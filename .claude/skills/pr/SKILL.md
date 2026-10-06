---
name: pr
description: Prepare a pull request description for the current branch, linked to SRS IDs and with test evidence.
---
1. Read `git log main..HEAD --oneline` and `git diff main...HEAD --stat`.
2. Write the PR body:
   - **What**: one paragraph.
   - **Why**: the SRS IDs / issue it closes (`Closes #<n>`).
   - **How**: key design points, new contracts, migrations.
   - **Tests**: what was added, and the result of `/local-check`.
   - **Screenshots**: required for UI changes (mobile + desktop).
   - **Risk & rollback**: what could break and how to revert.
3. Suggest a Conventional Commit title.
4. Show the body to the engineer; only open the PR through the GitHub MCP after they say yes.
