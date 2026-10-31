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
- Touch orientation requires a user-gesture permission where necessary and uses a calibrated baseline; a shared Matter.js fixed-step world drives individual DOM objects and 3D prop footprints with mass, resistance, angular collision response and bounded edges, paused during intro, dialogs, reduced motion and hidden tabs. Mobile 3D coordinates use desk height to stay scroll-anchored.
- Office WebGL resources and animation frames must be disposed with their effect, and resize must only reposition props when desk dimensions change; why: remounts and mobile browser chrome must not exhaust graphics contexts or reset physics positions. Prop movement belongs to the physics holder, not an independent model sway animation.
- Booking: slot rules live in pure `src/lib/booking-slots.ts` (tested); server-only integrations (Google free/busy, Zoom, Lovable managed email) in `src/server/booking.server.ts`, exposed via `src/lib/booking.functions.ts`; a partial unique index on `bookings.starts_at` prevents double booking; why: one source of truth for availability and race-safe inserts.
- Booking email templates use React Email and the managed server-only send helper with event-derived idempotency keys; calendar files are token-protected downloads, not attachments; why: managed sending supports rendered templates and links, not file attachments.
- Admin access is `has_role(uid,'admin')` from `user_roles`, auto-granted only to the owner email by an auth trigger; why: roles never come from client data.
- Let HTML parsing dependencies resolve their own `entities` versions and package exports without global aliases or overrides; why: old and new parsers require different subpaths and incompatible major versions.
- All meeting CTAs use the native planner through the sheet navigation callback; why: visitors follow one date-and-details booking path rather than switching to WhatsApp, which remains a contact fallback.
- Desk language is owned by the shared desk language provider, with a Serbian/German dictionary and the same preference used by the planner and office copy; why: changing language must not remount physics or lose booking details.
