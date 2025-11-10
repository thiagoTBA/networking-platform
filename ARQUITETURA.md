# 🏗️ Arquitetura da Aplicação — Networking Platform

## 🧩 Visão Geral

A aplicação **Networking Platform** foi desenvolvida com **Next.js 16 (App Router)**, adotando uma arquitetura **Fullstack Unificada**.  
O frontend, backend e camada de domínio coexistem no mesmo repositório, com renderização SSR, API Routes, autenticação JWT + cookies e controle via Proxy Middleware.

O objetivo principal é gerenciar todo o ciclo de vida de um membro da rede:

1. Envio de solicitação de adesão via formulário público;
2. Avaliação e aprovação pelo painel administrativo;
3. Geração de convites únicos com tokens;
4. Validação de tokens e cadastro final do novo membro;
5. Controle de autenticação via cookies HTTP-only;
6. Administração de mensalidades, reuniões e comunicados internos.

---

## 🧱 Diagrama da Arquitetura

O diagrama a seguir ilustra a interação entre o **frontend**, **middleware**, **API backend**, **serviços internos** e **banco de dados**.

```mermaid
flowchart TD
    subgraph "Usuário (Browser)"
        A[/apply - Formulário/]
        B[/login - Acesso/]
        C[/admin - Painel/]
        D[/invite/[token] - Convite/]
    end

    subgraph "Next.js (App Router)"
        direction TB
        M[Middleware / Proxy]
        API1[/api/login/]
        API2[/api/applications/]
        API3[/api/invitations/]
        API4[/api/finance/]
    end

    subgraph "Serviços (Domínio)"
        S1[Auth Service - JWT + Cookies]
        S2[Mailer Service - Nodemailer]
        S3[Prisma ORM - Banco]
        S4[Finance Service - PDF + Recharts]
    end

    subgraph "Banco de Dados (SQLite via Prisma)"
        DB[(Database)]
    end

    A --> API2
    D --> API3
    B --> API1
    C --> API4
    API1 --> S1 --> DB
    API2 --> S3
    API3 --> S2 --> DB
    API4 --> S4 --> DB
    M --> API1
    M --> API2
    M --> API3
    M --> API4
```

---

## ⚙️ Stack Técnica

| Camada | Tecnologia | Justificativa |
|--------|-------------|----------------|
| **Frontend / SSR** | Next.js 16 (App Router + Edge Runtime) | Framework moderno, rápido e unificado com API Routes. |
| **Backend API** | Next.js API Routes | Facilita deploy e integração, elimina necessidade de servidor separado. |
| **Banco de Dados** | SQLite (via Prisma ORM) | Leve, prático e ideal para protótipos; migração futura para PostgreSQL simples. |
| **Autenticação** | Cookies HTTP-only + JWT + Proxy | Seguro e compatível com Edge Runtime. |
| **Estilização** | TailwindCSS 4 | Design rápido e consistente. |
| **E-mails** | Nodemailer | Envio de convites e notificações. |
| **Relatórios e Gráficos** | JSPDF + FileSaver + Recharts | Geração de PDFs e dashboards visuais. |
| **Testes** | Jest + Testing Library | Cobertura completa de backend e frontend. |

---

## 🧬 Modelo de Dados (Prisma)

O banco foi expandido para suportar finanças, reuniões e avisos.

