---
name: WE
description: Premium US editorial-performance commerce for original sportswear made personal.
colors:
  obsidian: "#0A0A0A"
  warm-ivory: "#F7F4ED"
  paper: "#FFFDF8"
  we-gold: "#9A7442"
  functional-gold: "#76552D"
  light-gold: "#C5A879"
  steel: "#666666"
  rule: "#D8D8D4"
  white: "#FFFFFF"
  water-cobalt: "#174A8B"
  product-field: "#E9E7DF"
typography:
  display:
    fontFamily: "Bebas Neue, Impact, sans-serif"
    fontSize: "clamp(5.2rem, 11.4vw, 10.6rem)"
    fontWeight: 400
    lineHeight: 0.77
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bebas Neue, Impact, sans-serif"
    fontSize: "clamp(3.4rem, 7vw, 7.4rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bebas Neue, Impact, sans-serif"
    fontSize: "2.8rem"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "normal"
  body:
    fontFamily: "Roboto, Noto Sans, Noto Sans CJK SC, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Roboto, Noto Sans, Noto Sans CJK SC, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  square: "0"
  circle: "50%"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  "2xl": "64px"
  "3xl": "96px"
components:
  button-dark:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "13px 20px"
    height: "48px"
  button-dark-hover:
    backgroundColor: "{colors.light-gold}"
    textColor: "{colors.obsidian}"
    rounded: "{rounded.square}"
  button-gold:
    backgroundColor: "{colors.light-gold}"
    textColor: "{colors.obsidian}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "13px 20px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.obsidian}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "13px 20px"
    height: "48px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.obsidian}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px"
    height: "50px"
  icon-control:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    size: "44px"
  product-image:
    backgroundColor: "{colors.product-field}"
    rounded: "{rounded.square}"
  eyebrow:
    textColor: "{colors.steel}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
---

# Design System: WE

## Overview

**Creative North Star: "The Stadium Tunnel Editorial"**

The Stadium Tunnel Editorial treats every WE surface like the charged threshold between preparation and the field: dark architectural frames, warm product light, monumental declarations, documentary detail, and a clear route forward. The system makes original series and personal meaning feel inseparable, with campaign-scale emotion giving way to exact, trustworthy commerce.

The visual voice is premium US editorial-performance commerce: athletic and decisive, but never borrowed from another sports brand. Composition is spacious and asymmetric; depth comes from tonal planes, rules, cropping, and image scale rather than ornamental chrome. Gold is held back for signals, proof points, selected states, and decisive moments so its rarity carries authority.

**Key Characteristics:**

- Monumental condensed display type paired with quiet, highly legible functional copy.
- Obsidian editorial frames alternating with Warm Ivory and Paper product fields.
- Sharp squared controls, image-first commerce, precise rules, and generous negative space.
- Full-bleed campaign imagery and close documentary craft details with intentional crops.
- One visible-by-default authored reveal, plus restrained state and image transitions.
- Series-first discovery: visitors enter a visual world before product comparison begins.

### Finish Disposition & Prototype Limits

The design direction is complete and documented for a high-fidelity prototype. The independent finish verdict was **PASS WITH CONDITIONS**: its source-level conditions are now closed through series-first home discovery, the restored `GEAR MADE PERSONAL.` brand line, exact product-and-size customization continuity, contextual focus contrast, correct region naming, complete background inertness, and visible-default motion. Preserve those behaviors as regression requirements. Public production release still requires real-browser visual and keyboard QA at `320`, `375`, `768`, `1024`, and `1440px` because that rendering pass was unavailable in the implementation environment.

This is not production commerce. Prices and product specifications are sample content; payment, inventory, shipping, tax, production, tracking, authentication, CRM, CMS, moderation, consent, and legal operations are not connected. Saved customization state is browser-local, the studio is a 2D multi-view preview, and the team path is a brief intake rather than the future roster/proof workspace. Reused campaign imagery remains a prototype content constraint and should be replaced only with approved original or licensed photography. No implementation may invent operational claims to make these gaps appear complete.

