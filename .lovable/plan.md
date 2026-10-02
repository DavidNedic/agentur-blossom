# Promet rebrand

## Changes
- Replace every visitor-facing Klik brand reference with Promet across both languages, metadata, consultation messaging, navigation, comparison content, and copyright.
- Replace the shared logo SVG with the supplied pointer-first Promet lockup while preserving its color API and existing placements.
- Keep ordinary Serbian uses of “klik/klikovi” unchanged where they mean a click rather than the brand.
- Preserve favicon, contact details, URLs, internal compatibility keys, backend identifiers, colors, layout, behavior, and `/remotion`.

## Verification
- Audit source for remaining `klik` and `radenon`, classifying protected or ordinary-language occurrences.
- Check homepage and consultation page metadata, visible content, header sizing, footer fit, mobile layout, and console errors.
- Confirm the latest preview build succeeds.

## Technical details
- Update the existing TanStack route `head()` metadata rather than introducing another head-management method.
- Keep the existing `Logo` component signature and semantic token-based colors.
