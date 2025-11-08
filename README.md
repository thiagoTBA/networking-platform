# 🚀 Networking Platform

Projeto desenvolvido como parte do **Teste Técnico para Desenvolvedor Fullstack**.
Aplicação que gerencia o processo de **solicitação, aprovação e convite de novos membros** de uma rede profissional.

---

## 🧠 Tecnologias Utilizadas

* **Next.js 16 (App Router + Edge Runtime)**
* **TypeScript**
* **TailwindCSS**
* **Prisma ORM + SQLite**
* **Jest + Testing Library**
* **Proxy Middleware (Next 16)**
* **Node.js 22**

---

## ⚙️ Instalação e Execução

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/networking-platform.git
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

> Aplicação disponível em:
> 🔗 [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testes

O projeto utiliza **Jest** para testes unitários.

Executar todos os testes:

```bash
npm run test
```

📦 **Cobertura de testes atual:**

* `proxy.ts` → Proteção de rotas
* `login.route.ts` → Autenticação e cookies
* `sanity.test.ts` → Verificação do ambiente

---

## 🧱 Estrutura de Pastas

```
src/
 ├── app/
 │   ├── api/
 │   │   ├── applications/
 │   │   ├── invitations/
 │   │   ├── invite/[token]/
 │   │   └── login/
 │   ├── admin/
 │   ├── apply/
 │   ├── invite/[token]/
 │   └── login/
 ├── lib/
 │   └── prisma.ts
 ├── proxy.ts
 └── global.css
```

---

## 🔒 Funcionalidades

| Módulo                | Descrição                                     |
| --------------------- | --------------------------------------------- |
| `/apply`              | Envio de pedido de adesão                     |
| `/admin`              | Gerenciamento de solicitações e convites      |
| `/api/login`          | Login e controle de sessão via cookies        |
| `/api/invite/[token]` | Validação e consumo de convites               |
| `proxy.ts`            | Proteção de rotas e redirecionamento dinâmico |

---

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env` com base em `.env.example`:

```
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

Gerar banco local:

```bash
npx prisma migrate dev --name init
```

---

## 🧱 Arquitetura Geral

O projeto utiliza uma arquitetura **Fullstack integrada** com:

* Frontend e Backend no mesmo monorepo (Next.js App Router)
* Banco relacional SQLite via Prisma ORM
* Autenticação baseada em cookies (sem dependência externa)
* Testes unitários simulando ambiente Next Edge Runtime

---

## 👨‍💻 Autor

**Thiago Brito**
Desenvolvedor Fullstack
📧 contato: [thiagobrito.dev@exemplo.com](mailto:thiagobrito.dev@exemplo.com)

---

## ✅ Status do Projeto

🟩 100% Concluído
🤪 Testes: 6/6 passando
📦 Build: ok
🔒 Segurança e autenticação: validada
