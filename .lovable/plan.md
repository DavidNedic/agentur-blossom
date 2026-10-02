# Potpis homepage section

## Changes
- Add a new bilingual “Potpis / Signature” section directly after Manifesto and before GermanStandard.
- Present the supplied headline, introduction, three-step sequence, five industry examples, closing line, and existing consultation CTA without changing other homepage content.
- Use the existing 12-column editorial grid, hairlines, typography, spacing, semantic Graphit & Cyan tokens, and shared button style.
- Keep examples as a simple two-column table on desktop and a readable stacked list on mobile, with no cards or icons.
- On pointer-hover desktop only, reveal a small shared Promet pointer mark and turn the signature text cyan. Keep the static mobile and reduced-motion presentation fully visible.
- Skip a navigation link because the existing desktop navigation is already full.

## Technical details
- Create one focused section component under the existing homepage section directory.
- Add all Serbian and English copy to the shared localization dictionary.
- Mount the section in the homepage route at the requested position.
- Reuse the shared `Logo` mark by adding a mark-only display option without changing current logo callers or visuals.
- Keep interaction CSS token-based and limited to color/opacity/transform transitions.

## Verification
- Confirm Serbian and English copy, CTA target, desktop hover state, mobile layout, and reduced-motion behavior.
- Check homepage ordering, responsive overflow, console errors, and the latest preview build.
