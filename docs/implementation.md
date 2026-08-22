# Implementation

Technical documentation for what exists in this repository today.

## Current state

This is a pnpm workspace. MongoDB runs via Docker with authentication enabled. Shared Zod contracts live in `packages/shared`. The API and web apps are not scaffolded yet (`apps/api` and `apps/web` are placeholders).

Architecture choice: a **modular monolith**. One API process later, with extractable `auth` and `users` modules. Not microservices — the product is a sign-up/sign-in flow, and extra network boundaries would add cost without a scaling need.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker and Docker Compose

### Run MongoDB

```bash
cp .env.example .env
pnpm compose:up
```

Stop it with `pnpm compose:down`.

Shared contracts (`pnpm test`, `pnpm build`) do not need MongoDB.

### Environment variables

Copy `.env.example` to `.env` at the repository root. Compose reads these:

| Variable | Default | Purpose |
|---|---|---|
| `MONGO_PORT` | `27017` | Host port mapped to MongoDB |
| `MONGO_INITDB_ROOT_USERNAME` | `easygen` | Mongo root user |
| `MONGO_INITDB_ROOT_PASSWORD` | `changeme` | Mongo root password (change before any shared deploy) |
| `MONGO_INITDB_DATABASE` | `easy_generator_auth` | Initial database name |

Do not commit `.env`.

## Layout

```
apps/api/                 # placeholder — NestJS later
apps/web/                 # placeholder — React later
packages/shared/          # Zod: email, name, password policy, API error shape
docs/                     # business.md (product), implementation.md (this file)
.cursor/rules/            # docs, security, git
docker-compose.yml        # MongoDB 7 only
```

### Shared contracts

`@easygen/shared` is the source of truth for field rules. Sign-up uses the full password policy; sign-in only requires a non-empty password so failed logins stay generic. Emails are trimmed and lowercased. Build with `pnpm --filter @easygen/shared build`. Tests: `pnpm test`.

## Documentation

- Product intent: [docs/business.md](business.md)
- How AI was used: [AI.md](../AI.md)
- README is the front door and quick start only

When code lands, this file is updated in the same change. It must not describe unbuilt features.
