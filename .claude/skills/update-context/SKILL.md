---
name: update-context
description: Update project-context.md at the end of a session so a new model or new session understands the project state.
---
Update `/project-context.md`:
1. **Current status**: what phase/week we are in and what is working now.
2. **Decisions log**: append any decision made this session (date, decision, reason, ADR link).
3. **Open questions**: add new ones; remove answered ones (move the answer to decisions).
4. **Session log**: add one entry — date, what the engineer asked, what was done, files changed,
   next step. Keep each entry to 3–6 lines.
5. Keep the file under ~400 lines: summarise the oldest session entries into one "Earlier
   sessions" paragraph when it grows.
Never put secrets, keys or personal data in this file. Show the diff before saving.
