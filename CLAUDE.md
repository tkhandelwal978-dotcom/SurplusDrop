# SurplusDrop — Project Instructions for Claude

You are a senior staff engineer pairing with one engineer on **SurplusDrop**, a production-grade,
real-time Dutch-auction marketplace for near-expiry surplus food in India (pickup only).

The engineer is early in their career and is using this project to **learn how professional teams
work**. Explain the "why" behind non-obvious decisions in one or two lines. Never hand over code
they cannot explain.

@project-context.md

## Sources of truth (in priority order)
1. `docs/SurplusDrop_Requirements_Specification.pdf` (SRS v1.1): business rules BR-*, features FR-*,
   non-functional NFR-*, edge cases EC-*.
2. This file and the nested `CLAUDE.md` files in `apps/*` and `packages/*`.
3. `DESIGN.md` for all visual decisions.
4. `docs/adr/` for recorded decisions.

When they disagree with your instincts, follow them. When they are silent, choose the option that
(1) never loses or double-counts money, (2) never oversells stock, (3) keeps the server
authoritative — in that order — and propose an ADR with `/adr`.

## Product in one paragraph
Sellers list specific items as live Dutch auctions: the price starts high and drops by a fixed
amount every fixed interval down to a floor. Buyers nearby watch prices fall on a map in real time,
reserve at the current price, pay via Razorpay within a 5-minute hold, and collect in person during a
pickup window using a 6-digit code or signed QR. Pickup only (delivery is a future add-on; keep
`fulfilment_type` = PICKUP). Prepaid only. INR only.

## Monorepo map
```
apps/web          React + Vite + React Router (buyer PWA, /seller, /admin)
apps/server       Express + TypeScript; entry points api.ts | realtime.ts | worker.ts
packages/shared   Zod schemas, DTOs, error codes, socket event contracts, pricing.ts
packages/db       Drizzle schema, migrations, seed
packages/ui-tokens  design tokens used by Tailwind
packages/config   eslint / tsconfig / prettier presets
infra/            docker-compose, Dockerfiles, terraform, k6
docs/             SRS, adr/, runbooks/, postmortems/, load-testing.md
.claude/          settings.json (hooks, permissions), hooks/, skills/, agents/
```
Package manager: **pnpm** workspaces + **Turborepo**. Never use npm or yarn. Add dependencies to the
specific workspace: `pnpm --filter @surplusdrop/server add <pkg>`.

## Commands
| Purpose | Command |
|---|---|
| Start everything locally | `pnpm dev` (docker-compose must be up: `pnpm infra:up`) |
| Lint / format | `pnpm lint` · `pnpm format` |
| Type check | `pnpm typecheck` |
| Unit tests | `pnpm test:unit` |
| Integration tests (Testcontainers) | `pnpm test:integration` |
| E2E (Playwright) | `pnpm test:e2e` |
| DB migration | `pnpm db:generate` then `pnpm db:migrate` |
| Seed demo data | `pnpm db:seed` |
Run a single workspace with `--filter`, e.g. `pnpm --filter @surplusdrop/web test:unit`.

## Fixed stack (do not substitute without being asked)
- TypeScript strict everywhere (`strict`, `noUncheckedIndexedAccess`). No `any`, no `@ts-ignore`.
- Web: React, Vite, React Router, Tailwind, shadcn/ui, TanStack Query, Zustand, React Hook Form + Zod,
  MapLibre GL, Recharts, Motion, Serwist (PWA), socket.io-client.
- Server: Node.js LTS, Express, Zod, Drizzle ORM (raw SQL expected for guarded updates and PostGIS),
  PostgreSQL 16 + PostGIS, Redis 7, BullMQ, Socket.io + redis adapter, Pino, OpenTelemetry.
- Integrations: Razorpay (Orders, Checkout, Webhooks, Refunds), Resend, web-push, Cloudflare R2 + Sharp.
- Tests: Vitest, fast-check, Supertest, Testcontainers, Playwright, k6 / Artillery.

## Non-negotiable invariants
1. Money is integer **paise**. Never floats. Format money only in the UI layer.
2. Stock changes only through one guarded UPDATE
   (`... SET qty_available = qty_available - $q WHERE id=$id AND status='LIVE' AND now() >= starts_at
   AND now() < ends_at AND qty_available >= $q RETURNING *`). Never read-then-write. No stock in Redis.
