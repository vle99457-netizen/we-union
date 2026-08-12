---
name: frontend-design
description: Design and implement polished, responsive frontend experiences for websites, pages, components, and small web apps. Use when a request involves new UI work or substantial visual refinement.
---

# Frontend design

Create production-ready interfaces that fit the product context and feel intentionally art-directed.

## Before implementation

- Inspect the existing stack, routes, components, styles, assets, and repository conventions.
- Identify the audience, primary task, content hierarchy, and technical constraints.
- Preserve an established design system when one exists.
- Choose one clear visual direction before coding. Define its typography, palette, spacing rhythm, surface treatment, and interaction character.
- When requirements are incomplete, make small, reversible assumptions and record them in the handoff.

## Implementation standards

- Use semantic structure and accessible controls.
- Treat narrow and wide viewports as first-class layouts.
- Establish reusable design tokens for color, type, spacing, borders, radii, shadows, and motion.
- Use typography deliberately: create clear hierarchy, comfortable measure, and consistent vertical rhythm.
- Use motion only when it clarifies state or reinforces the chosen direction. Respect reduced-motion preferences.
- Complete interaction states, including hover, focus, active, disabled, empty, loading, success, and error states when relevant.
- Prefer real product copy and representative data over filler text.
- Follow the repository's framework and dependency conventions. Do not replace working infrastructure without a concrete reason.
- Keep components cohesive and reusable without fragmenting simple markup into unnecessary abstractions.

## Avoid generic output

- Do not fall back to an interchangeable starter-template appearance.
- Avoid decorative effects that have no relationship to the product, including arbitrary gradients, glows, glass panels, and excessive card grids.
- Prefer a small number of strong, consistent decisions over many unrelated visual flourishes.
- Make the composition recognizable through proportion, rhythm, typography, imagery, or interaction—not through clutter.

## Verification

- Run the repository's available checks and tests.
- Review the result at both narrow and wide viewport sizes.
- Check keyboard navigation, visible focus, readable contrast, and reduced-motion behavior.
- Confirm that important content and controls remain usable in loading, empty, and error conditions when those states exist.
- Report the files changed, checks run, and any remaining caveats.

## Handoff

Deliver working code that is proportional to the request. Briefly explain the visual direction and any assumptions that a maintainer should know.
