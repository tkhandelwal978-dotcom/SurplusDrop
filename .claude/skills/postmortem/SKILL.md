---
name: postmortem
description: Turn a bug or incident that was just fixed into a blameless postmortem in docs/postmortems.
---
Incident: $ARGUMENTS

Create `docs/postmortems/<YYYY-MM-DD>-<kebab-title>.md` with:
- Summary (2–3 sentences), Impact (who/what/how long), Detection (how we found it),
- Timeline (timestamps), Root cause (5 whys), Fix, What went well, What went badly,
- Action items (owner, due date) — including the test that now prevents a repeat.
Blameless tone. Use real numbers from logs and metrics where available.
