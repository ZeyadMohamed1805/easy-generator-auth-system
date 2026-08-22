# Implementation

Technical documentation for what exists in this repository today.

## Current state

pnpm workspace with:

- `packages/shared` — Zod field rules
- `apps/api` — NestJS auth API
- `apps/web` — React (Vite) UI
- MongoDB 7 via Docker (root credentials)

Architecture: a **modular monolith**. One Nest process, extractable `AuthModule` and `UsersModule`. Not microservices — this product is sign-up/sign-in; extra network hops would add cost without a scaling need.

Sessions are **HttpOnly cookies** (`access_token`, `refresh_token`), not `localStorage`. The browser talks only to the web origin. Vite (dev) and nginx (Docker, later) proxy `/api` to Nest so cookies stay first-party (`SameSite=Lax`).

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker and Docker Compose

### Run

```bash
cp .env.example .env
pnpm install
pnpm compose:up
pnpm --filter @easygen/shared build
pnpm dev
```

- App: http://localhost:5173
- API health: http://localhost:3000/api/health
- Swagger: http://localhost:3000/api/docs

`pnpm dev` starts the API and Vite together. Vite proxies `/api` to port 3000. Stop MongoDB with `pnpm compose:down`.

Tests: `pnpm test` (shared + API e2e + web schema tests). API e2e uses mongodb-memory-server.

### Environment variables

Copy `.env.example` to `.env` at the repository root. Do not commit `.env`.

| Variable | Default | Purpose |
|---|---|---|
| `MONGO_PORT` | `27017` | Host port mapped to MongoDB |
| `MONGO_INITDB_ROOT_USERNAME` | `easygen` | Mongo root user |
| `MONGO_INITDB_ROOT_PASSWORD` | `changeme` | Mongo root password (change before any shared deploy) |
| `MONGO_INITDB_DATABASE` | `easy_generator_auth` | Initial database name |
| `NODE_ENV` | `development` | `development` / `test` / `production` |
| `PORT` | `3000` | API listen port |
| `MONGODB_URI` | (see example) | App connection string (`authSource=admin` with Compose root user) |
| `JWT_ACCESS_SECRET` | (placeholder) | HMAC secret, at least 32 characters |
| `JWT_ACCESS_TTL_SECONDS` | `900` | Access cookie lifetime (15 minutes) |
| `REFRESH_TOKEN_TTL_DAYS` | `7` | Refresh cookie lifetime |
| `COOKIE_SECURE` | `false` | Set `true` behind HTTPS |
| `AUTH_THROTTLE_TTL_MS` | `60000` | Auth route throttle window |
| `AUTH_THROTTLE_LIMIT` | `10` | Max auth requests per window |

## Layout

```
apps/api/                 # NestJS modular monolith
apps/web/                 # React + Vite, same-origin /api proxy
packages/shared/          # Zod: email, name, password policy, API error shape
docs/
.cursor/rules/
docker-compose.yml        # MongoDB 7 only
```

### Shared contracts

`@easygen/shared` is the source of truth for field rules. Sign-up uses the full password policy; sign-in only requires a non-empty password so failed logins stay generic. Emails are trimmed and lowercased. Objects are `.strict()`.

### API modules

- `HealthModule` — `GET /api/health` (Mongo ping)
- `UsersModule` — user persistence; `GET /api/users/me` (JWT cookie guard)
- `AuthModule` — signup, signin, refresh, logout
- `common/` — Zod pipe, exception filter (`statusCode`, `message`, `error`, `requestId`)
- Logging: `nestjs-pino` with request ids; cookies, Authorization, and `password` redacted

### Auth behaviour

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/signup` | `201`, sets cookies, unique email → `409` |
| POST | `/api/auth/signin` | Generic `401 Invalid credentials` |
| POST | `/api/auth/refresh` | Rotates refresh token; reuse of a revoked token revokes the family |
| POST | `/api/auth/logout` | `204`, clears cookies, revokes refresh token |
| GET | `/api/users/me` | Protected; never returns `passwordHash` |
| GET | `/api/health` | `{ status: "ok" }` |

Passwords are hashed with argon2id. Refresh tokens are stored as SHA-256 hashes with a TTL index. Access JWT lives only in the `access_token` cookie (`HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` when `COOKIE_SECURE=true`). Auth routes are throttled.

### Web app

Routes: `/sign-up`, `/sign-in`, `/app` (protected). After signup or signin the UI calls `GET /api/users/me` (with a one-shot refresh on 401) and shows **Welcome to the application.** plus the user’s name and Log out.

Forms use React Hook Form + the shared Zod schemas. Tokens are never written to `localStorage`. Fetch uses `credentials: 'include'`.

## Documentation

- Product intent: [docs/business.md](business.md)
- How AI was used: [AI.md](../AI.md)
- README is the front door and quick start only

When code lands, this file is updated in the same change. It must not describe unbuilt features.
