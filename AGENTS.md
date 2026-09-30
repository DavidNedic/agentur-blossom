# Architecture rules

- Homepage sections live in `src/components/site/`, one component per section; why: focused, independently animated sections.
- All homepage copy (SR/EN) lives in `src/lib/i18n.tsx` as `{ sr, en }` pairs resolved via `useLang().t`; why: both languages stay complete and in sync.
- Motion uses GSAP + ScrollTrigger (`src/lib/motion.ts`) and desktop-only Lenis, always inside `gsap.matchMedia()` with a reduced-motion condition; why: touch and reduced-motion users retain native scrolling.
- Homepage motion is transform/opacity-only and under 700ms, except scroll-linked progress, the desktop work gallery, quiet process line, and hero parallax; why: motion remains smooth and purposeful.
- Initial hidden states are set only from JS inside motion conditions, never in markup; why: SSR and reduced motion render full content.
- Do not modify `/remotion` or its audio files.
- Founder qualification claims must remain factual: David Nedić is a German-qualified Kaufmann für E-Commerce with work and training experience in Germany; why: this is a trust credential, not promotional embellishment.