## Colors

The palette moves between near-black architecture and warm editorial paper, with two contrast-safe golds and one collection-specific cobalt.

### Primary

- **Obsidian** (`#0A0A0A`): The structural dark for navigation, footers, immersive stories, primary actions, and type on light fields.

### Secondary

- **WE Gold** (`#9A7442`): The brand signal for large marks, icons, selected details, and proof moments; it is not a general surface fill.
- **Functional Gold** (`#76552D`): The contrast-safe gold for small functional text and indices on light surfaces.
- **Light Gold** (`#C5A879`): The luminous CTA and accent treatment on Obsidian, plus dark-on-gold utility moments.

### Tertiary

- **Water Cobalt** (`#174A8B`): A collection and customization color used inside authored product worlds, never as a second global brand accent.

### Neutral

- **Warm Ivory** (`#F7F4ED`): The principal light canvas and dark-type counterpart.
- **Paper** (`#FFFDF8`): A subtly lighter working surface for forms, editorial modules, and commerce detail.
- **Steel** (`#666666`): Supporting copy, metadata, and lower-emphasis functional language on light surfaces.
- **Rule** (`#D8D8D4`): One-pixel dividers, field boundaries, and structural separation.
- **White** (`#FFFFFF`): High-contrast text and control treatment over dark frames and photography.
- **Product Field** (`#E9E7DF`): A quiet neutral stage behind product imagery and the studio preview.

### Named Rules

**The Gold Is a Signal Rule.** Reserve gold for emphasis, selection, proof, and navigation cues; never turn it into a broad decorative wash.

**The Contrast Before Branding Rule.** Use Functional Gold for small text on light surfaces, Light Gold only where its foreground/background pairing is readable, and Warm Ivory or White when gold cannot meet WCAG 2.2 AA.

## Typography

**Display Font:** Bebas Neue (with Impact and sans-serif fallbacks)

**Body Font:** Roboto (with Noto Sans, Noto Sans CJK SC, Arial, and sans-serif fallbacks)
**Label Font:** Roboto (with the same multilingual fallback stack)

**Character:** Bebas Neue supplies the tunnel-poster scale: narrow, physical, and declarative. Roboto keeps navigation, product facts, forms, disclosures, and long reading calm enough that the commerce remains credible; Noto Sans CJK SC protects the intended hierarchy when Chinese glyphs appear.

### Hierarchy

- **Display** (400, `clamp(5.2rem, 11.4vw, 10.6rem)`, `0.77`, `-0.02em`): Hero and major page declarations; uppercase, tightly stacked, and allowed to dominate the viewport.
- **Headline** (400, `clamp(3.4rem, 7vw, 7.4rem)`, `0.88`, `-0.015em`): Section and feature statements that anchor asymmetric compositions.
- **Title** (400, `2.8rem`, `0.92`): Cards, process stages, confirmations, and compact editorial headings.
- **Body** (400, `1rem`, `1.7`): Product explanation, process copy, forms, and reading content; editorial articles narrow to roughly `720px`.
- **Label** (700, `0.72rem`, `0.08em`): Eyebrows, navigation, metadata, controls, and field labels; generally uppercase, with context-specific tracking up to `0.18em`.

### Named Rules

**The One Display Voice Rule.** Bebas Neue is for uppercase declarations and short titles only; never use it for paragraphs, prices, form values, or dense functional UI.

**The Functional Copy Stays Quiet Rule.** Roboto carries every decision, disclosure, error, and status message with normal casing and generous line-height; visual intensity must never obscure product truth.

## Layout

The primary shell is capped at `1440px` and leaves `40px` side gutters at full width (`min(1440px, calc(100vw - 80px))`). It contracts to `24px` gutters below `1180px`, `20px` below `960px`, and `16px` below `700px`. Major sections use fluid vertical spacing (`clamp(88px, 9vw, 152px)`) and settle to `76px` on small screens. The base rhythm is the extracted 4/8/24/32/48/64/96px scale; one-pixel rules make that whitespace legible.

