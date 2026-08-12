# WE UNION V2.1 Requirements Traceability

This matrix records how the attached V2.1 requirements were interpreted and implemented. Status `Implemented` means the behavior works in the browser prototype. Status `Integration boundary` means the UX and contract are represented, but a real external or operational service is still required.

## 1. Brand and global system

| Requirement | Implementation | Status |
| --- | --- | --- |
| Replace legacy branding with WE UNION | WE UNION mark, wordmark, metadata, copy, footer, and favicon throughout | Implemented |
| US-first storefront language | Storefront content defaults to English | Implemented |
| Internal Chinese support | Admin navigation, metrics, roles, and controls include Chinese labels | Implemented |
| Remove “Shop by Sport” | No sport-based global navigation or taxonomy | Implemented |
| Required palette | CSS tokens: Obsidian, Warm Ivory, Union Gold, Steel Gray, White | Implemented |
| Display and UI typography roles | Condensed display stack plus neutral UI/body stack | Implemented |
| Announcement message | Exact V2.1 announcement copy at the top of storefront pages | Implemented |
| Desktop header order | Logo, Shop, Create, Honor, Belong, Create Yours, Stories, About, search, account, cart | Implemented |
| Mobile header and menu grouping | Menu/logo/search/cart shell plus full-screen numbered drawer | Implemented |
| Footer taxonomy | Shop, Worlds, Customize, Explore/Stories, Support, Company/Legal | Implemented |

## 2. Homepage sequence

| Required module, in order | Implementation | Status |
| --- | --- | --- |
| 1. Hero | WE UNION, “Gear Made Personal,” brand body, two required CTAs | Implemented |
| 2. Three Worlds | CREATE / HONOR / BELONG cards with required positioning copy | Implemented |
| 3. New & Featured | Shared catalog cards and all five specified merchandising tags | Implemented |
| 4. Create Yours | “Original First. Personal After.” and four-step overview | Implemented |
| 5. Craftsmanship | Embroidery, Materials, Construction, Inspection evidence | Implemented |
| 6. Promise | Exactly four promise items; no fifth item is rendered | Implemented |
| 7. Stories | Three editorial entries and stories index/detail routes | Implemented |
| 8. Worn Your Way | Community editorial section and gallery/lightbox | Implemented |
| 9. Newsletter / Footer | Validated newsletter form and full global footer | Implemented |

## 3. Required storefront pages

| Page/template | Route | Key behavior | Status |
| --- | --- | --- | --- |
| Homepage | `/` | Nine-module editorial storefront | Implemented |
| Shop | `/shop` | World/type filters, sort, product counts, quick add | Implemented |
| World landing | `/world/:world` | Create/Honor/Belong hero, editorial statement, catalog | Implemented |
| Product detail | `/product/:id` | Color/size, details, care, delivery, custom entry, add to cart | Implemented |
| Create Yours | `/create-yours` | Four-step interactive design studio | Implemented |
| Cart | `/cart` | Ready/custom distinction, quantity, removal, Design ID/proof/edit | Implemented |
| Checkout | `/checkout` | Information, Delivery, Payment, Review | Implemented |
| Account / saved designs | `/account` | Orders, saved design, profile/address/return panels | Implemented |
| Order tracking | `/track` | Eight required order/production states | Implemented |
| Stories index | `/stories` | Editorial card index | Implemented |
| Story detail | `/stories/:slug` | Article-style detail page | Implemented |
| Craftsmanship | `/craftsmanship` | Four-stage process and QC checklist | Implemented |
| Community | `/community` | Editorial grid and accessible modal/lightbox | Implemented |
| About | `/about` | Purpose, manifesto, and three brand values | Implemented |
| Support / FAQ | `/support` | Search entry, support paths, accessible accordions | Implemented |
| Team & Group Orders | `/team-orders` | Roster rows, member add/remove, CSV input | Implemented |
| Site search | `/search` | Live product filtering and empty state | Implemented |
| Policy / guide | `/policies/:type` | Shipping, returns, privacy, terms, accessibility, size guide | Implemented |

## 4. Create Yours requirements

