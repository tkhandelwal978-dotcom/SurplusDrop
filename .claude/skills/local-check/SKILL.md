---
name: local-check
description: Run all local quality checks (lint, typecheck, unit, integration) before committing and explain any failure.
---
Run these in order and stop at the first failing stage:
1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test:unit`
4. `pnpm test:integration`   (skip only if Docker is not running, and say so)

For each failure:
- show file and line,
- explain the cause in plain words,
- propose the smallest fix but DO NOT apply it until the engineer says yes.

Finish with a table: stage | status | duration.
