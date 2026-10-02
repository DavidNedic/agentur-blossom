# Retail camera canvas redraw

## Build
- Replace only the small systems-panel camera renderer with top-down person glyphs, corner tracking brackets, IDs, trails, and simple shelf outlines.
- Replace only the large systems-sheet camera renderer with the supplied retail floor plan, discrete heat cells, tracked people, dwell times, count line, live clock, and existing HUD.
- Pause each animation when inactive, render one static frame for reduced motion, and scale both canvases for device pixel ratio.
- Adjust only the store canvas height and camera overlay label styling requested.

## Verification
- Open the systems panel and sheet at desktop and 390px widths.
- Confirm the camera graphics, live overlay/HUD, sizing, reduced-motion behavior, and absence of console errors.
