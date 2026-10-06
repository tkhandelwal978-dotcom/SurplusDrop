---
name: new-endpoint
description: Scaffold a REST endpoint in apps/server following the module layering rules, with Zod schemas and tests.
---
Endpoint to create: $ARGUMENTS   (e.g. "POST /api/v1/orders reserve a lot")

1. Define request/response schemas and any new error codes in packages/shared first.
2. Create or extend, inside apps/server/src/modules/<module>/:
   - `<m>.routes.ts`: path, auth middleware, rate limit, idempotency middleware for money POSTs.
   - `<m>.controller.ts`: parse with the shared schema, call the service, map result to HTTP.
   - `<m>.service.ts`: business rules, transaction, outbox writes. Clock injected.
   - `<m>.repository.ts`: SQL only.
3. Write tests:
   - unit tests for any new domain function,
   - integration test with Supertest + Testcontainers for: success, validation error,
     unauthenticated, forbidden (wrong owner), and each relevant EC-* case.
4. Add the endpoint to the OpenAPI registry.
5. Run `/local-check` and report the result.