Desktop compositions favor editorial imbalance: paired `1.3/0.7`, `1.2/0.8`, and `1.12/0.88` grids, split image-and-copy features, and isolated full-bleed campaign rows. Product listings use three columns with `12px` gaps only after a series has been opened. The home narrative follows the pinned V2.4 order: Hero, Three Worlds, Featured Series, Create Yours, Craft, Four Promises, Stories, Community, then Newsletter/Footer.

At `960px`, navigation becomes a full-screen opaque menu and complex working layouts collapse or stack. At `700px`, full-bleed stories pin copy to the lower edge, multi-column narratives become single-column, product listings become an `82vw` horizontal snap rail, and forms and purchase actions become one column. Validate the system at `320`, `375`, `768`, `1024`, and `1440px`; long display words must wrap without horizontal overflow.

Touch targets are at least `44 × 44px`; primary controls are normally `48–50px` tall. Preserve logical heading order, semantic controls, descriptive alternative text, a skip link, contextual three-pixel focus outlines, and `scroll-margin-top` for anchored content beneath the sticky header. The mobile menu is a modal dialog: it takes initial focus, traps focus, closes on Escape, locks scroll, inerts the application shell, and restores focus to its trigger.

## Elevation & Depth

This is a flat, layered system. Obsidian, Warm Ivory, Paper, Product Field, full-bleed photography, overlays, and one-pixel rules establish depth. Shadows are exceptional and functional: the studio garment canvas receives preview lift (`0 30px 55px rgba(10, 10, 10, 0.14)`), the expanded header search uses a restrained panel shadow (`0 18px 32px rgba(10, 10, 10, 0.10)`), and the undo toast uses transient overlay lift (`0 20px 40px rgba(10, 10, 10, 0.22)`). Campaign-image shades stay flat and range from roughly `rgba(10, 10, 10, 0.34)` to `rgba(10, 10, 10, 0.56)` for legibility.

### Named Rules

**The Flat by Default Rule.** Resting surfaces are separated by tone, crop, whitespace, or a one-pixel rule; shadows are reserved for a preview plane or a transient layer that must sit above the page.

**The Opaque Overlay Rule.** Menus and dialogs use solid fields with clear boundaries; never use backdrop blur, glass, translucency-as-material, or gradients.

## Shapes

The governing shape is the square: buttons, inputs, selects, panels, product frames, story labels, search surfaces, and dialogs use zero corner radius. Images are clipped into strong rectangles with deliberate portrait, square, or cinematic aspect ratios. Borders are one pixel and structural rather than decorative.

Circles are semantic exceptions, not a softening device: customization color swatches, progress numbers, and the compact cart-count badge may be circular or pill-shaped. Do not spread those radii to cards, buttons, fields, or content containers. Arrow motion and hard image crops provide directional energy without introducing ornamental shapes.

## Components

### Buttons

Buttons are compact, squared commands with editorial-label typography and a minimum `48px` height.

- **Shape:** Sharp rectangle (`0` radius), transparent one-pixel border, `13px 20px` padding, uppercase `0.78rem`/700 label, and `0.08em` tracking.
- **Primary:** Obsidian with White text; hover reverses the accent relationship to Light Gold with Obsidian text.
- **Gold:** Light Gold with Obsidian text for the highest-energy campaign action; hover moves to White.
- **Outline / Ghost:** Obsidian outline on light fields or a translucent dark field with a visible light border over imagery; hover resolves to a solid high-contrast state.
- **Hover / Focus / Disabled:** Hover may translate `-2px` without reflow. Keyboard focus is a `3px` contextual outline with `3px` offset. Disabled controls use a quiet neutral field, explicit not-allowed cursor, and no transform.

### Inputs / Fields

