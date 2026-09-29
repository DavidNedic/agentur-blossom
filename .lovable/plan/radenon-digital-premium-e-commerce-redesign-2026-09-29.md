# Radenon Digital Premium E-Commerce Redesign

## Goal
Rebuild the full site as an editorial, motion-led e-commerce agency experience while preserving every existing offer, project, service, pricing detail, FAQ, comparison point, contact path, and SEO requirement. Serbian and English will be equally complete.

## What will change
- Replace the current navy card-based visual language with a near-black, warm off-white, and restrained lime system.
- Remove the particle/network background, gradients, glow effects, pill labels, generic icon cards, and current carousel treatment.
- Introduce Archivo variable typography for large expanded statements and JetBrains Mono for labels and metadata.
- Recompose the homepage around a strict 12-column editorial grid with visible hairline rules and an 8px spacing rhythm.
- Rewrite presentation copy in both languages to lead with e-commerce, using short, factual statements and keeping the 199 € offer in pricing only.

## Homepage structure
1. **Preloader and navigation**: fast 000–100 reveal, compact bilingual navigation, SR/EN switch, mobile menu, and text-roll button states.
2. **Pinned kinetic hero**: “We build online stores that sell” / Serbian equivalent, masked headline entrance, layered real project screenshots, and brief 14-day proof.
3. **Velocity services marquee**: alternating outlined and solid service names tied to scroll speed.
4. **Manifesto**: scroll-scrubbed word-opacity statement focused on sales, measurement, and ownership.
5. **Selected Work**: eight-project pinned horizontal gallery on desktop and vertical image-led stack on mobile.
6. **Services**: sticky section index with seven expandable service rows and concrete deliverables.
7. **E-commerce capabilities**: stacked sticky panels for payments, cart recovery, shipping, and analytics.
8. **14-day process**: scroll-drawn vertical timeline with staged activation.
9. **Funnel, proof, and comparison**: preserve the existing funnel content, animate numeric proof, and restyle the comparison as an editorial table.
10. **Packages**: full-bleed off-white section with three clean columns and the retained 199 € starting offer.
11. **FAQ**: minimal bilingual hairline accordion.
12. **Contact and footer**: full-height scaling CTA, WhatsApp, phone, email, local clock, and the existing WhatsApp-prefilled contact form.

## Motion and performance
- Add GSAP, ScrollTrigger, and Lenis with one shared client-side animation setup.
- Use transforms, opacity, clip-path, and GSAP batching; avoid layout-thrashing scroll handlers.
- Disable pinning, parallax, scrubbing, and smooth scrolling for reduced-motion users.
- Reduce pinned effects on small screens and lazy-load all non-critical project images.
- Keep the preloader under 1.2 seconds and avoid custom cursors or continuous decorative effects.

## Preservation and boundaries
- Preserve all eight named portfolio projects and their screenshots.
- Preserve all services, shop-system details, funnel stages, comparison content, package prices, FAQ answers, phone, WhatsApp, email, and form behavior.
- Keep `/konsultacija` functional and visually aligned; the homepage remains the main redesigned experience.
- Do not modify `/remotion` or any audio files.
- Keep the existing one-page navigation behavior as requested.

## Technical details
- Build the new homepage from focused React sections and a shared bilingual content model.
- Load Archivo Variable and JetBrains Mono through document head links.
- Keep color and typography values as semantic tokens in the global stylesheet.
- Update route-level metadata with unique Serbian/English-aware copy, Open Graph fields, `og:type`, and Twitter card metadata.
- Replace raw interactive buttons with the existing design-system button where appropriate, while preserving accessible labels and keyboard behavior.
- Record the animation and localization architecture in `AGENTS.md`.

## Verification
- Check desktop and mobile layouts in the live preview.
- Test SR/EN switching, navigation, accordions, service expansion, WhatsApp links, email link, and form submission flow.
- Confirm reduced-motion rendering is static and complete.
- Check current build diagnostics, browser console, runtime errors, and responsive overflow.
