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

## Later phases

Entries will be appended when the API, the web app, and CI land.
