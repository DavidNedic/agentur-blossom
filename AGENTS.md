# Architecture rules

- Homepage sections live in `src/components/site/`, one component per section; why: focused, independently animated sections.
- All homepage copy (SR/EN) lives in `src/lib/i18n.tsx` as `{ sr, en }` pairs resolved via `useLang().t`; why: both languages stay complete and in sync.
- Motion uses GSAP + ScrollTrigger (`src/lib/motion.ts`) and subtle Lenis smoothing, always inside `gsap.matchMedia()` with a reduced-motion condition; why: reduced-motion users get static, complete content and cleanup is automatic.
- Initial hidden states are set only from JS inside motion conditions, never in markup; why: SSR and reduced motion render full content.
- Do not modify `/remotion` or its audio files.
- The homepage uses a light consultancy system with Schibsted Grotesk and Geist Mono; dark surfaces are reserved for the case index and contact footer, and lime only signals live, success, sold, or primary actions.
