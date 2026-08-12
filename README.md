# WE UNION

Document-driven, responsive commerce and personalization prototype for WE UNION. The implementation follows the V2.1 homepage reconstruction and customization-system requirements, with a US-English storefront and a bilingual operations prototype.

## What is implemented

- Strict nine-module homepage and the required global navigation/footer system
- 18 storefront page types plus a bilingual admin prototype
- Shared product data for home, shop, PDP, cart, checkout, and search
- Interactive four-step jersey customizer with live front/back/left/right preview
- Name, number, color, size, patch, approved upload types, rights attestation, Design ID, proof version, and live price
- Cart persistence, personalized line-item metadata, four-stage checkout, order confirmation, account, and order tracking
- Shop filters/sort, site search, FAQ accordions, community lightbox, team roster builder, and CSV input
- Obsidian / Warm Ivory / Union Gold design tokens, responsive layouts, keyboard focus, reduced-motion support, and 44px interaction targets
- Hosted-payment placeholder only; this prototype never requests or stores card details

The detailed document-to-code mapping is in [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md).

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
| Shop | `/shop` |
| Worlds | `/world/create`, `/world/honor`, `/world/belong` |
| Product detail | `/product/union-01-jersey` |
| Create Yours | `/create-yours` |
| Cart / checkout | `/cart`, `/checkout` |
| Account / tracking | `/account`, `/track` |
| Stories | `/stories`, `/stories/the-mark-we-carry` |
| Craft / community / about | `/craftsmanship`, `/community`, `/about` |
| Support / team orders / search | `/support`, `/team-orders`, `/search` |
| Policy and guides | `/policies/shipping` and related policy routes |
| Admin prototype | `/admin` |

## Architecture

- `app/data.ts` — the shared prototype catalog, stories, worlds, FAQ, and tracking states
- `app/site-app.tsx` — route-specific experiences and all working storefront/admin interactions
- `app/globals.css` — WE UNION tokens, editorial layouts, component styles, and breakpoints
- `app/[...slug]/page.tsx` — dynamic route entry for the required page set
- `public/reference/` — visual references supplied in the requirements document

## Production boundaries

This is a high-fidelity functional prototype, not a production commerce backend. Before launch, connect approved systems for identity/MFA, CMS versioning, inventory, tax, hosted/tokenized payment, malware scanning, proof approval, production/QC, carrier tracking, notifications, analytics consent, and audit retention. Replace all editorial samples with licensed, approved final content and complete legal review.
