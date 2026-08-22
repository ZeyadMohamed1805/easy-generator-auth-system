# AI usage

This file is required by the take-home. It records judgement on top of AI assistance: what was generated, what was kept, what was changed, and why.

## Approach

AI was used to move quickly on scaffolding, boilerplate, and first drafts of docs and config. Human review owns architecture, security choices, and whether generated code matches the assignment.

## Foundation (this phase)

**What AI helped with**

- First drafts of workspace files, Docker Compose Mongo healthcheck, Cursor rules, and the three documentation files.
- Turning the assignment PDF into a concrete modular-monolith layout.

**What was kept**

- pnpm workspaces with reserved `apps/` and `packages/`.
- MongoDB 7 in Compose with root credentials (not an unauthenticated database).
- Docs split: `docs/business.md` (product, no stack), `docs/implementation.md` (as-built only), `AI.md` at the repo root (assignment requirement).
- Always-on Cursor rules so docs, security, and git habits do not drift.

**What was rejected or reworked**

- Microservices / multiple Nest processes. The task is a sign-up/sign-in module. Extra services would look like over-engineering, not seniority.
- Putting JWT in `localStorage`. The plan is HttpOnly cookies behind a same-origin `/api` proxy so `SameSite=Lax` works.
- Documenting Nest, React, or JWT in `implementation.md` before those apps exist. As-built docs only.

**Prompts that worked**

- Asking for as-built documentation rather than a future-state architecture dump.
- Constraining bonus work to logging, errors, tests, CI, and API docs — not Kubernetes or OAuth.

## Shared contracts

**What AI helped with**

- First draft of Zod schemas and table-driven password tests.

**What was kept**

- One package (`@easygen/shared`) for email, name, password, sign-up/sign-in payloads, and the API error shape.
- Sign-in password validation is “required only”, not the full policy, so the API cannot leak “your password is missing a number” on a bad login.

**What was rejected**

- Duplicating regexes in the API and the web app. Two copies would drift.
- Applying the full password policy on sign-in.

## API

**What AI helped with**

- Nest module/controller/service scaffolding, Swagger annotations, and a first e2e suite.
- Exception filter and pino redaction lists.

**What was kept**

- HttpOnly access + refresh cookies; refresh tokens hashed in Mongo; rotation and family revoke on reuse.
- argon2id hashing and a dummy verify on unknown emails so sign-in timing does not leak existence.
- Shared Zod pipe as the only body validator (no parallel class-validator DTOs).
- `GET /api/users/me` as the protected endpoint the welcome page will call.

**What was rejected or reworked**

- Passport local strategy. A cookie JWT guard is smaller and matches the session model.
- Loading `AppModule` at the top of e2e files. Config validation runs at import time, so tests set env then `require()` the module.
- Putting JWT in `localStorage` or returning tokens in JSON for the SPA to store.

**Prompts that worked**

- “Fail closed on refresh-token reuse” produced a family revoke that was worth keeping.

## Web app

**What AI helped with**

- Vite + React Router scaffolding, form wiring, and a first Testing Library suite.

**What was kept**

- Same-origin `/api` proxy so cookies are first-party.
- Shared Zod schemas in React Hook Form — one policy on both sides.
- Silent refresh on `GET /users/me` 401, not on `/api/auth/*` (so bad passwords stay 401).
- The assignment’s welcome copy, plus name and logout.

**What was rejected or reworked**

- Storing JWT in `localStorage`.
- React Testing Library in this monorepo. Vite/Vitest loaded two React module instances (`useState` dispatcher was null). Rather than fake a passing component suite, web tests assert the same Zod contracts the forms import, and API e2e covers the session flow.
- React 19 from `create vite` latest, then Vite 8. Pinned Vite 7 + React 18 so the toolchain matches Vitest 3.

## Later phases

Entries will be appended when Dockerfiles, Compose for the full stack, and CI land.
