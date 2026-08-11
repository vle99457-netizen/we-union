# WE V2.4 Design System

## Design Read

WE is a premium American custom sportswear and embroidered apparel brand for US consumers, teams, clubs, and custom buyers. The experience should feel like an editorial sports publication with commerce precision: bold photography, restrained surfaces, large but controlled typography, visible craft evidence, and direct routes from a series story to its products.

- Variance: 8/10
- Motion: 6/10
- Density: 4/10
- Theme: cold luxury with sports energy
- Required brand name in customer-facing copy: WE

## Typography

| Role | Family | Weight | Use |
| --- | --- | --- | --- |
| Display | Bebas Neue | 400 | H1 to H3, hero lockups, world and series titles |
| Interface | Roboto | 400, 500, 700 | Body, navigation, buttons, forms, price and transaction UI |
| CJK fallback | Noto Sans CJK SC | 400 to 700 | Internal bilingual operations UI |

- Fonts are self-hosted through Fontsource WOFF2 assets with `font-display: swap`.
- Display headings use tight line-height without extreme negative tracking.
- Body copy uses 1.55 to 1.75 line-height and stays under roughly 70 characters per line.

## Color

| Token | Value | Purpose |
| --- | --- | --- |
| Obsidian | `#0B0C0E` | Primary dark surface |
| Graphite | `#17191D` | Elevated dark surface |
| Warm White | `#F4F3EF` | Primary light surface |
| Metallic Silver | `#B9BEC7` | Brand accent, controls, focus-adjacent detail |
| Steel | `#5D626A` | Secondary text |
| Line | `#CFD1D3` | Dividers and borders |
| Signal Blue | `#2F62D0` | Focus and rare sports accent |
| Signal Red | `#A82D2D` | Rare urgency and navigation accent |

Rules:

- Never use pure black as the main surface.
- Blue and red are functional accents, not section backgrounds.
- Metallic effects come from contrast, photography, and layered grays, not decorative gradients.
- Text and controls meet WCAG AA contrast.

## Spacing and Layout

- Base spacing unit: 4px.
- Page gutter: `clamp(20px, 3.6vw, 60px)`.
- Section rhythm: `clamp(70px, 7vw, 112px)`.
- Maximum editorial copy width: 780px.
- Product grid: 4 columns desktop, 2 to 3 tablet, 1 to 2 mobile.
- Hero: 72 to 88 viewport height, minimum 680px desktop, with copy in the left safe area and subject focus on the right.
- Homepage modules follow V2.4 order exactly: Hero, Three Worlds, Featured Series, Create Yours, Craftsmanship, WE Promise, Stories, Community, Newsletter and Footer.

## Components

### Header

- Desktop primary navigation: CREATE, HONOR, BELONG, CREATE YOURS, STORIES, ABOUT.
- No top-level SHOP or SHOP BY SPORT.
- Mobile top bar: Menu, WE mark, Search, Cart.
- Mobile drawer groups: THREE WORLDS, EXPLORE, account and support links.

### Buttons

- Rectangular 2px radius, minimum 48px height.
- Primary light or silver fill, secondary transparent border.
- One clear primary action per content block.
- Hover movement is limited to 2px and never shifts surrounding layout.

### Series Gateway

- One full-width series module per row.
- Series story, texture, two or three representative product images, and one action.
- No price, rating, quick add, or dense product-card grid at the gateway level.

### Product Cards

- Product photography leads; metadata remains compact.
- Price and quick add appear only on product-list and search contexts.
- Minimum 44px touch targets for quick add and quantity controls.

### Create Yours

- Marketing sequence: CHOOSE, PERSONALIZE, REVIEW, WE MAKE IT.
- Studio sequence: CHOOSE, PERSONALIZE, REVIEW, ORDER & TRACK.
- Preview, design ID, proof version, rights approval, save draft, and order tracking remain functional.

### WE Promise

- Exactly four items immediately after Craftsmanship.
- Warm light strip, no heading and no call to action.
- ORIGINAL DESIGN, PERSONALIZED PRODUCTION, STRICT QUALITY INSPECTION, TRACKED DELIVERY.

## Motion

- Standard transitions: 150 to 240ms.
- Hero media and copy receive a single restrained entrance animation.
- Product and editorial images use small crop changes on hover.
- Drawers, accordions, focus, and button states communicate state changes directly.
- No scroll event listeners, parallax, decorative looping animation, or cursor effects.
- `prefers-reduced-motion` reduces all animation and smooth scrolling.

## Accessibility and Responsive Rules

- Semantic headings, landmarks, labels, fieldsets, and button names.
- Visible skip link and focus treatment.
- Escape closes mobile drawer and community lightbox.
- Inputs use at least 16px text on small screens to prevent viewport zoom.
- No hover-only information.
- Validate at 320, 375, 768, 1024, and 1440 widths.

## Anti-Patterns

- Generic ecommerce category rail or marketplace density.
- Four equal product cards on the homepage featured module.
- Excessive pills, floating rounded cards, ornamental gradients, or large display copy that overwhelms the product story.
- Repeated section numbering, duplicate calls to action, decorative labels, or obvious synthetic imagery.
- Visible legacy brand names, em dash characters, or inconsistent type families.
