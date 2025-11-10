# 🚀 Networking Platform  
**AG Sistemas - Soluções em Software**

Plataforma profissional para **gestão de rede de membros**, permitindo solicitações, aprovações, convites, controle financeiro, reuniões e avisos internos.  
Desenvolvido como parte de um **teste técnico fullstack** com foco em arquitetura moderna e escalabilidade.

---

## 🧩 Stack Principal

| Camada | Tecnologias |
|--------|--------------|
| **Frontend** | Next.js 16 (App Router + Edge Runtime), React 19, TailwindCSS 4 |
| **Backend** | Node.js 22, Prisma ORM, SQLite |
| **Autenticação** | Cookies HTTP + JWT + Middleware Proxy |
| **Outros** | Nodemailer (e-mails), Bcrypt (hash), JSPDF / FileSaver (relatórios PDF), Recharts (gráficos) |
| **Testes** | Jest + Testing Library |
| **Linguagem** | TypeScript 5.9 |

---

## ⚙️ Instalação e Execução

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/thiagotba/networking-platform.git
cd networking-platform
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Gerar o Prisma Client

```bash
npx prisma generate
```

### 4️⃣ Rodar em modo de desenvolvimento

```bash
npm run dev
```

Acesse em:  
🔗 [http://localhost:3000](http://localhost:3000)

---

## 🧱 Estrutura de Pastas

```
src/
 ├── app/
 │   ├── api/
 │   │   ├── applications/        → Gerenciamento de solicitações
 │   │   ├── invitations/         → Criação e envio de convites
 │   │   ├── invite/[token]/      → Validação de token de convite
 │   │   ├── login/               → Autenticação e cookies
 │   │   └── finance/             → API de controle financeiro
 │   ├── admin/
 │   │   ├── applications/        → Painel de solicitações
 │   │   ├── finance/             → Gestão de pagamentos e mensalidades
 │   │   ├── meetings/            → Agenda e atas de reuniões
 │   │   ├── notices/             → Avisos e comunicados internos
 │   │   ├── referrals/           → Indicações e networking
 │   │   └── dashboard/           → Painel de estatísticas (Recharts)
 │   ├── apply/                   → Formulário de adesão
 │   ├── invite/[token]/          → Página de convite
 │   └── login/                   → Tela de login
 ├── lib/
 │   ├── prisma.ts                → Configuração ORM
 │   ├── mailer.ts                → Serviço de e-mail (Nodemailer)
 │   └── auth.ts                  → Validação JWT e sessão
 ├── middleware.ts                → Proxy e proteção de rotas
 ├── scripts/
 │   ├── seedMembers.ts           → Geração de membros fake
 │   └── generateMonthlyPayments.ts → Geração de mensalidades automáticas
 ├── prisma/
 │   ├── schema.prisma            → Modelagem de banco
 │   ├── migrations/              → Histórico de migrações
 │   └── seed.ts                  → Popular dados iniciais
 ├── __tests__/                   → Testes unitários
 ├── public/                      → Assets e ícones
 └── globals.css                  → Estilos globais
```

---

## 🔒 Funcionalidades

| Módulo | Descrição |
|--------|------------|
| **/apply** | Solicitação de entrada na rede |
| **/admin/applications** | Aprovação e rejeição de pedidos |
| **/admin/finance** | Controle financeiro, geração de boletos e PDFs |
| **/admin/meetings** | Gerenciamento de reuniões e atas |
| **/admin/notices** | Avisos internos para membros |
| **/admin/referrals** | Sistema de indicação de novos membros |
| **/api/login** | Login e sessão (cookies + JWT) |
| **/api/invite/[token]** | Validação de convites |
| **/scripts/generateMonthlyPayments** | Automatização de mensalidades |
| **/proxy.ts / middleware.ts** | Proteção de rotas autenticadas |

---

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env` com base em `.env.example`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu_token_seguro"
EMAIL_USER="seu_email@provedor.com"
EMAIL_PASS="sua_senha"
NODE_ENV="development"
```

Gerar banco e rodar migrações:

```bash
npx prisma migrate dev --name init
```

---

## 🧪 Testes

O projeto utiliza **Jest** + **Testing Library**.

Rodar testes unitários:

```bash
npm run test
```

Gerar relatório de cobertura:

```bash
npm run test:coverage
```

📦 Testes existentes:
- `proxy.test.ts` → Proteção de rotas  
- `login.test.ts` → Autenticação e cookies  
- `memberModel.test.ts` → Validação ORM  
- `ApplyPage.test.tsx` → Formulário de adesão  
- `sanity.test.ts` → Sanidade e ambiente  

---

## 📊 Módulo Financeiro 

- Geração automática de **mensalidades** com script agendável.  
- Relatórios em **PDF** (via `jspdf` e `file-saver`).  
- Dashboard com **gráficos interativos** (`Recharts`).  
- Histórico de pagamentos vinculado a cada membro.

---

## 🏗️ Arquitetura Geral

O projeto segue uma arquitetura **Fullstack unificada**, com:
- Frontend e Backend integrados via App Router.
- Middleware centralizado controlando autenticação JWT e cookies.
- Serviços isolados (Mailer, Prisma, Auth, Finance).
- Scripts de automação (semente, relatórios e mensalidades).

---

## 👨‍💻 Autor

**Thiago Brito**  
Desenvolvedor Fullstack  
📧 [thiago_brito@outlook.com](mailto:thiago_brito@outlook.com)

---

## ✅ Status do Projeto

🟩 **100% Concluído e atualizado**  
🧪 Testes: todos passando  
📦 Build: validada  
🔒 Segurança e autenticação revisadas  
💰 Módulo financeiro implementado  
📈 Painel administrativo completo  
