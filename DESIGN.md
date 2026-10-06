# SurplusDrop — Design System

> Template seeded from the SRS (section "UI / UX Specification"). Replace values with the ones
> extracted from Stitch using `/ui-from-stitch` the first time, then treat this file as the source
> of truth for every visual decision.

## Brand
Calm, trustworthy, a little urgent. Time and price are the heroes of every lot surface.

## Colour tokens
| Token | Light | Dark | Use |
|---|---|---|---|
| brand-700 | #0F5E56 | #5EC2B5 | primary actions, headers |
| brand-50 | #E6F2F0 | #13302C | selected / subtle backgrounds |
| accent-500 | #E8850C | #F5A445 | price drops, urgency, countdown |
| success | #15803D | #4ADE80 | confirmed, picked up |
| danger | #B42318 | #F87171 | errors, expiring hold |
| ink | #1C2426 | #E7EEEE | body text |
| muted | #5B6B6E | #9FB0B2 | secondary text |
| surface | #FFFFFF | #151D1D | cards, sheets |
| canvas | #F6F8F8 | #0E1414 | page background |

## Typography
Inter (variable). Tabular numerals for prices and timers.
Scale: 12 / 14 / 16 (body) / 20 / 24 / 32 / 40 px. Weights 400 / 500 / 700.

## Spacing, radius, elevation
- Spacing: 4 px grid — 4, 8, 12, 16, 24, 32, 48.
- Radius: 8 inputs · 12 cards · 20 sheets · full for chips and map pins.
- Elevation: card, sheet, modal. Dark mode uses lighter surfaces instead of shadows.

## Motion
120 / 200 / 320 ms, easing cubic-bezier(0.2, 0, 0, 1). Price drop: number rolls down + 600 ms accent
flash. Everything disabled under prefers-reduced-motion.

## Signature components
LivePrice · DropCountdown · StockBar · PriceCurveChart · MapPricePin · HoldTimer · PickupCodeCard ·
CounterScanner (behaviour defined in the SRS).

## Breakpoints
< 640 mobile (bottom tab bar) · 640–1023 tablet · ≥ 1024 desktop (sidebar for seller/admin).
