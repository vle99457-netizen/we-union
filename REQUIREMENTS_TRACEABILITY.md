# WE V2.4 Requirements Traceability

Status `Implemented` means the interaction works in the browser prototype. Status `Integration boundary` means the interface and contract are represented, while a production service is still required.

## Brand and global system

| Requirement | Implementation | Status |
| --- | --- | --- |
| Visible brand name is WE | Header, footer, metadata, customer copy, alt text, structured data, and operations labels use WE | Implemented |
| US-first storefront | Storefront language, USD pricing, delivery, and sizing patterns target US buyers | Implemented |
| Required typography | Bebas Neue for display and Roboto for interface/body, with Noto Sans CJK SC fallback | Implemented |
| Premium sportswear palette | Obsidian, Graphite, Warm White, Metallic Silver, Steel, and rare blue/red accents | Implemented |
| Remove top-level SHOP patterns | Primary navigation is CREATE, HONOR, BELONG, CREATE YOURS, STORIES, ABOUT; CREATE opens `/collections` | Implemented |
| Mobile navigation | Menu, centered WE mark, Search, Cart, grouped drawer, and Escape close | Implemented |
| Announcement | Original Design, Personalized for You, Made with Purpose | Implemented |

## Homepage sequence

| Required module, in order | Implementation | Status |
| --- | --- | --- |
| 1. Hero | Cinematic sports image, WE lockup, required message, collections and custom actions | Implemented |
| 2. Three Worlds | CREATE, HONOR, BELONG editorial gateways | Implemented |
| 3. New and Featured | Full-width Water Ripple and Black Rift series gateways without price or quick add | Implemented |
| 4. Create Yours | Original First. Personal After. plus four-step overview | Implemented |
| 5. Craftsmanship | Embroidery, Materials, Construction, Inspection with process photography | Implemented |
| 6. WE Promise | Exactly four light-strip items immediately after Craftsmanship, no action | Implemented |
| 7. Stories | One leading story with two supporting editorial entries | Implemented |
| 8. Worn Your Way | Full-bleed community editorial and accessible gallery route | Implemented |
| 9. Newsletter and Footer | Validated email form and full global footer | Implemented |

## Collection and commerce architecture

| Requirement | Implementation | Status |
| --- | --- | --- |
| Collection gateway | `/collections` shows one large series module per row | Implemented |
| CREATE entry behavior | Header, mobile navigation, homepage world card, footer, and legacy `/world/create` open the series gateway | Implemented |
| Series product list | `/collections/:series` filters only products from the current series | Implemented |
| Existing routes retained | `/shop` and `/create-yours` remain functional aliases | Implemented |
| Shared product data | Series, worlds, PDP, search, cart, and checkout share `app/data.ts` | Implemented |
| Product detail | Color, size, care, delivery, customization entry, and add to cart | Implemented |
| Cart and checkout | Persistence, quantity, removal, proof metadata, four checkout stages | Implemented |
| Account and tracking | Saved design, order summary, and eight production/delivery states | Implemented |
| Search and support | Live catalog search, FAQ accordions, tracking, and team roster entry | Implemented |

## Create Yours

| Requirement | Implementation | Status |
| --- | --- | --- |
| Four functional steps | Choose, Personalize, Review, Order and Track | Implemented |
| Live preview | Front, Back, Left, Right with safe field and chosen color/name/number | Implemented |
| Personalization | Name, 0 to 99 number, typeface, color, patch, and size | Implemented |
| Upload controls | PNG, JPG, PDF only; SVG is not accepted or executed | Implemented |
| Rights approval | Required before an approved design can be added to cart | Implemented |
| Proof identity | Design ID and proof version remain attached to cart and checkout | Implemented |
| Draft save | Local design state is restored from browser storage | Implemented |
| Production proof service | Durable asset generation and operator approval queue | Integration boundary |
| Malware scanning | Server-side quarantine and inspection | Integration boundary |

## Accessibility, responsive, motion, and performance

| Requirement | Implementation | Status |
| --- | --- | --- |
| Mobile-first breakpoints | Layout rules cover 320, 375, 640, 768, 900, 1024, 1180, and 1440 classes | Implemented |
| Touch targets | Primary buttons and icon actions use 44px or larger targets | Implemented |
| Keyboard access | Skip link, visible focus, button accordions, named navigation and dialogs | Implemented |
| Dialog close | Escape closes mobile drawer and community lightbox | Implemented |
| Reduced motion | `prefers-reduced-motion` minimizes transitions and entrance effects | Implemented |
| Purposeful motion | Hero entrance, image crop, button, drawer, and accordion feedback only | Implemented |
| Image loading | Priority hero image and lazy decoding below the fold | Implemented |
| Runtime font requests | Fontsource packages provide local WOFF2 assets | Implemented |
| Production performance evidence | Real-user LCP, INP, and CLS measurement | Integration boundary |
| Formal WCAG 2.2 AA certification | Assistive-technology and manual certification | Integration boundary |

## Operations and production boundaries

The bilingual admin prototype retains roles, catalog, design review, production, quality control, fulfillment, support, and audit concepts. Real identity, RBAC, inventory, tax, hosted payment, order management, production, carrier, consent, legal, and durable audit services remain integration boundaries.
