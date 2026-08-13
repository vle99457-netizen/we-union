# WE — Gear Made Personal

A premium, editorial sportswear commerce website for the US market. The experience implements the WE Website Requirements V3.0 across 19 page types, original-series discovery, city merchandising, product detail, personalization, team briefs, stories, support, cart, and a deliberately non-transactional checkout demonstration.

## Experience principles

- WE is the only customer-facing brand name.
- CREATE, HONOR, and BELONG are the three story worlds; CREATE YOURS is the personalization studio.
- Bebas Neue drives display typography, Roboto drives interface and body copy, and the palette stays within Obsidian, Warm Ivory, WE Gold, and functional neutrals.
- All campaign imagery in this repository is original and unbranded.
- Sample products and prices are clearly identified as prototype content. No reviews, inventory, delivery claims, authentication, payment, or CRM activity is fabricated.

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
npm run build
# or run the complete gate:
npm run verify
```

The source audit covers image dimensions and alternatives, semantic control types, form names, motion anti-patterns, zoom safety, and the required visual-direction contract. The route smoke test server-renders 24 representative routes and verifies one `h1` plus a main landmark on every surface.

## Integration boundaries

The current repository is a production-candidate front end. Before a commercial launch, connect and verify the product catalog, inventory, pricing, personalization production rules, authentication, payments, fulfillment tracking, CRM, legal policies, consent, analytics, and CMS. The UI intentionally explains unavailable integrations instead of pretending they are live.
