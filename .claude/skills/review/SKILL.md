---
name: review
description: Review the current branch with the specialist reviewer agents and produce one combined report.
---
1. Get the diff: `git diff main...HEAD`.
2. Always run the **code-reviewer** and **security-reviewer** agents on the diff.
3. Run the **money-reviewer** agent if the diff touches orders, payments, refunds, ledger, lots
   stock, idempotency or webhooks.
4. Run the **ui-reviewer** agent if the diff touches apps/web.
5. Merge the findings into one table sorted by severity:
   severity (blocker/major/minor) | file:line | finding | suggested fix | reviewer.
6. Do not fix anything. Ask the engineer which findings to address.
