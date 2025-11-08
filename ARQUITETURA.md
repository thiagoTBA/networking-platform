 🏗️ Arquitetura da Aplicação

## 🧩 Visão Geral

A aplicação **Networking Platform** foi desenvolvida com **Next.js 16 (App Router)**, adotando uma arquitetura **Fullstack Unificada** — o frontend e o backend coexistem em um mesmo repositório, permitindo SSR, API Routes e controle de autenticação integrados.

O sistema tem como objetivo:

1. Permitir que candidatos enviem solicitações de ingresso;
2. Habilitar administradores a aprovar ou rejeitar aplicações;
3. Gerar convites únicos com tokens vinculados ao banco;
4. Validar tokens e registrar novos membros;
5. Controlar autenticação via cookies de sessão HTTP-only.

---

## 🧱 Diagrama de Arquitetura

```mermaid
flowchart TD
    A[Usuário /apply] -->|POST /api/applications| B[(Banco Prisma)]
    B -->|GET /api/applications| C[Admin /admin]
    C -->|POST /api/invitations| D[Cria Convite + Token]
    D -->|GET /api/invite/[token]| E[Valida Token]
    E -->|POST /api/login| F[Cria Cookie de Sessão]
    F -->|Acesso liberado| G[Painel Admin]

⚙️ Stack Técnica
Camada	Tecnologia	Justificativa
Frontend / SSR	Next.js 16	Framework moderno, rápido e com integração total de API Routes
Banco de Dados	SQLite via Prisma ORM	Simples, leve e ideal para protótipos e testes técnicos
Estilo	TailwindCSS	Consistência visual e produtividade
Autenticação	Cookies HTTP-only + Proxy	Seguro, simples e aderente a ambientes Edge
Testes	Jest + Testing Library	Verificação unificada de backend e frontend
Middleware/Proxy	proxy.ts	Controle centralizado de rotas protegidas
🔄 Fluxo de Dados

    O usuário acessa /apply e envia os dados do formulário → armazenados em Application;

    O admin, na rota /admin, visualiza as aplicações e decide aprovar/rejeitar;

    Quando aprovado, é criado um Invitation com token único;

    O convidado acessa /invite/[token], validando o token na API;

    A API gera cookie de sessão (auth_token) e redireciona para /admin.

🔒 Fluxo de Autenticação

    O usuário faz login → rota /api/login;

    A API cria um cookie auth_token com httpOnly;

    O arquivo proxy.ts (substituto do middleware) intercepta rotas:

        Se sem token, redireciona para /login;

        Se logado, redireciona para /admin.

🧬 Modelo de Dados (Prisma)

model Application {
  id        String   @id @default(cuid())
  name      String
  email     String
  status    String   @default("pending")
  createdAt DateTime @default(now())
}

model Invitation {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  createdAt DateTime @default(now())
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?
  createdAt DateTime @default(now())
}

🧠 Decisões Técnicas

    Next.js 16: aproveita o App Router e o novo padrão de Proxy Middleware;

    SQLite: zero dependências externas, ideal para ambientes de teste;

    Prisma ORM: abstrai SQL e facilita evolução do modelo de dados;

    Jest + Testing Library: garante isolamento de testes sem dependências do servidor;

    Proxy ao invés de Middleware: compatível com o padrão do Next 16+ e simplifica o controle de autenticação.

🚀 Escalabilidade e Futuras Extensões

    O banco de dados pode ser migrado facilmente para PostgreSQL ou PlanetScale;

    A arquitetura permite adicionar módulos sem quebrar compatibilidade, como:

        Sistema de indicações entre membros;

        Dashboard de métricas com gráficos (Recharts);

        Módulo de comunicação interna (mensagens e agradecimentos);

    O Proxy permite adição de níveis de permissão (Admin, Membro, Visitante).