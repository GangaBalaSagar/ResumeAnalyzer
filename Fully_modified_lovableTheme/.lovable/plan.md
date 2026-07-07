
# The Archivist — Design Strategy for Resume Analyzer Pro

Repository analyzed: the uploaded ZIP is your real MERN app (`client/` React 18 + Vite + React Router v6 + Chart.js, `server/` Express + Mongoose + Supabase JWT + Gemini). I read `Project_Overview.md` end-to-end and cross-checked it against the actual files. Documentation matches implementation with one nuance: `AppRoutes.jsx` only guards `/app/dashboard` and `/app/account` with `ProtectedRoute` — `Analyze`, `History`, and `Report` are reachable without the guard and rely on the axios 401 interceptor + `AuthModalContext` to gate access. I will respect that behavior.

Nothing in `server/`, `routes/`, `controllers/`, `models/`, `middleware/`, `services/gemini*`, `api.jsx`, `AuthContext`, `AuthModalContext`, `ReportContext`, `useApiAuth`, or `AppRoutes.jsx` will change. Only presentational layers (CSS, layouts, page shells, component chrome, motion) are in scope.

## Route & surface inventory (redesign targets only)

Public: `/` Landing, `/features`, `/faq`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/preview`.
App: `/app/dashboard`, `/app/analyze`, `/app/history`, `/app/report`, `/app/account`.
Shared: `Navbar`, `PublicLayout`, `AppLayout`, `AuthGate`, `ConfirmationModal`, `ErrorBoundary`, auth modal, results panels (`ScoreCard`, `ChartsSection`, `SkillsSection`, `SuggestionsSection`), history list/items, landing sections, FAQ blocks.

Existing UI strengths: clean component decomposition, context-driven flows, Chart.js already wired.
Existing inconsistencies: glassmorphism-heavy dark theme, generic SaaS gradients, spinner-based loading, flat cards, no visual identity tying pages together.

---

## 1. Creative direction — "The Archivist"

The product is reframed as a **master archivist's desk**. Every resume is a document being received, catalogued, examined under warm lamplight, stamped, annotated, and filed. Vintage stationery + museum conservation + modern SaaS clarity. No skeuomorphic overload — the paper metaphor is expressed through **materials, lighting, typography, and motion**, not decorative textures pasted on top of a normal dashboard.

Three non-negotiable rules that keep it modern:
- Whitespace-first. Editorial margins. Never crowd the page with props.
- One accent color at a time per screen. Brass is precious, not decorative.
- Motion is diegetic — things move like paper and ink, never like a website.

---

## 2. Color palette (semantic tokens, defined once in `client/src/styles.css`)

Warm off-white paper base, deep ink foreground, oxblood + brass as the only saturated accents. Ships as CSS variables so components stay token-only.

- `--paper-cream` #F4EEE1 — page background
- `--paper-sheet` #FBF6EA — elevated document surface
- `--paper-aged` #E8DEC6 — recessed / archival surface
- `--ink-primary` #1B1712 — body text, headings
- `--ink-muted` #5B4E3C — secondary text, metadata
- `--rule-line` #C8B896 — hairlines, dividers, table rules
- `--brass-500` #B08636 — primary accent (seals, key numbers, primary CTA)
- `--brass-300` #D9B876 — hover / highlight of brass
- `--oxblood-600` #7A2E2B — destructive, warnings, "rejected" stamp
- `--forest-700` #2F4A3A — success, "approved" stamp, positive delta
- `--ivory-glow` rgba(255,244,214,0.55) — lamplight gradient overlay

Dark mode is deferred (project ships fixed-light archival). ATS chart palette: brass gradient for match, muted ink hatch for gap.

---

## 3. Typography system

Three families, all self-hosted via `<link>` in `index.html`:

- **Display serif** — *Cormorant Garamond* (600 / 700) — page titles, score numeral, hero headline. Optical sizing on.
- **Editorial serif** — *Fraunces* (400 / 500 / italic) — long-form body, report prose, JD preview. Enables `opsz` + `SOFT` for warmth.
- **Utility sans** — *Inter Tight* (400 / 500 / 600) — UI chrome, buttons, table headers, form labels, small caps eyebrows.
- **Numeric monospace** — *JetBrains Mono* (500) — timestamps, IDs, file sizes.

Scale (rem, 1.250 major-third): 0.75 / 0.875 / 1 / 1.125 / 1.375 / 1.75 / 2.25 / 3 / 4.
Eyebrows: Inter Tight, 11px, `letter-spacing: 0.22em`, uppercase, ink-muted.
Body: Fraunces 17/28. Line length capped at 68ch on report/JD surfaces.

---

## 4. Spacing, grid, radius

- 8pt base spacing scale. Editorial padding on document surfaces (min 40px inline).
- 12-column grid on desktop, 4-column on mobile, 88px max gutter.
- Radii: `--r-sheet: 2px` (paper is barely rounded), `--r-chip: 999px` (skill chips), `--r-seal: 50%` (stamps). No 16px "card" radii anywhere.
- Elevation via layered paper shadows, never blur:
  - `--shadow-sheet: 0 1px 0 rgba(27,23,18,.04), 0 2px 6px rgba(27,23,18,.06), 0 24px 40px -28px rgba(27,23,18,.35)`
  - `--shadow-lift` (hover) increases the third layer only.

---

## 5. Component language

- **Sheet** — the fundamental surface. Cream paper, 1px `--rule-line` border, corner grain, subtle deckled edge on top-right (dog-ear utility). Replaces every `.card` / glass panel.
- **Envelope** — analyze upload area. Rendered as an opening manila envelope with a wax-seal drop target. Empty state shows the flap open.
- **Stamp** — circular brass seal used for score badges, "Analyzed", "Reviewed on {date}", destructive confirmation. SVG + slight rotation, printed opacity 0.85.
- **Tag / Marginalia** — Fraunces-italic ink annotations in the outer margin of the report (matched/missing skill callouts).
- **Ledger row** — history table row styled like a bound ledger line with ruled underline and monospace date column.
- **Ribbon bookmark** — active-nav indicator on the sidebar/header.
- **Wax button** — primary CTA: brass fill, ink text, pressed-in shadow on active.
- **Ink link** — underline drawn with hand-inked SVG stroke on hover.
- **Chip** — skill chips as small paper labels with a punched-hole dot.
- **Chart wrapper** — Chart.js retained; wrapper restyles palette, tooltip, and legend to archival tokens. No library swap.

Icons: `lucide-react` at 1.25px stroke, but critical seals/stamps use custom SVGs shipped under `client/src/assets/seals/`.

---

## 6. Animation language (Framer Motion — added client-only)

All motion respects `prefers-reduced-motion`.

- **Page enter**: 400ms paper-slide-up + 2° subtle unfold, `cubic-bezier(.2,.7,.2,1)`.
- **Hover lift**: 180ms translateY(-2px) + shadow expansion. No scale.
- **Stamp**: spring press-in with 40ms ink-splatter mask reveal.
- **Envelope open**: flap rotates on Y, page slides out on upload.
- **Report reveal**: sequential section fade with ruled-line draw (`stroke-dashoffset`).
- **Analyzing sequence** replaces the spinner with a 7-step cinematic loader mapped to the real request lifecycle:
  1. *Document received* (envelope closes)
  2. *Scanning pages* (loupe traverses lines)
  3. *Reading content* (text underlines animate)
  4. *Comparing with job description* (two sheets overlay)
  5. *Evaluating ATS compatibility* (stamp descends)
  6. *Generating recommendations* (ink writes marginalia)
  7. *Preparing final report* (report binds shut)
  Steps advance on real progress signals (`onUploadProgress` for step 1, request in-flight for 2–6, response for 7). No fake timers driving business state.

---

## 7. Landing page — cinematic 3D storytelling

Hero: a slow parallax stack of three resume sheets under a warm lamp. Mouse move → sheets drift on independent Z axes; scroll → the top sheet lifts, a brass loupe glides across, a stamp descends with the CTA. Built with Framer Motion + CSS transforms (no WebGL to keep the bundle lean and SSR-safe). Optional dust particle canvas (~60 particles, 12 KB) toggleable via reduced-motion.

Section sequence: Hero → Trust bar (as printed press marks) → Product intro (opened folio) → How it helps (three archival plates) → Capabilities (index-card grid) → Simple process (numbered ledger) → Benefits (marginalia list) → Final CTA (wax-seal button). Every existing landing component keeps its data source (`data/landing.js`) — only presentation swaps.

---

## 8. Page-by-page treatment

- **Landing / Features / FAQ**: editorial magazine layout on cream; FAQ as accordion with ruled hairlines and italic answers.
- **Auth (Login/Signup/Forgot/Reset)**: centered "membership card" sheet with brass corners; forms use ruled underlines instead of boxed inputs.
- **AppLayout**: left-rail ribbon nav with brass active bookmark; header shows a small brass monogram + username in Fraunces italic.
- **Dashboard**: "The Reading Room". Three archival plates — Total analyses (ledger count), Average ATS (brass dial), Latest analysis (folded document preview). Quick actions as wax-seal buttons.
- **Analyze**: two-column desk view — left is the envelope/upload with drag-drop as "place document on desk"; right is the JD notepad on ruled paper. Action bar sits like a leather blotter.
- **Report** (the centerpiece): full-bleed document with editorial margins. Score presented as a large brass seal on the top-right with a ceremonial reveal. Charts sit inside the document as embedded plates with etched borders. Matched/missing skills appear as marginalia. Suggestions render as handwritten-tone Fraunces italic on ruled paper with underlined keywords. Top ribbon offers "Print", "Download" (native browser print CSS uses the same theme — publishable).
- **History**: "The Archive" — bound ledger table; each row is a ruled entry with monospace date, file title in Fraunces, ATS badge as mini-stamp; hover lifts the row like turning a page. Delete confirmation uses `ConfirmationModal` restyled as a wax-seal warning.
- **Account**: membership dossier — profile card as an ID plate with brass rivets; password reset + logout as secondary actions.
- **AuthGate / AuthModal**: manila envelope modal with wax-seal close button, preserving `pendingAction` replay.

---

## 9. Accessibility & performance guardrails

- Minimum contrast AA on all ink-on-paper combos (verified against tokens above).
- Focus rings are 2px brass with 2px ink offset, never removed.
- All decorative SVGs `aria-hidden`, semantic landmarks preserved.
- `prefers-reduced-motion`: cinematic sequences degrade to a single fade + a static "Analyzing…" caption.
- Fonts self-hosted with `font-display: swap`, subset to latin.
- Framer Motion tree-shaken; particles + parallax lazy-loaded on Landing only.
- No layout shift: sheet dimensions reserved before content loads.
- Print stylesheet for `/app/report` so the report is genuinely printable — reinforces the metaphor and is portfolio-worthy.

---

## 10. Interaction philosophy

Everything obeys one rule: **if it wouldn't happen to real paper, it doesn't happen here**. No neon glows, no glass blur, no bouncy springs, no confetti. Weight, warmth, and restraint. Delight comes from precision — the stamp lands once, exactly, and the sound of it (subtle 40ms audio, opt-in) is the only flourish.

---

## Technical scope (what actually gets touched)

Frontend only, inside `client/`:
- `client/src/styles.css` — replace with token system + component primitives.
- `client/src/index.css`, `App.css` — reduce to resets.
- `client/index.html` — add font links, favicon (brass monogram), theme-color.
- New `client/src/theme/` — motion presets, seal SVGs, paper utilities.
- New `client/src/components/paper/` — `Sheet`, `Stamp`, `Envelope`, `Ribbon`, `LedgerRow`, `Marginalia`, `WaxButton`, `InkLink`, `AnalyzingSequence`.
- Restyle in place: `Navbar`, both layouts, every `pages/` file, every `components/results/*`, `components/analyze/*`, `components/landing/*`, `components/history/*`, `components/faq/*`, `AuthGate`, `ConfirmationModal`, `ErrorBoundary`.
- Add deps: `framer-motion`, `@fontsource/cormorant-garamond`, `@fontsource/fraunces`, `@fontsource-variable/inter-tight`, `@fontsource/jetbrains-mono` (or `<link>` from Google Fonts — self-hosting preferred).
- Chart.js kept; only options/theme change.

Out of scope (untouched): `server/**`, `client/src/api.jsx`, `client/src/context/**`, `client/src/hooks/useApiAuth.jsx`, `client/src/routes/**`, `client/src/services/supabase/**`, `client/src/data/**`, `demoReport.json`, all endpoint paths, all Mongoose models, all Gemini prompts.

---

## One clarification before I build

The current Lovable workspace holds the earlier TanStack Start skeleton; your uploaded ZIP is the real MERN `client/` you want redesigned. Please confirm the target so I apply this strategy to the right codebase:

- **A. Rebuild the current Lovable workspace to match your uploaded MERN `client/` (React Router + Vite JSX), then apply "The Archivist" on top.** Result is an installable Vite frontend you drop into your MERN repo replacing `client/`. Recommended — it matches your constraints exactly.
- **B. Apply "The Archivist" to the current TanStack Start workspace as-is** (routes and stack differ from your real project; you'd port pieces manually into your MERN client).

Reply "A" or "B" (or edit any part of the strategy) and I'll proceed.