Fields are quiet work surfaces: Paper background, Rule border, Obsidian values, zero radius, at least `50px` high, and `12px` internal padding. Labels sit above as small uppercase Roboto. Focus must be visible through the shared contextual outline; grouped search and newsletter inputs may instead strengthen their bottom rule. Error, disabled, and status language stays adjacent to the responsible control and cannot rely on color alone.

### Navigation

The desktop header is an opaque Obsidian bar with centered uppercase Roboto links, the supplied WE wordmark at its original geometry, and `44px` icon controls. Active and hover states draw a one-pixel Light Gold underline from right to left. Below `960px`, navigation becomes a full-screen squared dialog with indexed Bebas Neue routes, rule-separated rows, and complete modal keyboard behavior. Top-level labels remain Create, Honor, Belong, Create Yours, Stories, and About; do not introduce “Shop” or “Shop by Sport.”

### Cards / Containers

Product cards are image-first editorial objects, not generic containers. The product image uses a `1 / 1.12` field, Product Field background, no radius, no border, and no resting shadow. Metadata sits directly beneath with `18px` top spacing; price uses tabular numerals. Image hover scales the photograph inside its clipped frame (`1.035` over `500ms`) while the squared corner action changes from Obsidian to Light Gold. Story cards use the same no-chrome logic at editorial aspect ratios.

### Studio Controls

The studio is the signature working surface. A two-column bordered workspace pairs the raised square preview with an Ivory control panel, then stacks at `960px`. View controls form a square segmented group with real Front, Back, and Detail state; progress steps expose current and complete states semantically; template rows, sizes, and color swatches use visible selected states. URL parameters and browser-local draft state preserve the chosen original and size through the prototype journey.

### Disclosures, Status, and Empty States

Prototype disclosures use small Steel body text and appear near the claim or action they qualify. Success messages and confirmations use live regions without pretending that an external service completed. Empty states remain spacious, direct, and actionable, with one clear route back into originals or customization. Operational facts—price, availability, shipping, reviews, origin, and production—must come from verified data or be explicitly identified as samples.

### Motion System

All content is visible by default. The single authored reveal belongs to the featured-series moment and settles a slight scale change over `720ms` with `cubic-bezier(0.22, 1, 0.36, 1)`. Controls and color states use `180–320ms`; campaign and card images use `500–700ms` with the same decisive easing. Motion communicates hierarchy, hover, or state—never ambient spectacle. Under `prefers-reduced-motion: reduce`, smooth scrolling stops and nonessential transitions/animations collapse to `0.01ms` with one iteration.

## Do's and Don'ts

### Do:

- **Do** lead discovery with original series and their visual worlds before exposing product comparison.
- **Do** preserve the V2.4 home-module order and the two decisive first-viewport routes: Explore Originals and Create Yours.
- **Do** use the supplied WE wordmark without changing its geometry, and use the public name WE everywhere.
- **Do** use restrained gold, hard rules, tonal planes, generous space, and authored image crops to create hierarchy.
- **Do** keep keyboard, touch, reduced-motion, contrast, and 320px overflow behavior part of every component definition.
- **Do** label all demonstration values and connect operational facts only to verified sources.

### Don't:

- **Don't** use gradients, glassmorphism, backdrop blur, rounded generic card chrome, or decorative shadow stacks.
- **Don't** copy Nike, Adidas, league, team, or other sports-brand trademarks, layouts, campaigns, assets, or trade dress.
- **Don't** organize navigation around “Shop,” “Shop by Sport,” leagues, or teams.
- **Don't** turn WE Gold or collection colors into playful, saturated page washes.
- **Don't** add repeated opacity-and-rise entrances, layout-shifting hover effects, or motion that hides default content.
- **Don't** fabricate pricing, shipping thresholds, inventory, reviews, testimonials, origin, production, delivery, or performance claims.
- **Don't** collapse Create, Honor, Belong, and Create Yours into interchangeable imagery or language when approved content becomes available.
