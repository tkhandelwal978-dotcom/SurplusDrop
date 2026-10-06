---
name: edge-case-audit
description: Check a module against the SRS edge-case catalogue (EC-01..EC-34) and report which cases are covered by tests.
---
Module or feature: $ARGUMENTS

1. List every EC-* ID from the SRS that applies to this module.
2. Search the test suites for each ID (`grep -r "EC-XX" apps packages`).
3. For each ID report: covered / partially covered / missing, with the test file.
4. For missing ones, describe the test that should exist (setup, action, assertion).
5. End with a coverage score: covered / applicable.
