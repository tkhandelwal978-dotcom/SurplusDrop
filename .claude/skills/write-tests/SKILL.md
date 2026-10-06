---
name: write-tests
description: Write missing unit, property and integration tests for changed code, including EC-* edge cases.
---
Target: $ARGUMENTS (a file, module, or "current changes")

1. Identify what changed (`git diff main...HEAD --stat` if target is "current changes").
2. For each changed unit, list the behaviours that must be tested; mark which already have tests.
3. Write the missing tests:
   - pure functions → Vitest unit tests; add fast-check properties for math/time logic,
   - services/endpoints → integration tests with Testcontainers,
   - concurrency cases → fire N parallel requests with Promise.all and assert invariants.
4. Every EC-* test name must contain the ID, e.g. `it("EC-01 only one buyer gets the last unit")`.
5. Tests must be deterministic: inject the clock, seed randomness, no sleeps.
6. Run the tests and report pass/fail and coverage for the touched files.
