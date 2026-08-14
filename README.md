# WE — Sports Heritage Meets Personal Identity

A documentary-luxury sportswear brand website for the US market. The experience implements the WE Website Requirements V3.0 across 19 page types, original-series discovery, city merchandising, product detail, personalization, team briefs, stories, support, cart, and a deliberately non-transactional order-review demonstration.

## Experience principles

- WE is the only customer-facing brand name.
- Every interface brand mark uses the official PDF artwork exported as `/images/we-logo.svg`; the matching transparent PNG is retained for raster upload and compatibility flows.
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

## Bilingual site administration

The protected `/admin` workspace provides Chinese and English interfaces for all configuration-driven parts of the current website:

- dashboard and publishing status;
- brand identity, announcement, navigation, contact details, and footer;
- every homepage section;
- worlds, series, products, stories, pricing visibility, and publication state;
- page introductions, policy content, and page availability;
- customizer controls and four independent garment preview views;
- shared media library;
- commerce feature switches and integration status; and
- SEO defaults, indexing, and maintenance mode.

Changes remain an unpublished browser draft until **Publish** is selected. Published configuration is stored as JSON in Vercel Blob and consumed by the public site. The admin language preference is the only admin value stored in the browser.

The customizer module publishes four independent, single-garment preview images: front, back, left sleeve, and right sleeve. Source PNG, JPG, or WEBP files are normalized in the browser to centered 1600 × 1600 WEBP images before upload.

Create a Vercel Blob store for the project, then configure these server-side environment variables for Preview and Production:

- `BLOB_READ_WRITE_TOKEN` — supplied by the connected Vercel Blob store.
- `CUSTOMIZER_ADMIN_PASSWORD` — the password for the complete admin workspace and all protected upload APIs. `SITE_ADMIN_PASSWORD` is also supported as an optional future replacement.

The admin establishes an eight-hour, HTTP-only secure session. The public customizer reads published view images without authentication. Configuration writes and uploads remain password-protected, and neither server secret is included in the client bundle. If Blob is not configured, public pages safely use repository defaults and the customizer uses the catalog's separate per-view crops.

## Quality gates

```bash
npm run check
npm run test
npm run audit:source
npm run smoke:routes
npm run smoke:logo
npm run e2e
npm run build
npm run preview:verify
# or run the complete gate:
npm run verify
```

The source audit covers image dimensions and alternatives, semantic control types, form names, motion anti-patterns, zoom safety, and the required visual-direction contract. The route smoke test server-renders 30 representative routes and verifies one `h1` plus a main landmark on every surface. Browser E2E checks the approved three-series gateway, compatibility redirects, HONOR/BELONG publication gates, non-numeric `PRICE TBD` states, city discovery, and the exact CREATE intellectual-property notice. Preview verification checks all expected desktop and mobile route reports, document landmarks, browser errors, viewports, and WebP file integrity without relying on environment-specific byte-for-byte raster output.

## Integration boundaries

The current repository is a production-candidate front end. Before a commercial launch, connect and verify the product catalog, inventory, pricing, personalization production rules, authentication, payments, fulfillment tracking, CRM, legal policies, consent, analytics, and CMS. The UI intentionally explains unavailable integrations instead of pretending they are live.
