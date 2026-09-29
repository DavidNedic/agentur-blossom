# Architecture rules

- Homepage sections live in `src/components/site/`, one component per section; why: focused, independently animated sections.
- All homepage copy (SR/EN) lives in `src/lib/i18n.tsx` as `{ sr, en }` pairs resolved via `useLang().t`; why: both languages stay complete and in sync.
- Motion uses GSAP + ScrollTrigger (`src/lib/motion.ts`) with native scrolling, always inside `gsap.matchMedia()` with a reduced-motion condition; why: restrained one-time motion stays accessible and predictable.
- Homepage motion is one-time and under 700ms, except the quiet process-line scrub and hero parallax capped at 40px; why: the consultancy presentation should feel calm and professional.
- Initial hidden states are set only from JS inside motion conditions, never in markup; why: SSR and reduced motion render full content.
- Do not modify `/remotion` or its audio files.
