# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** WE
**Generated:** 2026-08-11 19:32:23
**Category:** E-commerce Luxury
**Design Dials:** Variance 8/10 (Bold / Asymmetric) | Motion 6/10 (Standard) | Density 3/10 (Spacious)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Obsidian | `#0A0A0A` | `--obsidian` |
| Black | `#111111` | `--black` |
| Warm Ivory | `#F7F4ED` | `--ivory` |
| Paper | `#FFFDF8` | `--paper` |
| WE Gold | `#9A7442` | `--gold` |
| Functional Gold | `#76552D` | `--gold-ink` |
| Light Gold | `#C5A879` | `--gold-light` |
| Steel | `#666666` | `--steel` |
| Rule | `#D8D8D4` | `--line` |
| Water Cobalt | `#174A8B` | `--blue` |

**Color Notes:** Locked to the V2.4 WE palette. Brand gold is a restrained signal, not a background wash. Small gold text on light surfaces uses `--gold-ink`; focus rings use Obsidian on light surfaces and Warm Ivory on dark surfaces.

### Typography

- **Heading Font:** Bebas Neue
- **Body Font:** Roboto
- **Mood:** athletic, decisive, premium, editorial, crafted
- **Delivery:** Self-hosted WOFF2 subsets, with Noto Sans CJK SC as the declared CJK fallback.

**CSS loading:**
```css
@font-face {
  font-family: 'Bebas Neue';
  font-display: swap;
  font-weight: 400;
  src: url('/fonts/bebas-neue-latin-400-normal.woff2') format('woff2');
}
```

### Spacing Variables

*Density: 3/10 — Spacious*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `24px` / `1.5rem` | Standard padding |
| `--space-lg` | `32px` / `2rem` | Section padding |
| `--space-xl` | `48px` / `3rem` | Large gaps |
| `--space-2xl` | `64px` / `4rem` | Section margins |
| `--space-3xl` | `96px` / `6rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| Hairline | `1px solid #D8D8D4` | Default separation; preferred over shadows |
| Preview lift | `0 30px 55px rgba(10,10,10,0.14)` | Studio garment canvas only |
| Overlay shade | `rgba(10,10,10,0.34–0.56)` | Legibility over campaign photography |

---

## Component Specs

### Buttons

```css
.button {
  min-height: 48px;
  padding: 13px 20px;
  border: 1px solid transparent;
  border-radius: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 180ms ease, background-color 180ms ease,
    border-color 180ms ease, transform 180ms ease;
}
```

### Cards

```css
.product-card { background: transparent; }
.product-card__image {
  aspect-ratio: 1 / 1.12;
  overflow: hidden;
  background: #E9E7DF;
}
.product-card__meta { border-top: 0; padding-top: 18px; }
```

Cards are image-first editorial objects. Do not add rounded containers, decorative shadows, or generic padding shells.

### Inputs

```css
.input {
  min-height: 48px;
  padding: 12px 14px;
  color: #0A0A0A;
  border: 1px solid #D8D8D4;
  border-radius: 0;
  background: #FFFDF8;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus-visible {
  border-color: #0A0A0A;
  outline: 3px solid #0A0A0A;
  outline-offset: 3px;
}
```

### Modals

```css
.mobile-menu {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  color: #FFFFFF;
  background: #0A0A0A;
}
```

Dialogs and overlays are opaque, squared, focus-trapped, Escape-closeable, and paired with an inert application shell. Do not use glass or blur effects.

---

## Style Guidelines

**Style:** Editorial performance minimalism

**Keywords:** athletic campaign photography, high contrast, oversized display type, asymmetry, restrained gold, precise rules, immersive series worlds

**Best For:** Premium custom sportswear, collection storytelling, direct-to-consumer commerce, team customization

**Key Effects:** Sharp geometry, 180-280ms transitions, one orchestrated reveal moment, full-bleed photography, and quiet functional UI

### Page Pattern

**Pattern Name:** Series-first editorial commerce

- **CTA Placement:** Two decisive routes above the fold: explore originals and create yours.
- **Home order:** Hero > Three Worlds > Featured Series > Create Yours > Craft > Four Promises > Stories > Community > Newsletter/Footer.
- **Commerce rule:** A series is experienced before priced product cards appear.

---

## Motion

**One authored reveal** — Trigger: the featured series entering view | Duration: 720ms | Easing: `cubic-bezier(0.22, 1, 0.36, 1)`

```tsx
<motion.div
  initial={reduceMotion ? false : { scale: 0.992 }}
  whileInView={reduceMotion ? undefined : { scale: 1 }}
  viewport={{ once: true, amount: 0.3 }}
/>
```

All content remains visible by default. State transitions and hover affordances use 180–320ms transforms/colors. `prefers-reduced-motion` removes nonessential motion.

---

## Anti-Patterns (Do NOT Use)

- ❌ Vibrant & Block-based
- ❌ Playful colors
- ❌ Gradients and glassmorphism
- ❌ Rounded generic card chrome
- ❌ Repeated opacity-and-rise entrances

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use the established Phosphor icon set
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from the Phosphor set
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 320px, 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
