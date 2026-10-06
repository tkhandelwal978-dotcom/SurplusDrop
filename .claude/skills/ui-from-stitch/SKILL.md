---
name: ui-from-stitch
description: Build a React screen in apps/web from a Google Stitch design using the Stitch MCP and DESIGN.md.
---
Screen: $ARGUMENTS   (Stitch screen name + target route, e.g. "Lot detail → /lots/:id")

1. Use the Stitch MCP: get the screen image and code for the named screen.
2. If DESIGN.md is still the template, first extract colours, typography, spacing, radii and
   shadows from the design into DESIGN.md and packages/ui-tokens, and stop for review.
3. Build the screen as React components in apps/web/src/features/<feature>/ using shadcn/ui and
   Tailwind classes backed by tokens. Never copy raw hex values or pixel sizes from the Stitch HTML.
4. Replace static content with real data hooks (TanStack Query) and live updates where relevant.
5. Add loading, empty, error and offline states even if the design does not show them.
6. Check 360 / 768 / 1280 px and dark mode, then ask the ui-reviewer agent to review.
