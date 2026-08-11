# WE

Document-driven responsive commerce and personalization prototype for WE. The storefront follows the V2.4 information architecture and visual system for a premium American custom sportswear and embroidered apparel brand.

## What is implemented

- V2.4 nine-module homepage in the required order
- Collection gateway at `/collections` and series product pages at `/collections/:series`
- CREATE opens the series gateway directly; HONOR and BELONG retain their editorial world pages
- Product details, cart persistence, four-stage checkout, account, and order tracking
- Four-step Create Yours studio with live garment preview, draft save, proof approval, and cart handoff
- Team roster builder, search, FAQ accordions, community lightbox, policies, stories, and bilingual admin prototype
- Bebas Neue display typography, Roboto interface typography, local WOFF2 assets, metallic-silver palette, visible focus, reduced motion, and responsive layouts
- Hosted-payment placeholder only; the prototype never requests or stores card details

The detailed document-to-code mapping is in [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md). The generated and curated design system is in [design-system/we/MASTER.md](./design-system/we/MASTER.md).

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
npm test
```

## Main routes

| Experience | Route |
| --- | --- |
| Homepage | `/` |
| Collection gateway | `/collections` |
| Series products | `/collections/water-ripple`, `/collections/black-rift` |
| Product archive alias | `/shop` |
| CREATE gateway alias | `/world/create` → series gateway |
| Worlds | `/world/honor`, `/world/belong` |
| Product detail | `/product/water-ripple-24-jersey` |
| Create Yours | `/custom`, `/create-yours` |
| Cart and checkout | `/cart`, `/checkout` |
| Account and tracking | `/account`, `/track` |
| Stories | `/stories`, `/stories/the-mark-we-carry` |
| Craft, community, about | `/craftsmanship`, `/community`, `/about` |
| Support, team orders, search | `/support`, `/team-orders`, `/search` |
| Policy and guides | `/policies/shipping` and related policy routes |
| Admin prototype | `/admin` |

## Architecture

- `app/data.ts`: shared catalog, series, stories, worlds, FAQ, and tracking states
- `app/site-app.tsx`: route-specific experiences and working storefront/admin interactions
- `app/globals.css`: WE tokens, editorial layouts, components, motion, and breakpoints
- `app/[...slug]/page.tsx`: dynamic route entry for the preserved page set
- `public/reference/`: visual references supplied in the requirements document

## Production boundaries

This is a high-fidelity functional prototype, not a production commerce backend. Before launch, connect approved systems for identity, CMS versioning, inventory, tax, hosted payment, malware scanning, proof approval, production and quality control, carrier tracking, notifications, analytics consent, and audit retention. Replace prototype editorial samples with licensed final content and complete legal review.
