# Implementation Plan

## Technical context

- Existing stack stays unchanged: React + TypeScript + Vite + React Router.
- Add service adapters behind typed interfaces; do not replace prototype UI wholesale.
- Keep URL state as the canonical share/refresh/back-forward representation for discovery controls.
- Preserve existing source-audit and route-smoke gates; extend them instead of creating parallel checks.

## Phases

1. **Foundation:** design tokens, content lock, schemas, API clients, analytics dictionary and testing fixtures.
2. **Discovery:** collection URL state and FIND YOUR CITY.
3. **Customization:** Design ID, autosave, price rules, proof versions and rights review.
4. **Commerce:** real catalog, inventory, cart, checkout, payment and account services.
5. **Fulfillment:** production/QC/shipping event timeline.
6. **Content operations:** CMS, craft evidence, UGC rights, policies and team briefs.
7. **Launch hardening:** accessibility, performance, SEO, security, privacy, observability and rollback.

## Quality gates

- `npm run check`
- `npm run test`
- `npm run audit:source`
- `npm run smoke:routes`
- `npm run build`
- New Playwright-style E2E, visual regression, axe and contract tests for V04/V05.

## Rollback

- City discovery and live integrations launch behind independent flags.
- If a service is unavailable, show an honest unavailable state; never fall back to simulated success.
- Content and legal records are versioned and can be restored without code rollback.