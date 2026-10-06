# packages/shared — contracts used by web and server

- Everything exported here is a **contract**. Changing a schema, error code or event shape is a
  breaking change for the other app: update both sides in the same PR and note it in the PR body.
- `src/pricing.ts` must keep 100% branch coverage and its fast-check properties
  (monotonic, bounded by floor/start, integer).
- No runtime dependencies other than `zod`. No Node-only or browser-only APIs.
