🏗️ Arquitetura da Aplicação (Networking Platform)

## 🧩 Visão Geral

A aplicação **Networking Platform** foi desenvolvida com **Next.js 16 (App Router)**, adotando uma arquitetura **Fullstack Unificada**. O frontend e o backend coexistem no mesmo repositório, permitindo SSR, API Routes e controle de autenticação integrados.

O sistema tem como objetivo principal cobrir o fluxo de admissão de novos membros:
1.  Permitir que candidatos enviem solicitações de ingresso via formulário público;
2.  Habilitar administradores a aprovar ou rejeitar essas aplicações;
3.  Gerar convites únicos com tokens (vinculados à aplicação);
4.  Validar tokens e permitir o cadastro final do novo membro;
5.  Controlar a autenticação de administradores via cookies de sessão HTTP-only.

---

## 🧱 Diagrama da Arquitetura

O diagrama abaixo ilustra os principais componentes da solução (Frontend, API Backend e Banco de Dados) e como eles se comunicam.

```mermaid
flowchart TD
    subgraph "Usuário (Browser)"
        direction LR
        A[Formulário /apply]
        C[Admin Panel /admin]
        E[Página de Convite /invite/[token]]
    end

    subgraph "Backend (Next.js API Routes)"
        direction LR
        B[POST /api/applications]
        D[GET /api/applications]
        F[POST /api/invitations]
        G[GET /api/invite/[token]]
    end

    subgraph "Banco de Dados (SQLite via Prisma)"
        H[(Database)]
    end

    A --> B --> H
    C --> D --> H
    C --> F --> H
    E --> G --> H

⚙️ Stack Técnica

Camada	Tecnologia	Justificativa
Frontend / SSR	Next.js 16 (App Router)	Framework moderno, rápido e com integração total de API Routes.
Backend API	Next.js API Routes	Unifica o projeto, simplifica o deploy e é ideal para a stack.
Banco de Dados	SQLite (via Prisma ORM)	Justificativa: Simples, leve, sem dependências externas e ideal para protótipos e testes técnicos. O Prisma facilita a migração futura para PostgreSQL se necessário.
Estilo	TailwindCSS	Consistência visual, design system utilitário e alta produtividade.
Autenticação	Cookies HTTP-only + Proxy	Seguro (previne XSS), simples e aderente a ambientes Edge.
Testes	Jest + Testing Library	Verificação unificada de backend e frontend.

🧬 Modelo de Dados (Prisma)

O esquema do banco de dados foi projetado para suportar o fluxo de admissão e futuras expansões, com os relacionamentos corretos entre as entidades.
Snippet de código

// schema.prisma

model Application {
  id        String     @id @default(cuid())
  name      String
  email     String
  company   String?
  reason    String?
  status    String     @default("PENDING") // PENDING, APPROVED, REJECTED
  createdAt DateTime   @default(now())

  // Relacionamento: Uma aplicação pode ter UM convite
  invitation Invitation?
}

model Invitation {
  id        String   @id @default(cuid())
  email     String   // Email de quem foi convidado (pode ser o da aplicação)
  token     String   @unique
  status    String   @default("PENDING") // PENDING, COMPLETED
  expires   DateTime // Data de expiração do convite
  createdAt DateTime @default(now())

  // Chave estrangeira para a aplicação
  applicationId String      @unique
  application   Application @relation(fields: [applicationId], references: [id])

  // Relacionamento: O convite pode ser usado por UM usuário
  usedByUser    User?
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  passwordHash String?  // Hash da senha para login
  createdAt    DateTime @default(now())

  // Chave estrangeira para o convite que foi usado
  invitationId String?     @unique
  invitation   Invitation? @relation(fields: [invitationId], references: [id])
  
  // Futuros relacionamentos:
  // referralsMade Referral[] @relation("madeBy")
  // referralsReceived Referral[] @relation("receivedBy")
}

📂 Estrutura de Componentes (Frontend)

A organização de componentes no Next.js (App Router) foca na reutilização e separação de responsabilidades (Separation of Concerns).

    /app/: Contém as rotas principais da aplicação.

        /app/(public)/: Grupo de rotas públicas (ex: /apply, /login).

        /app/(private)/: Grupo de rotas privadas (ex: /admin, /dashboard). Protegidas pelo proxy.ts.

        /app/api/: Todas as rotas de backend.

    /components/ui/: Componentes "burros" (Dumb Components) e reutilizáveis, focados em UI e design (ex: Button.tsx, Input.tsx, Card.tsx, Badge.tsx).

    /components/features/: Componentes "inteligentes" (Smart Components) que contêm lógica de negócios e estado, compostos por componentes ui (ex: ApplicationForm.tsx, AdminInviteTable.tsx).

    /lib/: Funções utilitárias, hooks customizados (useUser), instância do cliente Prisma (prisma.ts) e helpers.

🔌 Definição da API (Endpoints e Schemas)

Abaixo estão 3 dos principais endpoints da API (REST) que suportam o fluxo de admissão.

1. Enviar Intenção de Participação

    Endpoint: POST /api/applications

    Descrição: Usado pelo formulário público (/apply) para criar uma nova aplicação.

    Request Body (JSON):
    JSON

{
  "name": "string",
  "email": "string",
  "company": "string",
  "reason": "string"
}

Response (201 - Created):
JSON

    {
      "id": "cuid-12345",
      "name": "string",
      "email": "string",
      "status": "PENDING"
    }

2. Listar Intenções (Admin)

    Endpoint: GET /api/applications

    Descrição: Usado pela área do administrador (/admin) para listar todas as intenções pendentes.

    Request Body: (Nenhum)

    Response (200 - OK):
    JSON

    [
      {
        "id": "cuid-12345",
        "name": "string",
        "email": "string",
        "company": "string",
        "reason": "string",
        "status": "PENDING",
        "createdAt": "datetime"
      }
    ]

3. Aprovar Intenção e Gerar Convite

    Endpoint: POST /api/invitations

    Descrição: Ação do admin para aprovar uma Application e gerar um Invitation com token.

    Request Body (JSON):
    JSON

{
  "applicationId": "cuid-1g2f3h4"
}

Response (201 - Created): (Simula o envio de e-mail logando o token)
JSON

    {
      "id": "cuid-invite-6789",
      "token": "unique-secure-token-abc",
      "email": "string",
      "status": "PENDING",
      "expires": "datetime",
      "generatedInviteLink": "/invite/unique-secure-token-abc"
    }

🔒 Fluxo de Autenticação

    O usuário (admin) faz login via POST /api/login.

    A API valida as credenciais e cria um cookie auth_token com as flags httpOnly, secure e path=/.

    O arquivo proxy.ts (substituto do middleware no Next.js 16 Edge Runtime) intercepta todas as requisições.

        Se o usuário tentar acessar /admin (ou outra rota privada) sem o auth_token, ele é redirecionado para /login.

        Se o usuário tentar acessar /login com o auth_token, ele é redirecionado para /admin.

        O proxy.ts também é responsável por validar o cookie de sessão.

🧠 Decisões Técnicas Adicionais

    Fullstack Unificado: Escolhido para simplificar o desenvolvimento e o deploy, reduzindo a complexidade de gerenciar dois repositórios (frontend e backend) separados.

    Prisma ORM: Abstrai o SQL e facilita a evolução do modelo de dados. A geração de tipos (types) automática para o frontend é um grande bônus de produtividade.

    Proxy ao invés de Middleware: O Next.js 16+ tem restrições no middleware em ambientes Edge. O uso do proxy.ts (na pasta src) é o novo padrão recomendado para controle de autenticação e proteção de rotas, sendo totalmente compatível.