```prisma
model Application {
  id        String     @id @default(cuid())
  name      String
  email     String
  company   String?
  reason    String?
  status    String     @default("PENDING")
  createdAt DateTime   @default(now())
  invitation Invitation?
}

model Invitation {
  id            String   @id @default(cuid())
  email         String
  token         String   @unique
  status        String   @default("PENDING")
  expires       DateTime
  createdAt     DateTime @default(now())
  applicationId String   @unique
  application   Application @relation(fields: [applicationId], references: [id])
  usedByUser    User?
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  passwordHash String?
  createdAt    DateTime @default(now())
  invitationId String?  @unique
  invitation   Invitation? @relation(fields: [invitationId], references: [id])
  payments     Payment[]
}

model Payment {
  id          String   @id @default(cuid())
  userId      String
  amount      Float
  status      String   @default("PENDING")
  dueDate     DateTime
  paidAt      DateTime?
  user        User     @relation(fields: [userId], references: [id])
}

model Meeting {
  id        String   @id @default(cuid())
  title     String
  date      DateTime
  notes     String?
}

model Notice {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

---

## 📂 Estrutura de Componentes (Frontend)

Organização de rotas e componentes:

```
src/
 ├── app/
 │   ├── (public)/ → Rotas públicas (/apply, /login)
 │   ├── (private)/ → Rotas privadas (/admin, /dashboard)
 │   ├── api/ → Backend integrado
 │   └── layout.tsx / globals.css → Layouts e estilos globais
 ├── components/
 │   ├── ui/ → Botões, Inputs, Cards, Badges
 │   └── features/ → Componentes lógicos (ApplicationForm, AdminInviteTable)
 ├── lib/ → Prisma, Auth, Mailer, Finance
 ├── scripts/ → Automação (Seed, Geração de Mensalidades)
 └── prisma/ → Schema, Migrações, Seeds
```

---

## 🔌 Definição da API

Principais endpoints REST internos:

### 1️⃣ Criar Solicitação de Adesão
`POST /api/applications`

```json
{
  "name": "string",
  "email": "string",
  "company": "string",
  "reason": "string"
}
```

Retorno:
```json
{
  "id": "cuid-123",
  "status": "PENDING"
}
```

---

### 2️⃣ Gerar Convite
`POST /api/invitations`

```json
{
  "applicationId": "cuid-abc123"
}
```

Retorno:
```json
{
  "token": "unique-secure-token",
  "generatedInviteLink": "/invite/unique-secure-token"
}
```

---

### 3️⃣ Controle Financeiro
`GET /api/finance`

Retorna histórico de pagamentos e status.

---

## 🔒 Fluxo de Autenticação

1. Usuário faz login (`POST /api/login`);
2. API valida credenciais e cria cookie `auth_token` com flags `httpOnly`, `secure`, `path=/`;
3. O **proxy.ts** intercepta todas as requisições:
   - Se não autenticado → redireciona para `/login`;
   - Se autenticado → libera acesso a `/admin`;
4. Sessões são verificadas e expiradas via JWT.

---

## 💰 Fluxo Financeiro

1. Script `generateMonthlyPayments.ts` cria mensalidades automaticamente;
2. Admin visualiza relatórios via dashboard (Recharts);
3. Usuário pode exportar relatórios em **PDF**;
4. Todos os registros persistem via `Prisma` no SQLite.

---

## 🧪 Testes

- **proxy.test.ts** → Rotas protegidas  
- **login.test.ts** → Autenticação e cookies  
- **ApplyPage.test.tsx** → Formulário de adesão  
- **memberModel.test.ts** → ORM  
- **sanity.test.ts** → Ambiente  

Execução:
```bash
npm run test
npm run test:coverage
```

---

## 🧠 Decisões Técnicas

- **Fullstack Unificado** → Integração direta entre UI e API.
- **Proxy.ts ao invés de Middleware** → Compatível com Edge Runtime no Next 16.
- **Prisma ORM** → Abstração robusta de banco e migração futura simples.
- **TailwindCSS + React 19** → Produtividade e performance.
- **Nodemailer** → Convites e notificações automatizadas.
- **Recharts / JSPDF** → Visualização e relatórios financeiros modernos.

---

## 🧰 Scripts de Automação

| Script | Função |
|---------|--------|
| `scripts/seedMembers.ts` | Popular base com membros de teste |
| `scripts/generateMonthlyPayments.ts` | Gerar mensalidades automaticamente |
| `prisma/seed.ts` | Criar dados iniciais |
| `npm run test:coverage` | Gerar cobertura de testes |

---

## ✅ Conclusão

A **Networking Platform** é uma aplicação **modular, segura e escalável**, que cobre desde o fluxo de adesão até o gerenciamento financeiro e administrativo.  
A arquitetura favorece reuso, performance e deploy simplificado em ambientes serverless.

---

**Autor:** Thiago Brito  
📧 [thiago_brito@outlook.com](mailto:thiago_brito@outlook.com)
