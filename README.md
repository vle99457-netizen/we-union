# WE — Sports Heritage Meets Personal Identity

A documentary-luxury sportswear brand website for the US market. The experience implements the WE Website Requirements V3.0 across 19 page types, original-series discovery, city merchandising, product detail, personalization, team briefs, stories, support, cart, and a deliberately non-transactional order-review demonstration.

## Experience principles

- WE is the only customer-facing brand name.
- CREATE, HONOR, and BELONG are the three story worlds; CREATE YOURS is the personalization studio.
- Bebas Neue drives display typography; Helvetica Neue / Neue Haas Grotesk system fallbacks drive interface and body copy.
- Brand colors are referenced only by their documented names: WE BLACK, WE WHITE, and METAL SILVER. Concrete screen colors are temporary preview tokens, not official brand values.
- All campaign imagery in this repository is original and unbranded.
- CREATE contains White Pulse, Black Rift, and Identity Fusion. HONOR is rights-gated, while BELONG is explicitly Coming Soon with no formal products.
- Unverified prices display as `PRICE TBD`. No reviews, inventory, delivery claims, authentication, payment, or CRM activity is fabricated.

## Run locally

```bash
npm install
npm run dev
```

## Quality gates

```bash
npm run check
npm run test
npm run audit:source
npm run smoke:routes
npm run e2e
npm run build
# or run the complete gate:
npm run verify
```

The source audit covers image dimensions and alternatives, semantic control types, form names, motion anti-patterns, zoom safety, and the required visual-direction contract. The route smoke test server-renders 29 representative routes and verifies one `h1` plus a main landmark on every surface. Browser E2E checks the approved three-series gateway, compatibility redirects, HONOR/BELONG publication gates, non-numeric `PRICE TBD` states, city discovery, and the exact CREATE intellectual-property notice.

## Integration boundaries

The current repository is a production-candidate front end. Before a commercial launch, connect and verify the product catalog, inventory, pricing, personalization production rules, authentication, payments, fulfillment tracking, CRM, legal policies, consent, analytics, and CMS. The UI intentionally explains unavailable integrations instead of pretending they are live.
