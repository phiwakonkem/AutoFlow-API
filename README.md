# AutoFlow API

The Express + Socket.IO backend powering **[AutoFlow Dashboard](https://github.com/phiwakonkem/AutoFlow-Dashboard)** — manages automation workflows, simulates AI content generation, and streams execution events in real time.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4-black?style=flat-square&logo=socket.io)

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/workflows` | List all workflows |
| `POST` | `/api/workflows` | Create a workflow (`name`, `description`, `trigger`, `actions`) |
| `POST` | `/api/ai/generate` | Generate content — body: `{ prompt, type: 'email' \| 'social' \| 'summary' }` |

Workflow data is seeded and stored in-memory. The AI generation endpoint currently returns **templated text** based on the `type`, not a real LLM call — a placeholder to build the real integration against later.

Socket.IO emits `workflow_executed` events when a workflow runs, which the frontend's live execution log listens for.

## Tech Stack

Node.js (ESM) · Express 4 · Socket.IO 4 · dotenv · CORS

## Getting Started

### Prerequisites

- Node.js 20+

### 1. Clone the repository

```bash
git clone https://github.com/phiwakonkem/AutoFlow-API.git
cd AutoFlow-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. (Optional) Environment variables

```env
PORT=3002
```

### 4. Run the server

```bash
npm run dev    # node --watch, auto-restart
# or
npm start
```

The server runs on `http://localhost:3002` by default.

## Pairs With

- Frontend: **[AutoFlow Dashboard](https://github.com/phiwakonkem/AutoFlow-Dashboard)**

## Roadmap

- [ ] Replace templated AI responses with a real LLM API call
- [ ] Persist workflows and execution history to a database
- [ ] Add a scheduler for trigger-based (non-manual) workflow runs

## Author

**Phiwakonke Mthethwa**
Full-Stack Developer, Centurion, South Africa
GitHub: [@phiwakonkem](https://github.com/phiwakonkem) · LinkedIn: [phiwakonke-mthethwa](https://www.linkedin.com/in/phiwakonke-mthethwa-97aa74331) · Email: phiwakonkem@gmail.com
