# Architecture rules

- Homepage sections live in `src/components/site/`, one component per section; why: focused, independently animated sections.
- All homepage copy (SR/EN) lives in `src/lib/i18n.tsx` as `{ sr, en }` pairs resolved via `useLang().t`; why: both languages stay complete and in sync.
- Motion uses GSAP + ScrollTrigger (`src/lib/motion.ts`) and desktop-only Lenis, always inside `gsap.matchMedia()` with a reduced-motion condition; why: touch and reduced-motion users retain native scrolling.
- Homepage motion is transform/opacity-only and under 700ms, except scroll-linked progress, the desktop work gallery, and quiet process line; why: motion remains smooth, calm, and purposeful.
- Brand identity uses the Graphit & Cyan token system, Geologica display, Onest body, JetBrains Mono labels, and the shared pointer-first lowercase Promet logo; why: every page and state must remain visually consistent.
- Initial hidden states are set only from JS inside motion conditions, never in markup; why: SSR and reduced motion render full content.
- Do not modify `/remotion` or its audio files.
- Founder qualification claims must remain factual: David Nedić is a German-qualified Kaufmann für E-Commerce with work and training experience in Germany; why: this is a trust credential, not promotional embellishment.
- The homepage "/" renders only the "Radni sto" desk from `src/components/desk/` (CSS scoped under `.desk-root`, browser code inside effects); old `src/components/site/` sections are kept but not rendered; why: the desk is a self-contained full-screen experience.
