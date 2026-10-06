---
name: feature-test
description: Test a feature end to end in a real browser with the Playwright MCP and report bugs with screenshots.
---
Feature to test: $ARGUMENTS   (e.g. "buyer reserves and pays for a lot")

Pre-check: the local stack must be running (`pnpm dev`) with seeded data (`pnpm db:seed`).

1. Write a short test script: the steps a real user takes, and the expected result of each step.
2. Using the Playwright MCP, run the script at 390x844 (mobile) and 1280x800 (desktop).
3. For each step record: pass/fail, a screenshot on failure, and console errors.
4. Also try the unhappy paths: double click on primary buttons, refresh mid-flow, go offline,
   wrong input, expired hold.
5. Report bugs as a table: severity | step | expected | actual | screenshot | likely cause.
6. Do not modify code. Suggest which Playwright spec in apps/web/e2e should be added to lock
   this flow in.
