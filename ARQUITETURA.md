# 🏗️ Arquitetura da Aplicação — Networking Platform

## 🧩 Visão Geral

A aplicação **Networking Platform** foi desenvolvida com **Next.js 16 (App Router)**, adotando uma arquitetura **Fullstack Unificada**.  
O frontend, backend e a camada de domínio coexistem no mesmo repositório, garantindo integração direta entre interface e API.  
Toda a autenticação é feita via **JWT + Cookies HTTP-only**, protegida por **middleware global**.

O objetivo principal é gerenciar o ciclo de vida de um membro da rede:

1. Envio de solicitação via formulário público;  
2. Avaliação e aprovação pelo painel administrativo;  
3. Geração e envio de convites únicos com tokens;  
4. Validação de tokens e cadastro final do novo membro;  
5. Controle de autenticação via cookies HTTP-only;  
6. Administração de mensalidades, reuniões e comunicados internos.

---

## 🧱 Diagrama da Arquitetura

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
        API1[/api/auth/login/]
        API2[/api/applications/]
        API3[/api/invitations/]
        API4[/api/finance/]
    end

    subgraph "Serviços Internos"
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
| **Backend API** | Next.js API Routes | Integração nativa e deploy simplificado (serverless). |
| **Banco de Dados** | SQLite (via Prisma ORM) | Leve, ideal para protótipos e testes técnicos; fácil migração para PostgreSQL. |
| **Autenticação** | JWT + Cookies HTTP-only + Middleware | Seguro, eficiente e compatível com Edge Runtime. |
| **Estilização** | TailwindCSS 4 | Estilo moderno e responsivo com produtividade. |
| **E-mails** | Nodemailer | Envio automatizado de convites e notificações. |
| **Relatórios** | JSPDF / FileSaver / Recharts | PDFs e gráficos interativos. |
| **Testes** | Jest + Testing Library | Cobertura unificada de frontend e backend. |

---

## 🧬 Modelo de Dados (Prisma)

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

## 📂 Estrutura de Componentes

```
src/
 ├── app/
 │   ├── (public)/ → /apply, /login
 │   ├── (private)/ → /admin, /dashboard
 │   ├── api/ → Rotas integradas do backend
 │   └── layout.tsx / globals.css → Layout global
 ├── components/
 │   ├── ui/ → Botões, Inputs, Cards, Badges
 │   └── features/ → ApplicationForm, AdminInviteTable
 ├── lib/ → Prisma, Auth, Mailer, Finance
 ├── scripts/ → Seeds e automações
 └── prisma/ → Schema e migrações
```

---

## 🔌 Endpoints Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/applications` | Cria uma nova solicitação |
| `PATCH` | `/api/applications/:id` | Aprova ou rejeita uma solicitação |
| `POST` | `/api/invitations` | Gera e envia convite |
| `POST` | `/api/auth/login` | Realiza login e cria cookie JWT |
| `GET` | `/api/finance` | Lista pagamentos e relatórios |

---

## 🔒 Fluxo de Autenticação

1. Usuário faz login → `POST /api/auth/login`;  
2. API valida e gera cookie `auth_token` com flags `httpOnly` e `secure`;  
3. Middleware (`middleware.ts`) intercepta todas as rotas:  
   - Não autenticado → redireciona `/login`;  
   - Autenticado → libera `/admin`;  
4. Sessões expiram automaticamente via JWT.

---

## 💰 Fluxo Financeiro

1. Script `generateMonthlyPayments.ts` cria mensalidades automáticas;  
2. Admin visualiza relatórios e status em `/admin/finance`;  
3. Exportação em **PDF** e visualização com **Recharts**;  
4. Persistência garantida via **Prisma ORM + SQLite**.

---

## 🧪 Testes

Rodar testes unitários e cobertura:

```bash
npm run test
npm run test:coverage
```

Inclui:
- Autenticação JWT e cookies  
- Proteção de rotas  
- Modelos Prisma  
- Páginas públicas e privadas  

---

## 🧠 Decisões Técnicas

- **Next.js Fullstack** → Um único ambiente para UI e API.  
- **Prisma ORM** → Modelo relacional seguro e tipado.  
- **JWT + Cookies HTTP-only** → Autenticação segura.  
- **Tailwind + React 19** → Performance e estilo moderno.  
- **Serverless Deploy (Vercel)** → Simplicidade e escalabilidade.  
- **Arquitetura Modular** → Cada módulo (finance, meetings etc.) é independente.

---

## 🧰 Scripts

| Script | Descrição |
|---------|------------|
| `scripts/seed.ts` | Cria dados iniciais |
| `scripts/seedMembers.ts` | Gera membros fictícios |
| `scripts/generateMonthlyPayments.ts` | Cria mensalidades automáticas |
| `npm run test:coverage` | Gera relatório de testes |

---

## ✅ Conclusão

A **Networking Platform** é uma aplicação **modular, escalável e segura**, cobrindo todo o ciclo de adesão e administração de membros.  
O uso do **Next.js 16 com Prisma e JWT** garante uma arquitetura moderna, fácil de manter e ideal para ambientes de produção serverless.

---

**Autor:** Thiago Brito  
📧 [thiago_brito@outlook.com](mailto:thiago_brito@outlook.com)
