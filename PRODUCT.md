# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated by the brief: React, TypeScript, Vite, React Router, and CSS design tokens. React is required to use the requested React Bits interaction patterns. The repository contains no existing application or backend.

## Users

- US consumers looking for original sportswear with personal meaning.
- Gift buyers who need a guided way to choose names, numbers, colors, and details.
- Sports and streetwear buyers evaluating fit, fabric, construction, and styling.
- Team and group organizers coordinating names, numbers, sizes, quantity, and delivery.
- Returning customers retrieving saved designs, reordering, and tracking production.

## Product Purpose

WE helps customers discover original sportswear collections, personalize a selected design, review the exact specification, order it, and follow its production and delivery. Success means that a first-time visitor understands the brand within ten seconds and can move from discovery to a confident purchase or customization without support intervention.

## Positioning

WE begins with an original garment and makes personal details part of the design itself. It is not a blank-product marketplace or a reseller organized around leagues and teams.

## Operating Context

- Collection discovery begins with a series and its visual world, then moves to a filterable product list.
- Direct-purchase and customizable products share the catalog but expose different actions.
- Customization follows Choose, Personalize, Review, and Order & Track.
- Team orders add roster, size, quantity, artwork, proof, and quote workflows.
- Customers may save and share designs, revisit orders, and track production and delivery.

## Capabilities and Constraints

- The public site includes Home, Collections, Worlds, Products, Create Yours, Stories, Community, About, Craftsmanship, Support, Account, Cart, Checkout, Search, and policy routes.
- Top-level navigation must not contain SHOP or SHOP BY SPORT.
- All visible brand references must use WE.
- Collection discovery uses one immersive full-width series feature per row. Product cards appear only after a series is opened.
- The home page contains nine modules in the locked order defined by the V2.4 requirements.
- Customization begins as a high-quality 2D, multi-view experience. Real-time 3D cloth simulation is out of scope for the first release.
- Pricing, shipping, inventory, reviews, origin, production, and claims must not be fabricated. Demonstration values must be labeled as sample data.
- The current repository has no existing routes, business logic, APIs, CMS, commerce provider, or backend.

## Brand Commitments

- Public brand name: WE.
- Brand line: GEAR MADE PERSONAL.
- Brand pillars: ORIGINAL, PERSONAL, CRAFTED, MEANINGFUL, TRACEABLE.
- Primary visual reference: premium American sportswear and editorial commerce, with the craft level of leading US sports brands but no copied trademarks, layouts, campaign assets, or trade dress.
- Typography: Bebas Neue for English display headings; Roboto for body and functional UI; Noto Sans CJK SC as the Chinese fallback.
- Core colors from the requirements: Obsidian `#0A0A0A`, Warm Ivory `#F7F4ED`, WE Gold `#9A7442`, Steel Gray `#666666` and `#D8D8D4`.
- Use the supplied WE wordmark without changing its geometry.
- Product and story content must be original or licensed. Do not use league or team intellectual property as the organizing system.

## Evidence on Hand

- `../requirements_extracted.md`: extracted V2.4 product, UX, content, technical, and acceptance requirements.
- `../requirements_media/media/image1.png`: supplied WE wordmark preview.
- `../requirements_media/media/image2.png` through `image22.png/jpeg`: supplied visual references for the 19 core page templates.
- No verified customer testimonials, sales metrics, inventory feed, shipping threshold, payment provider, or production API is present. The implementation must not invent these as facts.

## Product Principles

1. Meaning before merchandise, with a clear next action in every brand module.
2. Original series first, product comparison second.
3. Personalization is part of the product design, not an afterthought.
4. Quality and fulfillment claims must be demonstrated with traceable evidence.
5. Mobile purchasing and customization must remain clear, touch-friendly, and recoverable.

## Accessibility & Inclusion

- Target WCAG 2.2 AA.
- Full keyboard navigation, visible focus, descriptive alternative text, semantic controls, and logical headings.
- Minimum 44 by 44 pixel touch targets.
- Motion must respect `prefers-reduced-motion`.
- Layout must remain usable at 320, 375, 768, 1024, and 1440 pixel widths.
