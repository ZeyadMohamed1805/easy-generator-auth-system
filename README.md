# Easy Generator Auth System

Sign-up and sign-in for a private welcome page. NestJS API with HttpOnly cookie sessions, shared Zod contracts, and MongoDB. The React app is next.

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
pnpm dev:api
```

Then open http://localhost:3000/api/docs.

Prerequisites, stopping services, and environment variables: [docs/implementation.md](docs/implementation.md).
