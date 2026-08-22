# Easy Generator Auth System

Sign-up and sign-in for a private welcome page. NestJS + React, HttpOnly cookie sessions, shared Zod contracts, MongoDB.

## Where to go next

- **What this product does:** [docs/business.md](docs/business.md)
- **How to run and extend it:** [docs/implementation.md](docs/implementation.md)
- **How AI was used (required by the task):** [AI.md](AI.md)

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm compose:up
pnpm --filter @easygen/shared build
pnpm dev
```

Then open http://localhost:5173. API docs: http://localhost:3000/api/docs.

One-command stack (nginx + API + Mongo): `pnpm compose:stack` then http://localhost:8080.

Prerequisites, stopping services, and environment variables: [docs/implementation.md](docs/implementation.md).
