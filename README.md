# sync-day

Site simples para organização de atividades diárias. Monorepo com:

- **Frontend**: React + Tailwind CSS + FullCalendar (Vite)
- **Backend**: Express + Sequelize + MySQL
- **Infra**: Docker Compose (db, backend, frontend)

## Funcionalidades

- Página inicial com CTA e navbar
- Cadastro (nome, e-mail, senha) e login (e-mail, senha) com JWT
- CRUD de atividades: nome, descrição, data/hora de início e término, status (pendente, concluída, cancelada)
- Visualização das atividades em calendário e em lista

## Variáveis de ambiente

Nenhum `.env` real é versionado (estão no `.gitignore`). Cada ambiente tem um arquivo de exemplo — copie e ajuste:

| Arquivo de exemplo | Gera | Usado por |
| --- | --- | --- |
| `.env.example` (raiz) | `.env` | **Docker Compose** — centraliza tudo: banco, portas, JWT e URL da API |
| `backend/.env.example` | `backend/.env` | Backend rodando **localmente** (fora do Docker), com `DB_HOST=localhost` |
| `frontend/.env.example` | `frontend/.env` | Frontend rodando **localmente** (`npm run dev`) |

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Pontos importantes:

- **No Docker, só o `.env` da raiz é usado** — o backend recebe as variáveis via `env_file` do compose e o frontend via build arg `VITE_API_URL`
- No frontend, a variável **precisa** do prefixo `VITE_` (regra do Vite)
- Troque `DB_PASSWORD` e `JWT_SECRET` antes de qualquer deploy (gere um segredo com `openssl rand -hex 32`)

## Como rodar com Docker (recomendado)

Pré-requisito: Docker Desktop em execução.

```bash
docker compose up --build
```

Depois acesse:

- Site: http://localhost:5173
- API: http://localhost:3001

Para parar:

```bash
docker compose down
```

## Como rodar localmente (sem Docker)

1. Suba apenas o banco:

```bash
docker compose up db
```

2. Backend (usa `backend/.env`):

```bash
cd backend
npm install
npm run dev
```

3. Frontend (usa `frontend/.env`):

```bash
cd frontend
npm install
npm run dev
```

## Como testar o site

1. Acesse http://localhost:5173 — você verá a página inicial com o CTA **Começar agora**
2. Crie uma conta em **Cadastrar** (nome, e-mail e senha) — você já entra logado
3. Em **Nova Atividade**, crie uma atividade com nome, descrição, início, término e status
4. Em **Minhas Atividades**, veja o calendário e a lista; clique em um evento do calendário ou em **Editar** para alterar/excluir
5. Clique em um dia vazio do calendário para criar uma atividade já com a data preenchida
6. Use **Sair** e entre novamente pela tela **Entrar** (e-mail e senha)

## Deploy (produção)

Arquitetura recomendada (gratuita):

- **Frontend** → Vercel (`frontend/vercel.json` já configurado com rewrite de SPA)
- **Backend** → Render (`render.yaml` na raiz — blueprint pronto)
- **MySQL** → TiDB Cloud Serverless

Em produção o schema do banco é criado via **migrations** (`npm run migrate`, executado automaticamente no build do Render). O `sequelize.sync()` só roda em desenvolvimento. Para MySQL gerenciado, ative `DB_SSL=true` (TLS obrigatório).

Variáveis por serviço:

| Serviço | Variáveis |
| --- | --- |
| Vercel | `VITE_API_URL` = URL do backend no Render + `/api` |
| Render | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (do TiDB), `DB_SSL=true`, `JWT_SECRET`, `FRONTEND_URL` = URL da Vercel |

## Estrutura

```
├── docker-compose.yml
├── .env.example          # modelo das variáveis centralizadas (Docker)
├── backend/
│   ├── Dockerfile
│   ├── .env.example      # modelo das variáveis do backend local
│   └── src/
│       ├── config/       # conexão Sequelize
│       ├── controllers/  # entrada HTTP
│       ├── middlewares/  # auth JWT, validação, erros
│       ├── models/       # User e Activity
│       ├── routes/       # /api/auth e /api/activities
│       ├── services/     # regras de negócio
│       └── validators/   # express-validator
└── frontend/
    ├── Dockerfile
    ├── .env.example      # modelo das variáveis do frontend local
    └── src/
        ├── api/          # axios configurado
        ├── components/   # Navbar, ActivityCalendar
        ├── context/      # sessão de autenticação
        ├── hooks/        # useAuth
        ├── pages/        # Home, Login, Register, Activities, ActivityForm
        └── routes/       # ProtectedRoute
```
