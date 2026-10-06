---
name: new-feature
description: Plan a new feature from SRS requirement IDs before any code is written. Use when starting work on an FR-* requirement or a GitHub issue.
---
Feature to plan: $ARGUMENTS

1. Find every SRS ID involved (FR-*, BR-*, EC-*, NFR-*). Quote each one in one line.
2. Read the relevant code in apps/server, apps/web and packages/shared before proposing anything.
3. Produce a plan with these sections:
   - **Scope**: what is in and explicitly out.
   - **Data**: tables/columns/indexes/constraints to add (migration needed? yes/no).
   - **Contracts**: new Zod schemas, error codes, socket events in packages/shared.
   - **Server**: files per layer (routes, controller, service, repository, domain, jobs).
   - **Web**: pages, components, hooks, states (loading/empty/error/offline).
   - **Edge cases**: each EC-* with the test that will cover it.
   - **Observability**: logs, metrics, alerts.
   - **Risks and questions**: anything touching money, stock or security goes here.
4. Split the work into steps of at most ~200 changed lines each, in build order.
5. STOP. Do not write code until the engineer approves the plan.
