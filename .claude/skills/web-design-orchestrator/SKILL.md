---
name: web-design-orchestrator
description: V2 enterprise website orchestrator for premium US-facing corporate, brand, ecommerce, and marketing websites. Coordinates coding discipline, design-system generation, art direction, motion, implementation, polish, accessibility, responsive UX, and React/Next.js performance using the installed skill stack.
metadata:
  version: "2.0.0"
  market: "US"
  mode: "enterprise-website"
---

# Web Design Orchestrator V2

Build enterprise websites as a coordinated production workflow, not as a pile of competing design prompts. The brief, brand truth, user task, accessibility, performance, and existing product behavior always outrank a skill's stylistic preference.

## Installed V2 stack

Use these skills in this order when relevant:

1. `karpathy-guidelines`
2. `ui-ux-pro-max`
3. `frontend-design`
4. `design-taste-frontend`
5. `reactbits-ui-skills` (React-compatible projects only, selectively)
6. `impeccable`
7. `web-design-guidelines`
8. `vercel-react-best-practices` (React/Next.js only)

Do not force every skill onto every task. Use the smallest set that covers the requested outcome, but use the full stack for a major enterprise website build or redesign.

## Phase 0 - Understand the business before touching UI

Before editing code, establish:

- Company / brand and what it sells.
- Primary US audience and the buyer's decision context.
- The single primary conversion goal: purchase, inquiry, demo, quote, booking, signup, or store visit.
- Existing routes, CMS/backend behavior, analytics hooks, forms, legal copy, SEO-sensitive URLs, and integrations that must survive the redesign.
- Brand assets that are real and approved: logo, colors, photography, product imagery, type, claims, certifications, customer logos, testimonials.

Never invent customer names, performance numbers, certifications, awards, partner logos, product claims, legal promises, or testimonials to make the design look credible.

## Phase 1 - Karpathy engineering discipline

Apply `karpathy-guidelines` throughout the job:

- State assumptions instead of silently guessing.
- Prefer the simplest implementation that satisfies the brief.
- Make surgical changes; do not refactor unrelated working code.
- Preserve existing conventions unless there is a concrete reason to change them.
- Define verifiable success criteria before large edits.
- Every changed line should trace to the requested website outcome.

For a redesign, inspect the current project before proposing a replacement architecture.

## Phase 2 - US enterprise information architecture

For US-facing corporate/brand sites, default to fast comprehension and visible trust rather than information density.

### Homepage hierarchy

Use the business context to choose the final sections, but a strong default sequence is:

1. **Navigation** - concise, predictable labels, one obvious primary CTA.
2. **Hero** - what the company offers, who it is for, why it matters, and a clear next action in the first viewport.
3. **Trust / proof** - real customers, press, certifications, review evidence, distribution footprint, or measurable proof only when verified.
4. **Core offerings / capabilities** - explain what users can buy or accomplish without a wall of equal cards.
5. **Differentiation** - materials, technology, process, service model, craftsmanship, customization, logistics, or other real advantages.
6. **Case studies / work / product proof** - show evidence rather than generic marketing copy.
7. **How it works** - only if the purchase or engagement process genuinely needs explanation.
8. **Testimonials / social proof** - real and attributable.
9. **Conversion section** - repeat the primary action with context, not just a floating button.
10. **Footer** - useful navigation, support/contact information, policies, legal, social, and business information as applicable.

Do not treat this sequence as a mandatory template. `frontend-design` and `design-taste-frontend` should vary the composition so the page feels specific to the company.

### US browsing conventions

- Lead with the value proposition, not a long company introduction.
- Use American English for US-targeted public copy unless the brief says otherwise.
- Keep top-level navigation concise; move secondary destinations into grouped menus when needed.
- Use short scan-friendly headings and concrete verbs.
- Make pricing, quote, contact, demo, store, or purchase actions easy to find when they are real business goals.
- Prefer real photography, product imagery, people, places, process, and evidence over decorative mock UI.
- Give case studies, reviews, guarantees, support, shipping/service expectations, and policies appropriate visibility when they affect purchase confidence.
- Avoid dense text walls, excessive badges, stacked announcements, and repetitive feature-card grids.

## Phase 3 - Generate the design system with UI UX Pro Max

Use `ui-ux-pro-max` before major visual implementation to establish:

- Page pattern and section rhythm.
- Typography hierarchy and font pairing.
- Brand-compatible color system and one controlled accent strategy.
- Grid, container widths, spacing scale, radii, border, shadow, and elevation logic.
- Button, form, navigation, card, media, and feedback-state behavior.
- Accessibility requirements and responsive rules.
- Stack-specific guidance for the existing project.

For premium US enterprise/brand websites, favor confident typography, editorial spacing, strong imagery, and clear conversion hierarchy over ornamental UI density.

## Phase 4 - Establish original art direction with Anthropic frontend-design

Use `frontend-design` as the primary creative design lead for the page world.

It should define a visual direction that belongs to this brand, including:

- A hero that acts as the page thesis.
- Deliberate typography, not generic defaults.
- Composition that is not a sequence of identical centered sections.
- A recognizable image/material/graphic language connected to the company's real product or category.
- One defensible aesthetic risk when appropriate.
- Motion used as storytelling, hierarchy, or feedback rather than decoration.

Do not clone another company's website pixel-for-pixel. References such as Nike, Apple, Patagonia, Stripe, or similar brands are for principles, pacing, hierarchy, photography, and interaction quality, not copyrighted layouts or brand assets.

## Phase 5 - Apply Taste Skill as the anti-template pass

