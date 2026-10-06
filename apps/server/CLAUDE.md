# apps/server — Express + TypeScript backend

- Entry points: `src/entry/api.ts`, `src/entry/realtime.ts`, `src/entry/worker.ts`. They share
  `src/modules`, `src/platform` and `src/jobs`; each boots only what its role needs.
- Middleware order (api): requestId → logger → helmet → cors → cookies → rawBody (webhook route only)
  → json → auth (optional) → rateLimit → routes → notFound → errorHandler.
- Module layout: routes → controller → service → repository, plus `domain/` (pure, clock injected).
- Transactions: `db.transaction(async (tx) => ...)`. External HTTP calls never inside a transaction.
- Guarded UPDATEs and PostGIS queries are written as raw SQL with Drizzle's `sql` template.
- Jobs: BullMQ processors in `src/jobs/<queue>/`; always idempotent; jobId includes entity version.
- Realtime: `src/realtime/` owns rooms, time sync and the event→room router. It only consumes
  events relayed from the outbox.
- Tests: unit tests next to code (`*.spec.ts`); integration tests in `test/integration` use
  Testcontainers (real Postgres + PostGIS, real Redis). Recorded Razorpay webhook payloads live in
  `test/fixtures/razorpay/`.