| Requirement | Implementation | Status |
| --- | --- | --- |
| Four steps | Choose, Personalize, Review, Order & Track | Implemented |
| Desktop split | Preview/configuration split within the required 58–64% / 36–42% range | Implemented |
| Mobile composition | Compact preview, horizontally scrollable stepper, sticky price/actions | Implemented |
| Four product views | Front, Back, Left, Right controls | Implemented |
| Personalization | Name, 0–99 number, approved font, color, patch, size | Implemented |
| Layer/safe-field guidance | Visible safe print field and placement guidance | Implemented |
| Upload constraints | Input accepts PNG/JPG/PDF; copy explicitly rejects executable SVG | Implemented |
| Rights attestation | Required confirmation before approved design can be added | Implemented |
| Proof and identity | Design ID and Proof V1 remain attached to cart and checkout | Implemented |
| Live price | Name, number, and patch options update total immediately | Implemented |
| Draft save | Local persistent design draft with restored fields | Implemented |
| Cart handoff | Approved design becomes a personalized cart line | Implemented |
| Production proof service | Real versioned asset generation and operator approval queue | Integration boundary |
| Malware scanning | Server-side file quarantine, scan, and review | Integration boundary |

## 5. Commerce and customer journey

| Requirement | Implementation | Status |
| --- | --- | --- |
| Single product data source | Shared `products` data powers home, shop, PDP, search, cart, and checkout | Implemented |
| Ready/custom distinction | Labels and metadata across cart/checkout | Implemented |
| Cart persistence | Local cart state survives route changes/reloads | Implemented |
| Checkout stages | Information, Delivery, Payment, Review | Implemented |
| No raw card storage | No card-number input; hosted/tokenized provider contract is explained | Implemented |
| Account data areas | Orders, designs, profile, addresses, returns | Implemented |
| Tracking stages | Confirmed through Delivered, including review, production, QC, pack, ship | Implemented |
| Team roster | Manual rows plus CSV selection contract | Implemented |
| Inventory, tax, payment, returns | Real services and rules engine | Integration boundary |
| Authentication | Real identity, sessions, MFA, password/reset, and account authorization | Integration boundary |

## 6. Admin and operations

| Requirement | Implementation | Status |
| --- | --- | --- |
| Nine roles | Super Admin, Content Editor, Merchandiser, Designer/Prepress, Production, QC, Fulfillment, Support, Analyst | Implemented |
| Thirteen modules | Dashboard through Settings, matching the specified operational areas | Implemented |
| Bilingual internal UI | English module names with Chinese labels | Implemented |
| Dashboard | Orders, design review, production, QC, queue, audit cards | Implemented |
| Version/audit concept | Change note, status, saved-version feedback, audit list | Implemented |
| Permission visibility | Role selector and example view/draft/publish/audit permissions | Implemented |
| Enforced RBAC and immutable audit | Server-side policy enforcement and durable audit storage | Integration boundary |
| CMS/catalog/OMS integrations | Persistent databases and production workflows | Integration boundary |

## 7. Quality, accessibility, security, SEO, and performance

| Requirement | Implementation | Status |
| --- | --- | --- |
| Breakpoints | Styles cover 320/375, 640, 768/900, 1024/1180, and 1440-class layouts | Implemented |
| Touch targets | Primary links/buttons/inputs use at least 44px interaction height | Implemented |
| Keyboard focus | High-visibility `:focus-visible` treatment | Implemented |
| Reduced motion | `prefers-reduced-motion` disables non-essential transitions | Implemented |
| Alt/decorative images | Informative images have alt; decorative card imagery uses empty alt | Implemented |
| Semantic navigation/headings | Named nav regions, page-level headings, form labels, dialogs | Implemented |
| FAQ accessibility | Button-based accordion with `aria-expanded` | Implemented |
| Upload safety | Allowed types and SVG rejection are explicit | Implemented |
| Fake urgency/reviews | No countdowns, fake scarcity, star ratings, or fabricated review totals | Implemented |
| Fake production claims | Demo orders/statuses and prototype editorial content are labeled | Implemented |
| Metadata | Title, description, viewport, theme, Open Graph, organization JSON-LD | Implemented |
| Canonical/product/article schema | Per-route canonical and verified live commerce/editorial schema | Integration boundary |
| Performance foundations | Local assets, no runtime font fetch, CSS-driven responsive layouts | Implemented |
| Target Web Vitals | LCP ≤2.5s, INP ≤200ms, CLS ≤0.10 require production RUM confirmation | Integration boundary |
| WCAG 2.2 AA certification | Design provisions are present; formal audit and assistive-tech testing remain | Integration boundary |
| Privacy/consent/legal | Prototype surfaces exist; jurisdiction-specific review and consent platform remain | Integration boundary |

## 8. Verification completed

- `npm run lint`
- `npm run build`
- Browser route sweep across all 18 required storefront page types plus `/admin`
- Broken-image and horizontal-overflow checks
- Live customizer name/number/price test
- Proof approval → personalized cart line test
- Cart persistence across navigation
- Four-stage checkout and demo confirmation
- Admin module/role/audit/bilingual checks

The prototype intentionally stops at integration boundaries that require credentials, contracted providers, production data, or legal/operational approval.
