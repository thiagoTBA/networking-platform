# 🚀 Networking Platform  
**AG Sistemas - Soluções em Software**

Plataforma completa para **gestão de rede de membros corporativos**, com fluxo de solicitações, aprovações, convites, controle financeiro, reuniões, avisos e relatórios interativos.  
Desenvolvido como parte de um **teste técnico fullstack**, com foco em arquitetura escalável, boas práticas e experiência administrativa moderna.

---

## 🧩 Stack Principal

| Camada | Tecnologias |
|--------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TailwindCSS 4 |
| **Backend** | Node.js 22, Prisma ORM, SQLite |
| **Autenticação** | Cookies HTTP + JWT + Middleware de proteção |
| **Outros** | Nodemailer, Bcrypt, JSPDF / FileSaver, Recharts |
| **Testes** | Jest + Testing Library |
| **Linguagem** | TypeScript 5.9 |

---

## ⚙️ Instalação e Execução

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/thiagoTBA/networking-platform.git
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

### 4️⃣ Executar em modo desenvolvimento

```bash
npm run dev
```

Acesse em:  
🔗 [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Estrutura do Projeto

```
src/
 ├── app/
 │   ├── api/                      → Rotas da API (Next.js)
 │   │   ├── applications/         → CRUD de solicitações
 │   │   ├── invitations/          → Criação de convites
 │   │   ├── invite/[token]/       → Validação de convite
 │   │   ├── auth/login/           → Autenticação via JWT
 │   │   └── finance/              → API financeira
 │   ├── admin/                    → Painel administrativo
 │   │   ├── dashboard/            → Visão geral (gráficos e KPIs)
 │   │   ├── applications/         → Solicitações
 │   │   ├── finance/              → Controle financeiro
 │   │   ├── meetings/             → Reuniões
 │   │   ├── notices/              → Avisos internos
 │   │   ├── referrals/            → Indicações
 │   │   └── reports/              → Relatórios (PDFs)
 │   ├── login/                    → Tela de login
 │   └── apply/                    → Formulário de solicitação
 ├── lib/
 │   ├── prisma.ts                 → Configuração ORM
 │   ├── mailer.ts                 → Serviço de envio de e-mails
 │   └── auth.ts                   → Geração e validação de tokens JWT
 ├── middleware.ts                 → Proteção global de rotas autenticadas
 ├── scripts/
 │   ├── seed.ts                   → Popular o banco inicial
 │   └── generateMonthlyPayments.ts → Geração automática de mensalidades
 ├── prisma/
 │   ├── schema.prisma             → Modelagem do banco
 │   └── migrations/               → Histórico de versões
 ├── public/                       → Ícones e assets
 ├── __tests__/                    → Testes unitários
 └── globals.css                   → Estilos globais (Tailwind)
```

---

## 🔒 Funcionalidades

| Módulo | Descrição |
|--------|------------|
| **/apply** | Solicitação de entrada na rede |
| **/admin/applications** | Aprovação, rejeição e listagem de pedidos |
| **/admin/finance** | Controle de pagamentos, PDFs e relatórios |
| **/admin/meetings** | Gestão de reuniões e atas |
| **/admin/notices** | Publicação de avisos para membros |
| **/admin/referrals** | Sistema de indicação de novos membros |
| **/api/auth/login** | Login JWT com cookies HTTPOnly |
| **/api/invite/[token]** | Validação de convites personalizados |
| **/scripts/generateMonthlyPayments** | Automatização de mensalidades |
| **/middleware.ts** | Proteção global de rotas autenticadas |

---

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env` com o seguinte conteúdo:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="meu_token_super_seguro_123"
EMAIL_HOST="sandbox.smtp.mailtrap.io"
EMAIL_PORT=587
EMAIL_USER="seu_user_aqui"
EMAIL_PASS="sua_senha_aqui"
BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

Gerar e popular o banco:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 💰 Módulo Financeiro

- Geração automática de **mensalidades** por script (`scripts/generateMonthlyPayments.ts`)  
- Relatórios em **PDF** com `jspdf` + `file-saver`  
- Gráficos com **Recharts**  
- Indicadores de status (**Pago / Pendente / Vencido**)  

---

## 🧱 Arquitetura do Sistema

A aplicação segue um modelo **Fullstack unificado (Next.js App Router)**:

```
Frontend (React + Tailwind)
        ↓
App Router (Next.js 16)
        ↓
API Routes (/api/*)
        ↓
Prisma ORM → SQLite
        ↓
Serviços auxiliares (Mailer, Auth, Reports)
```

- **Autenticação**: JWT com cookie HTTPOnly  
- **Proteção de rotas**: Middleware global  
- **Banco**: SQLite local via Prisma  
- **Arquitetura modular**: Cada módulo (`finance`, `meetings`, `notices` etc.) é independente e escalável  
- **Deploy**: Vercel com Edge Runtime  

---

## ✅ Testes

Rodar testes unitários:

```bash
npm run test
```

Gerar relatório de cobertura:

```bash
npm run test:coverage
```

Inclui:
- Autenticação e cookies  
- Proteção de rotas  
- Models Prisma  
- Páginas e formulários  

---

## ☁️ Deploy

Aplicação hospedada na **Vercel**:  
🔗 [https://networking-platform.vercel.app](https://networking-platform.vercel.app)

---

## 👨‍💻 Autor

**Thiago Brito**  
Desenvolvedor Fullstack  
📧 [thiago_brito@outlook.com](mailto:thiago_brito@outlook.com)

---

## 🟩 Status do Projeto

| Item | Status |
|------|---------|
| Build | ✅ Concluído |
| Deploy | ✅ Online |
| Testes | ✅ Passando |
| Layout Admin | ✅ Sidebar funcional |
| Autenticação | ✅ JWT + Cookie HTTPOnly |
| Banco | ✅ SQLite (Prisma) |
| API | ✅ Modular e protegida |

---

### 🎯 Resultado Final

Painel administrativo completo, estável, moderno e **deployado na Vercel** com **autenticação JWT**, **middleware global** e **módulo financeiro interativo**.  
Pronto para **entrega profissional** 💼
