# Easy Generator Auth System

Sign-up and sign-in for a private welcome page. This repository is a pnpm monorepo with shared validation contracts. Right now it ships MongoDB via Docker and `@easygen/shared`. The API and frontend are next.

## Where to go next

- **What this product does:** [docs/business.md](docs/business.md)
- **How to run and extend it:** [docs/implementation.md](docs/implementation.md)
- **How AI was used (required by the task):** [AI.md](AI.md)

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm test
pnpm compose:up
```

Prerequisites, stopping services, and environment variables: [docs/implementation.md](docs/implementation.md).
