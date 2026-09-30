# Performance and award-level motion pass

## Performance first
- Convert the four active portfolio images and hero image to responsive WebP/AVIF assets capped at 1600px, preserve intrinsic dimensions, and remove inactive Instagram assets from application imports.
- Replace clip-path reveals with overflow-hidden transform reveals and keep all animation properties to transform and opacity.
- Add section rendering containment, isolate the fixed grid, remove persistent `will-change`, and refresh ScrollTrigger after fonts and images settle.
- Add Lenis with GSAP synchronization only for fine-pointer, non-touch devices without reduced-motion; preserve native scrolling everywhere else.
- Self-host and preload Latin/Latin Extended Archivo and JetBrains Mono subsets with `font-display: swap`.

## Visual and interaction upgrade
- Build a desktop pinned horizontal project gallery with a vertical mobile version, transform-only image movement, and restrained project hover states.
- Add reusable line-mask headline reveals across sections, a session-only 000–100 hero intro, proof counters, velocity skew, process progress, nav direction behavior/current section, and a top progress line.
- Add the oversized cropped RADENON footer wordmark while preserving every existing SR/EN string, price, form behavior, and page identity.

## Validation
- Check build diagnostics, console/runtime errors, keyboard and reduced-motion behavior.
- Capture desktop and mobile states, verify SR/EN, horizontal gallery behavior, image stability, overflow, and major layout shifts.

## Technical notes
- Existing user-facing content and pricing remain byte-for-byte unchanged.
- The requested counter and pinned gallery intentionally replace the previously calmer motion direction for this pass, while reduced-motion and touch devices retain static/native alternatives.
