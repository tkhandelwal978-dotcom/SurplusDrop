# apps/web — React + Vite frontend

- Router: React Router. Route groups: `src/pages/buyer`, `src/pages/seller`, `src/pages/admin`.
- Feature code lives in `src/features/<feature>/` (components, hooks, api, tests). Shared UI in
  `src/components/ui` (shadcn). Cross-cutting helpers in `src/lib` (api client, socket, time-sync,
  query keys, errors).
- Data: TanStack Query only. Query keys from `src/lib/query-keys.ts`. Socket events update caches
  via `setQueryData` and must ignore events whose `version` <= cached version.
- Prices and countdowns: always `priceAt(lot, Date.now() + serverOffset)` from `@surplusdrop/shared`.
- Forms: React Hook Form + zodResolver with schemas from `@surplusdrop/shared`.
- Visuals: follow `/DESIGN.md`; Tailwind classes backed by `@surplusdrop/ui-tokens`.
- Link previews: public lot pages get meta tags from the server share route
  (`apps/server/src/share`), not from the SPA.
- Tests: Vitest + Testing Library for components; Playwright specs in `e2e/`.
- Before finishing: every new screen has loading, empty, error and offline states and works at
  360 / 768 / 1280 px in light and dark mode.
