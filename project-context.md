# SurplusDrop — Project Context (read me first)

> Purpose: give any new AI model or new chat session the full context of this project without
> re-reading old conversations. Keep it factual and short. Update it with `/update-context` at the
> end of any session that changes decisions or status. Never store secrets or personal data here.

Last updated: 2026-09-23

## 1. Who I am working with
- A software developer recently placed at a company, currently in full-stack training.
- Goal: switch jobs after ~1 year with one "god-level" portfolio project that looks like it was
  built by an engineer with 2+ years of experience (system design, scale, real traffic, debugging,
  strict edge cases, deployable, polished responsive UI).
- Time budget: 4–6 months (plan is 20 weeks).
- Strong in web development. **Zero knowledge of Next.js and NestJS** — do not use them.
- Wants to **learn how professional teams work** (issues, branches, PRs, reviews, testing, CI/CD,
  ADRs, postmortems) and how to use Claude Code properly (MCP, skills, agents, hooks).
- Prefers simple, plain-language explanations first, details after.

## 2. The project in plain words
SurplusDrop lets shops (bakeries, restaurants, cafés, grocers) sell food that will expire soon
through a **live price-dropping sale (Dutch auction)**. The price falls every few minutes until the
stock sells out or reaches a floor price. Nearby buyers watch prices fall live on a map, buy at the
current price, pay online within a 5-minute hold, and **pick the item up in person** with a 6-digit
code or QR. Shops recover money, buyers get cheap real food, less food is wasted.

## 3. Decisions made (do not reopen without the user)
| Date | Decision | Reason |
|---|---|---|
| 2026-09-23 | Project chosen: SurplusDrop (from a shortlist incl. PoolPay, AgentGate, ToolMeter, WalkIn) | Best mix of real-time, concurrency, payments, geo and visual UI |
| 2026-09-23 | **Web app as a PWA**, no native mobile app | User knows web, not mobile; recruiters open links; PWA gives push, geolocation, install |
| 2026-09-23 | **Pickup only** for now | Keep scope tight; delivery is a later add-on |
| 2026-09-23 | Design must stay **delivery-ready**: every order has `fulfilment_type` (= PICKUP), pickup logic isolated, total = item amount + extra charges (0 for now) | Delivery can be added without rewriting orders/payments |
| 2026-09-23 | Frontend **React + Vite + React Router** (not Next.js) | User has no Next.js knowledge |
| 2026-09-23 | Backend **Express + TypeScript** (not NestJS), with strict module folders and 3 entry points (api, realtime, worker) | User has no NestJS knowledge; structure enforced by our own rules |
| 2026-09-23 | Link previews for shared lot pages via a small server "share" route | Replaces Next.js server rendering |
| 2026-09-23 | Rest of stack unchanged: PostgreSQL + PostGIS, Drizzle, Redis, BullMQ, Socket.io, Razorpay, Tailwind, shadcn/ui, TanStack Query, Zustand, Zod, MapLibre, Vitest, Playwright, k6, OpenTelemetry, Sentry, Docker, GitHub Actions | See SRS tech-stack section |
| 2026-09-23 | **Monorepo** (pnpm workspaces + Turborepo) with `.claude/` at the root | Shared contracts between web and server; one place for AI tooling |
| 2026-09-23 | AI chatbot is a **later add-on**; start with documents lookup (RAG) + tools, fine-tune only later with real chat data | Rules change often; fine-tuning needs real data |
| 2026-09-23 | AI Price Advisor: heuristic decides numbers, LLM only explains | Determinism and safety for money |
| 2026-10-06 | Develop on **native Windows** (Command Prompt / Git Bash, project at D:\SurplusDrop), not WSL | User preference; Docker Desktop uses WSL 2 in the background |

## 4. Future add-ons (not in current scope)
1. AI assistant for buyers and sellers (help, find deals, create lots by chat, stats) — actions
   always need user confirmation.
2. Delivery: delivery charges, partner app, nearest-partner matching, live tracking, delivery OTP,
   batching, surge pricing, failed-delivery policy. Rollout: third-party delivery API first, own
   partner network later.
3. Fine-tuned smaller model for the assistant once real conversations exist.

## 5. Documents and files produced so far
| File | What it is |
|---|---|
| `docs/SurplusDrop_Requirements_Specification.pdf` (v1.1) | Full SRS: context, business rules (BR-*), features (FR-*), NFRs, 34 edge cases (EC-*), tech stack, HLD, LLD (schema, state machines, algorithms, API, sockets, Redis, jobs), UI/UX, testing, DevOps, 20-week plan, master prompt, future roadmap |
| `docs/SurplusDrop_AI_Engineering_Workflow.pdf` | How to work on the project with Claude Code: CLAUDE.md, MCP servers, hooks, 13 skills, 6 agents, Stitch UI workflow, feature workflow, learning plan |
| `CLAUDE.md` (+ nested ones in apps/* and packages/*) | Instructions Claude reads every session |
| `.claude/` | settings.json (permissions + hooks), hooks/*.mjs, skills/*, agents/* |
| `.mcp.json` | MCP servers: context7, playwright, github, postgres-local (read-only), stitch |
| `DESIGN.md` | Design tokens (template until extracted from Stitch) |

## 6. Current status
- Phase: **planning complete, build not started**.
- Next step: Week 1–2 "Foundations" — create the monorepo, install Claude Code, add this kit,
  docker-compose (Postgres+PostGIS, Redis, MinIO, Mailpit), CI skeleton, auth (signup, email OTP,
  login, refresh rotation).

## 7. Open questions
- Is the user comfortable with **TypeScript** and **PostgreSQL**, or mainly JavaScript + MongoDB?
  (Asked, not yet answered. Plan assumes TypeScript + PostgreSQL; if not, add learning time in
  weeks 1–2 rather than changing the database — PostgreSQL is essential for the no-oversell design.)

## 8. Session log
- **2026-09-23 — Session 1 (planning).** User asked for portfolio project ideas → 5 ideas given,
  SurplusDrop recommended. Confirmed web (PWA) over app. Produced SRS v1.0 PDF. Explained the
  project in plain words; listed buyer and seller features. Discussed future delivery and AI
  chatbot (both later add-ons). Explained the full tech stack. User rejected Next.js/NestJS →
  switched to React + Vite and Express. Explained Claude Code building blocks (CLAUDE.md, skills,
  agents, hooks, MCP, plugins) and a Stitch UI workflow. Produced: SRS v1.1 (updated stack,
  monorepo, delivery-ready note, roadmap), AI Engineering Workflow PDF, the `.claude` kit and this
  file. Next: start Week 1.

## 9. Conventions for whoever continues
- Answer in simple English first, then details. The user likes clear lists of features/steps.
- Always tie code to SRS IDs. Never change stack or scope decisions above without asking.
- Ask at most one clarifying question at a time.