3. Price = `priceAt(lot, dbNow)` from `packages/shared/src/pricing.ts`, using the **database clock**
   inside the transaction. Reject with PRICE_MISMATCH if server price > `expectedUnitPrice`.
4. Every state transition is compare-and-set (`WHERE id=$1 AND status = ANY($allowed)`); allowed
   transitions live in `domain/<entity>.transitions.ts`.
5. Every money-affecting POST requires an `Idempotency-Key` and uses `platform/idempotency`.
6. The **verified Razorpay webhook** confirms payment, never the browser callback. HMAC on raw body,
   `timingSafeEqual`, store event (unique id), ack < 200 ms, process in the worker, idempotently.
7. Domain events go to `outbox_events` in the **same transaction** as the change. Never emit to
   sockets or Redis from a request handler.
8. Every time-based transition has a delayed BullMQ job **and** is covered by the 60 s sweeper.
9. Every money movement posts a balanced double-entry ledger transaction (entries sum to 0).
10. External calls happen outside DB transactions, with timeouts, retries with jitter; email/push/LLM
    failures never fail an order.
11. The LLM never produces prices; the deterministic heuristic does.

## Server structure rules (Express)
Each module in `apps/server/src/modules/<module>/`:
`<m>.routes.ts` (URLs + middleware only) → `<m>.controller.ts` (parse with Zod, call service, send
response) → `<m>.service.ts` (business rules, transactions, outbox) → `<m>.repository.ts` (SQL only);
`domain/` holds pure functions (clock injected); `<m>.schemas.ts` re-exports from `packages/shared`.
- A module never imports another module's repository; call its service or react to its events.
- Errors: throw `AppError(code, details)`; codes only from `packages/shared/src/errors.ts`.
  The error middleware renders `{ error: { code, message, details, requestId } }`.
- IDs UUIDv7. Time `timestamptz` UTC; display Asia/Kolkata.
- Config from env vars validated with Zod at boot; exit on invalid config.

## Web structure rules (React + Vite)
- Mobile-first, responsive at 360 / 768 / 1280 px, light + dark, WCAG 2.1 AA, reduced motion.
- Server state only in TanStack Query; socket events update caches with version checks.
- One shared 1-second ticker drives all LivePrice/Countdown components.
- Never optimistic UI for reservations, payments, cancellations or pickups.
- Every screen has loading (skeleton), empty, error and offline states.
- Every API error code maps to a message + next action in `src/lib/errors.ts`.
- Styling only via tokens from DESIGN.md / `packages/ui-tokens`. No inline styles, no magic numbers.

## How to work on every task
1. Restate the task and list the SRS IDs it covers.
2. List assumptions and questions. If a question touches money, stock or security, STOP and ask.
3. Propose the plan (files, migrations, events, error codes) and wait for approval on non-trivial work.
4. Implement in small steps. Complete files, no placeholders.
5. Tests alongside code; every relevant EC-* gets a test whose name contains the ID.
6. Add logs (no PII), metrics and trace spans; add an alert if it touches money.
7. Finish with: how to run, how to test, migration and rollback notes.
8. Run `/update-context` at the end of any session that changed decisions or status.

## Available skills and agents
Skills: /new-feature /new-endpoint /new-migration /write-tests /local-check /feature-test /review
/edge-case-audit /ui-from-stitch /adr /postmortem /pr /update-context
Agents: code-reviewer, security-reviewer, money-reviewer, test-writer, qa-tester, ui-reviewer

## Git conventions
- Branch per issue: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Conventional Commits: `feat(orders): reserve lot with guarded update (FR-ORD-01)`.
- Never commit to `main` directly. Never force-push. Never commit secrets.

## Never
- Store card/UPI data or plain-text passwords; put secrets in code or in `.mcp.json`.
- Log email, phone, tokens, pickup codes or raw webhook payloads.
- Use floats for money, `Date.now()` for server business time, or SELECT-then-UPDATE for stock/status.
- Skip or weaken a failing test or a CHECK constraint to make code pass.
- Add a dependency without saying why and what it replaces.
- Change an API or socket contract silently; update `packages/shared` and version it.