Use `design-taste-frontend` after the design direction is clear to remove generic AI patterns and strengthen:

- Layout variance.
- Typography character.
- Visual hierarchy.
- Section-to-section rhythm.
- Brand-specific imagery and materiality.
- Motion calibration.
- Copy density and CTA discipline.

Do not let Taste Skill override real brand colors, legal copy, information architecture, accessibility, or verified business content.

## Phase 6 - Motion and React Bits

Use `reactbits-ui-skills` only when the project is React-compatible and a React Bits component clearly improves comprehension, delight, or brand expression.

### Motion budget

Prefer **1-3 signature motion ideas per page** rather than animating everything. Good enterprise-site uses include:

- Hero text/media reveal.
- Product/material detail interaction.
- One scroll-led storytelling section.
- Logo/customer proof movement when it improves scanning.
- Tactile CTA, navigation, gallery, or card feedback.

Avoid motion that:

- Delays access to content.
- Hijacks basic navigation without a strong reason.
- Repeats on every card or heading.
- Causes layout shift or jank.
- Depends on hover for essential meaning.
- Ignores `prefers-reduced-motion`.

Before adding React Bits, verify the component's dependencies, bundle impact, responsive behavior, keyboard/touch behavior, reduced-motion fallback, and compatibility with the project's framework version.

## Phase 7 - Implementation rules

Build with the project's existing stack unless a migration was explicitly requested.

Preserve unless the user explicitly approves change:

- Route slugs and deep links.
- Backend/API contracts.
- Checkout, account, search, form, CMS, analytics, and tracking behavior.
- Form field names required by integrations.
- Existing SEO metadata and structured data that are still valid.
- Legal, privacy, consent, warranty, compliance, and policy language.
- Approved logo/wordmark details.

Implementation standards:

- Semantic HTML and clear heading order.
- Mobile-first responsive behavior with deliberate layout changes, not desktop scaled down.
- Touch targets and controls usable on phones.
- Visible keyboard focus.
- Explicit loading, empty, error, and success states where applicable.
- Images have appropriate dimensions, responsive sources, alt text, and loading strategy.
- No new dependency unless it creates clear value and the existing stack cannot solve the need cleanly.

## Phase 8 - Impeccable quality pass

After the main implementation works, use `impeccable` in bounded passes:

1. **critique / audit** - identify hierarchy, UX, accessibility, responsive, design-system, and anti-pattern problems.
2. **distill / layout / typeset** as needed - remove clutter and improve rhythm.
3. **polish** - final visual consistency and interaction finish.
4. **harden** - edge cases, forms, errors, i18n, content overflow, and production states.
5. **optimize** - only when performance problems are identified.

Do not endlessly polish. Fix the highest-impact issues, verify once, then ship.

## Phase 9 - Final dual audit

### Web interface audit

Run `web-design-guidelines` across changed UI files. Resolve important findings covering:

- Accessibility and semantics.
- Keyboard/focus states.
- Navigation and forms.
- Responsive behavior.
- Touch interactions.
- Typography and images.
- Motion and reduced-motion behavior.
- State and URL behavior.

### React / Next.js performance audit

If the project uses React or Next.js, run `vercel-react-best-practices` on the changed implementation. Prioritize:

- Avoiding unnecessary async waterfalls.
- Bundle-size discipline.
- Server/client boundary efficiency.
- Data-fetching patterns.
- Avoiding unnecessary re-renders.
- Rendering and JavaScript performance.

Visual effects never outrank loading speed, interaction responsiveness, or stability.

## Enterprise quality gates

Do not declare a major corporate-site task complete until these are true:

### Brand and visual quality

- The page looks specific to the company, not like a generic AI template.
- Typography, imagery, color, spacing, and motion form one coherent design language.
- Real product/company evidence is doing more work than decorative UI.
- Desktop and mobile compositions both feel intentionally designed.

### US-market conversion

- A first-time visitor can understand the company's offer quickly.
- The primary CTA is obvious without being repeated mechanically everywhere.
- Trust evidence appears before a high-commitment conversion when available.
- Important purchase/inquiry concerns are surfaced rather than hidden.
- Copy is concise, concrete, and natural for the intended US audience.

### Accessibility and interaction

- Keyboard navigation and focus are usable.
- Text and controls have adequate contrast.
- Essential interactions do not rely only on hover.
- Reduced-motion users receive a complete experience.
- Forms communicate labels, errors, and success clearly.

### Performance

- No obviously unnecessary library or effect has been added.
- Hero media is optimized and does not create avoidable layout shift.
- Heavy animation or 3D code is isolated/lazy-loaded when appropriate.
- Final React/Next.js changes pass the relevant Vercel performance review.

### Integrity

- No fake testimonials, customer logos, certifications, metrics, awards, prices, or claims.
- No silent changes to routes, analytics hooks, backend logic, policies, or legal copy.
- Every meaningful change maps back to the business goal or quality gate.

## Conflict-resolution order

When installed skills disagree, resolve conflicts in this order:

1. User's explicit requirements and approved brand assets.
2. Legal, accessibility, security, data, and functional constraints.
3. Existing working product behavior and integration contracts.
4. User task and conversion clarity.
5. Performance and maintainability.
6. Design-system consistency.
7. Art direction and motion preference.

Aesthetic novelty is last, not first.

## Recommended invocation

For a full enterprise website build or redesign:

`Use web-design-orchestrator. Apply the full V2 enterprise website workflow for a premium US-facing corporate website. Preserve working functionality and verified business content, establish the design system, create distinctive art direction, use motion selectively, then complete Impeccable, Vercel web-interface, and React/Next.js performance audits before delivery.`
