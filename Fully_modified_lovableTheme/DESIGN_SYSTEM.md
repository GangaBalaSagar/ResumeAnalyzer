# Design System — Resume Analyzer ("The Recruiter's Desk")

An editorial, paper-inspired design system. Every screen is composed as if
it were a document laid on a warm desk: sheets of paper, sticky notes,
paper clips, ruled lines, and a single restrained accent color.

> **Golden rule.** Never invent new visual patterns. Compose from the
> primitives in this document. If a new pattern feels necessary, first
> check whether an existing primitive can be extended.

---

## 1. Design principles

1. **Editorial, not algorithmic.** Screens read like considered documents,
   not dashboards.
2. **One quiet workspace.** Warm paper background, restrained motion,
   generous whitespace.
3. **Serif for content, sans for chrome.** Prose is serif; labels and UI
   are sans; data is monospace.
4. **A single accent.** Violet accent is used sparingly — for the ATS
   score, for active nav numerals, for section markers. Never as a fill on
   large surfaces.
5. **Paper metaphors are literal.** `Sheet`, `PaperClip`, `StickyNote`,
   `dog-ear`, `rule-line`, `bookmark`, `tape` — these behave like their
   physical counterparts.
6. **The score is identity.** The ATS score always renders through the
   `AtsScore` component. There is no second score presentation anywhere.

---

## 2. Color tokens

All colors are defined as CSS custom properties in `src/styles.css` and
exposed as Tailwind utilities (`bg-*`, `text-*`, `border-*`) through the
`@theme inline` block. **Never hardcode hex values in components.**

### Surfaces

| Token | Utility | Purpose |
|---|---|---|
| `--background` | `bg-background` | The desk / page background — warm off-white. |
| `--paper` | `bg-paper` | A sheet — the primary card surface (pure white). |
| `--secondary` | `bg-secondary` | Muted paper — hover states, chip fills. |
| `--muted` | `bg-muted` | Slightly warmer neutral. |
| `--sticky` | `bg-sticky` | Sticky-note yellow. Used only by `StickyNote`. |
| `--tape` | `bg-tape` | Washi-tape translucent yellow. Decorative only. |

### Ink & text

| Token | Utility | Purpose |
|---|---|---|
| `--foreground` / `--ink` | `text-foreground` / `text-ink` | Body ink — near-black. |
| `--ink-muted` | `text-ink-muted` | Secondary ink — captions, metadata. |
| `--muted-foreground` | `text-muted-foreground` | Alias of `ink-muted`. |
| `--sticky-foreground` | `text-sticky-foreground` | Warm brown-black for sticky notes. |

### Accent, status, structure

| Token | Utility | Purpose |
|---|---|---|
| `--accent` | `text-accent` / `bg-accent` | The single brand accent (violet). ATS score numeral, active nav numeral, section §, drop-cap. |
| `--destructive` | `text-destructive` / `bg-destructive` | Errors, destructive actions only. |
| `--highlight` | `bg-highlight` | Marker highlight on matched keywords. |
| `--rule` | `border-rule` | The universal hairline. All internal separators use this. |
| `--border` / `--input` / `--ring` | `border-border`, etc. | Radix / form primitives. |

### Charts

`--chart-1` through `--chart-5` — reserved for Recharts. `chart-1` is
always the accent match color; `chart-2..5` fall to muted blues, ochres,
greens, and greys. Do not use elsewhere.

### Opacity conventions

Use token opacity through Tailwind's slash syntax (`border-rule/60`,
`bg-ink/20`, `text-ink-muted/70`). Common recipes:

- Header/footer border: `border-rule/60`
- Backdrop scrim: `bg-ink/20 backdrop-blur-[1px]` (drawer) or
  `bg-ink/40 backdrop-blur-sm` (modal)
- Muted glyph: `text-ink-muted/60..70`

**Never** use arbitrary Tailwind colors (`text-gray-500`, `bg-white`,
`text-purple-600`). They bypass theming.

---

## 3. Typography

### Font families

| Token | Stack | Use |
|---|---|---|
| `--font-serif` | Newsreader, Source Serif 4, Georgia | Headings, prose, body inside `Sheet`, drop-cap, italic accents, score numeral. |
| `--font-sans` | Inter, system-ui | Buttons, nav, chrome, page body default. |
| `--font-mono` | JetBrains Mono, ui-monospace | Metadata, IDs, timestamps, `code`, chart tooltips. |

### Heading hierarchy

Headings are always serif (`h1..h4` inherit `font-serif` in base styles).

| Level | Recipe | When |
|---|---|---|
| Page hero H1 | `font-serif text-[52px] md:text-[64px] leading-[1.02] tracking-tight` | Landing, Features, FAQ (public marketing intros). |
| App page H1 | `font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight` | Dashboard, Analyze, Report, History, Account. |
| Section H2 | `font-serif text-4xl leading-tight` (or `text-[28px]` in dense contexts) | Section headings within a page. |
| Card title | `font-serif text-2xl` or `text-[22–26px]` | Titles inside a `Sheet`. |
| Inline serif title | `font-serif text-[17–19px]` | List rows, definition terms. |

Every hero H1 pairs a upright line with an italic line to create the
"editorial break":

```jsx
<h1 className="font-serif text-[52px] md:text-[64px] leading-[1.02] tracking-tight">
  Your resume,
  <br />
  <span className="italic font-normal">read carefully.</span>
</h1>
```

### Body text

| Recipe | Use |
|---|---|
| `text-[17px] leading-relaxed text-ink-muted` | Lede paragraph under a hero. |
| `text-[15px] leading-relaxed text-ink-muted` | Standard body paragraphs. |
| `text-sm text-ink-muted` | Card bodies, secondary descriptions. |
| `font-serif text-[19px] leading-[1.6]` | The Report's executive-summary prose. |
| `font-serif italic` | Editorial asides, sticky-note copy, `AuthMessage`. |
| `font-mono text-[11–13px]` | Filenames, timestamps, IDs, "of N" counts. |

### Italic accents

Italics carry meaning — they mark the *editorial voice*. Use them for:

- The second line of a hero H1 (`italic font-normal`).
- Sticky note prose.
- Auth message text.
- Metadata like "just now" if handwritten in tone.
- Quotes.

Do **not** italicize for emphasis inside body copy — use `text-ink`
against `text-ink-muted` instead.

### Monospace

`font-mono` is reserved for **data**: timestamps, filenames, user IDs,
pagination counters, chart tooltips. Never for prose.

### `.eyebrow` class

The workhorse label. Small caps, wide tracking, muted ink.

```css
.eyebrow {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  font-weight: 500;
}
```

Common size overrides: `eyebrow text-[9px]` (footer meta),
`eyebrow text-[10px]` (default in components).

---

## 4. Spacing scale

Uses Tailwind's default 4px scale. No custom spacing tokens. Recurring
recipes across the app:

### Page rhythm

- **Outer page container:** `mx-auto max-w-7xl px-4 md:px-6`.
- **Vertical page padding:** `py-8 md:py-10` (app) or `pt-16 pb-20 md:pt-24` (public hero).
- **Section-to-section vertical rhythm:** `space-y-10` between top-level page sections; `py-20 md:py-24` between marketing sections with a `border-t border-rule/60`.

### Card spacing

- **Sheet padding:** `p-6` (dense) · `p-6 md:p-8` (default) · `p-8 md:p-10` (spacious hero sheet) · `p-10..p-12` (auth form sheet).
- **Above a `rule-line`:** `mt-3..mt-4`. Below: `mb-4..mb-5`.
- **Between grouped elements inside a Sheet:** `space-y-3..space-y-6`.

### Form spacing

- **Between fields:** `space-y-7` (auth) · `space-y-5..6` (dense).
- **Label → input:** `mt-2` (via `AuthField`).
- **Field → hint:** `mt-1.5`.

### Grid gaps

- **Content grids:** `gap-6 lg:gap-8` · `gap-6 lg:gap-10` for two-column
  main/rail.
- **Marketing feature grids:** `gap-6 lg:gap-8`.
- **Dense list rows:** `gap-3..gap-5`.

---

## 5. Grid system

The app uses a **12-column grid** at the page level, mounted inside
`max-w-7xl` (1280px).

### Standard page layout

```
┌───────────────────────────────────────────────────┐
│  Header (sticky, border-b border-rule/60)          │
├────────────┬──────────────────────────────────────┤
│ AppSidebar │  <Outlet />                          │
│ (lg only,  │  ┌────────── col-span-12 ─────────┐  │
│  260px)    │  │ 12-col page grid inside outlet │  │
│            │  └────────────────────────────────┘  │
└────────────┴──────────────────────────────────────┘
│  Footer                                            │
```

### Common page splits

| Split | Use |
|---|---|
| `col-span-12 lg:col-span-8` + `col-span-12 lg:col-span-4` | Main + right rail (Dashboard, Report, History, Account). |
| `col-span-12 lg:col-span-7` + `col-span-12 lg:col-span-5` | Editorial hero + prop composition (Landing, Auth). |
| `col-span-12 lg:col-span-6` × 2 | Symmetric two-up (Report skills). |
| `grid-cols-1 md:grid-cols-2 gap-6` | Cards, features. |
| `grid-cols-1 md:grid-cols-3 gap-6` | Three-step workflow, stats. |

Grids collapse to a single column below `md`, with the right rail moving
under the main content.

---

## 6. Components

### 6.1 Sheet

The primary card surface — a piece of paper.

```jsx
<Sheet className="p-6 md:p-8" lift dogEar>
  <PaperClip />           {/* optional */}
  <Eyebrow>Section</Eyebrow>
  <div className="font-serif text-2xl">Title</div>
  <div className="rule-line my-5" />
  {body}
</Sheet>
```

**Props**

| Prop | Effect |
|---|---|
| `lift` | Adds hover translate + deeper shadow via `.sheet-lift`. Use on interactive/hero sheets. |
| `stack` | Renders two ghost sheets behind via `::before`/`::after`. Decorative. |
| `dogEar` | Folded top-right corner. Reserve for feature/hero cards. |
| `className` | Padding, position, spans. |

**Rules**

- Always place a `PaperClip` inside a Sheet if you use one — it's absolutely positioned to the Sheet's top-left.
- Interior structure is always: `Eyebrow` → serif title → `rule-line` → body.
- Sheets are white on the warm desk — do not recolor them.
- Do not nest Sheets. If a section needs a sub-panel, use a bordered `div` with `border-rule` and no shadow.

### 6.2 AtsScore

The single, canonical presentation of the ATS match score.

```jsx
import AtsScore, { bandFor, verdictFor } from "@/components/app/AtsScore";

<AtsScore value={87} size="xl" />
```

**Sizes**

| Size | Numeral | Use |
|---|---|---|
| `xs` | 24px | Inline in dense lists / MetaRow values. |
| `sm` | 32px | List rows (Dashboard recent, History rows, draft banner). |
| `md` | 48px | At-a-glance cards, decorative marketing mocks. |
| `xl` | 92px | The Report cover. Only one per page. |

**Rules**

- **`AtsScore` is the only score primitive.** Never render a match/ATS value as `${value}%` inline.
- Always pair with `bandFor(value)` for the verdict label ("Excellent · Strong · Fair · Weak") when a caption is needed.
- The `/100` tail is part of the identity — do not hide it (`showScale={false}`) except in extreme space constraints.
- Coverage %, chart legends, and count percentages are *not* the ATS score and use plain `%` (they never use `AtsScore`).

### 6.3 StickyNote

An editorial aside — quote, tip, warning-in-a-soft-voice.

```jsx
<StickyNote rotate={-2}>
  <div className="text-[13.5px] leading-snug">
    <div className="eyebrow text-[10px]">Editor's note</div>
    <div className="mt-1 font-serif">Bring the job description.</div>
  </div>
</StickyNote>
```

**Props**

| Prop | Effect |
|---|---|
| `rotate` | Degrees, default `-1.5`. Range: `-3` to `+3`. Never `0`. |
| `className` | Position, width. Sticky notes are ~200–260px wide. |

**Rules**

- Body is always serif italic (baked into `.sticky-note`).
- Use for prose only — never for actionable UI (no buttons, no forms).
- Maximum one sticky note per section; two if paired with a wide card.
- Never place inside a Sheet — sticky notes sit on the desk, not on paper.

### 6.4 PaperClip

Decorative SVG. Absolutely positioned; expects a positioned parent.

```jsx
<Sheet className="relative p-6">
  <PaperClip />
  ...
</Sheet>
```

**Rules**

- Always inside a `Sheet` (or an element with `relative`).
- One per Sheet — never two clips on one card.
- Reserve for Sheets that carry meaning: hero sheets, empty-state sheets,
  auth form, report cover. Not every card.

### 6.5 Eyebrow

Small-caps label above a heading or above a metadata block.

```jsx
<Eyebrow>Section title</Eyebrow>
<div className="mt-2 font-serif text-2xl">Heading</div>
```

**Rules**

- Precedes almost every serif heading inside a Sheet.
- Uses `.eyebrow` class. Override size with `text-[9px..12px]`.
- Text style is: `THIS · IS · HOW · IT · READS` — sentence-case words separated by ` · ` when combining categories (`"The archive · Filed readings"`).
- Never used as a body element.

### 6.6 Supporting paper primitives

| Class / helper | Use |
|---|---|
| `.rule-line` | Universal 1px separator inside cards. Vertical margins: `my-4..my-8`. |
| `.dog-ear` | Folded corner on `Sheet` via `dogEar` prop. |
| `.sheet-stack` | Ghost sheets behind — decorative auth aside. |
| `.paper-grain` | Subtle noise texture — rarely used; reserved for hero props. |
| `.ruled` | Ruled-paper background for notes. Currently unused; available for future notes surfaces. |
| `Bookmark` | Colored ribbon tab. Available for future use (unused in current app). |

---

## 7. Buttons

There is no `<Button>` component. Buttons are composed inline with a fixed
recipe, so every instance looks identical.

### Primary — filled ink

```jsx
<Link/button
  className="px-4 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
>
  New Analysis →
</Link>
```

Larger CTA variant: `px-5 py-3` (marketing CTA) or `px-6 py-3.5` (hero CTA).

### Secondary — outlined

```jsx
className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors"
```

Larger: `px-5 py-3` or `px-6 py-3.5`.

### Ghost / tertiary — icon or plain text

- Icon-only: `h-8 w-8 inline-flex items-center justify-center border border-ink/15 hover:border-ink/50 rounded-sm transition-colors` + `aria-label`.
- Text link inside body: `.story-link` for the animated underline; or `text-ink-muted hover:text-ink transition-colors`.

### Destructive

```jsx
className="text-sm px-3 py-1.5 text-destructive border border-destructive/30 hover:bg-destructive/5 rounded-sm transition-colors"
```

Reserved for delete confirmations and destructive actions in modals.

### Auth-primary

For auth forms only, use the shared `<AuthPrimaryButton>` — it fixes
height and paddings so form actions line up: `h-11 px-6 bg-ink text-paper`.

### Rules

- Always `rounded-sm` (2px). Never fully rounded.
- Always `transition-colors`. No transform hovers on buttons.
- Text size is `text-sm` unless it's a marketing CTA (`text-sm` still; only padding grows).
- Arrow ornaments (`→`) are conventional on primary CTAs (`New Analysis →`, `Read the report →`) — keep them consistent per CTA type.
- Icon-only buttons **must** carry `aria-label`.

---

## 8. Inputs

### `AuthInput` — the canonical text input

```jsx
<input
  className="w-full bg-transparent border-0 border-b border-rule
             focus:border-ink text-ink placeholder:text-ink-muted/60
             font-serif text-[17px] py-2 px-0 outline-none transition-colors"
/>
```

- Transparent background, no top/left/right border — just a ruled line
  that darkens on focus. Feels like writing on paper.
- Serif at `17px` for typed input.
- Paired with an `Eyebrow` label via `<AuthField>` (`label` element,
  `htmlFor`).

### Search / filter input (History)

Same ruled-line pattern with an inline icon and a "clear" text button:

```jsx
<div className="flex items-center gap-3 border-b border-rule focus-within:border-ink">
  <SearchGlyph />
  <input className="flex-1 bg-transparent border-0 focus:outline-none font-serif text-[15px] py-2" />
</div>
```

### Textarea (JD sheet)

Multi-line textarea keeps the same principle: transparent, ruled bottom
line, serif type, no visible box. Word-count meta sits below in
`font-mono text-[11px]`.

### File drop zone

Bordered dashed area with two states:

- Idle: `border border-dashed border-rule bg-secondary/30`.
- Dragging: `border-ink bg-secondary/60`.

### Rules

- Never use filled `<input>` boxes with visible chrome. The paper metaphor is a line, not a box.
- Every input has a visible `Eyebrow` label or an `aria-label`.
- Placeholders are hints, not labels — always additive.
- Focus ring is a color change on the underline (`border-ink`), not a browser outline. Do not remove `focus-visible` from icon buttons.

---

## 9. Cards

There is no separate "Card" primitive — cards **are** `Sheet`s. Any grid
of cards is a grid of Sheets:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {items.map((c, i) => (
    <Sheet key={c.id} className="p-6" lift dogEar={i % 3 === 0}>
      <Eyebrow>Sheet № {c.n}</Eyebrow>
      <div className="mt-3 font-serif text-2xl">{c.title}</div>
      <p className="mt-2 text-sm text-ink-muted">{c.body}</p>
      <div className="rule-line mt-6" />
      <div className="mt-3 text-xs text-ink-muted">Filed under · …</div>
    </Sheet>
  ))}
</div>
```

Rules: `lift` on interactive/marketing cards; `dogEar` sparingly (every
third card at most) to keep the paper varied but not busy.

---

## 10. Navigation rules

### Two shells, only

| Shell | Where it wraps | File |
|---|---|---|
| `PublicSite` | Landing, Features, FAQ, all auth pages, 404, AuthGate loading state. | `src/components/public/PublicSite.jsx` |
| `AppLayout` | Authenticated app: Dashboard, Analyze, Report, History, Account. | `src/components/app/AppLayout.jsx` |

Do not create a third shell.

### Public header (`PublicHeader`)

- Sticky, `border-b border-rule/60`, `bg-background/85 backdrop-blur-sm`.
- Left: `Mark` + wordmark ("Resume Analyzer") + eyebrow tagline.
- Center (`md+`): NAV — `Home`, `Features`, `FAQ` — as `.story-link` items with `text-ink` when active.
- Right: `Sign in` (text) + primary CTA `Begin an analysis`. When signed in, collapses to a single `Open the desk` primary CTA.
- Mobile: nav collapses into a horizontal scroll strip below the header (no drawer on public pages).

### App header (`AppHeader`)

- Same sticky treatment.
- Left: hamburger (`lg:hidden`) + `Mark` + wordmark + breadcrumb "table of contents" built from `APP_NAV` labels.
- Breadcrumb style: eyebrow-cased for ancestors, `font-serif italic` for the current page.
- Right: `New Analysis` primary CTA + `UserMenu`.

### Sidebar (`AppSidebar`)

- `lg` and up only, 260px wide, sticky at `top-24`.
- Rendered as a `Sheet` with a `PaperClip` — a paper index card.
- Nav entries carry a serif two-digit numeral (`01..99`) and a serif label.
  Active item: `bg-secondary`, numeral colored `text-accent`.
- `APP_NAV` is the single source of truth for both sidebar and mobile drawer.

### Mobile navigation (`MobileNav`)

- Full-height off-canvas drawer from the left, 86% width, max 320px.
- Structure top-to-bottom: masthead → `Contents` nav (same items as sidebar) → primary CTA → spacer → account card (initial monogram + name + email + subtle text `Sign out`) → footer meta strip.
- Backdrop: `bg-ink/20 backdrop-blur-[1px]`.
- Escape key and backdrop tap dismiss; body scroll locks while open.
- `role="dialog" aria-modal="true"`, close button carries `aria-label="Close"`.

### Footers

- **Public footer:** three-column grid — brand + tagline, Site nav, Members links — over a footer meta bar with edition metadata.
- **App footer:** single meta bar (`© · Edition № · Printed on warm paper`). Simpler because the app already carries dense navigation.

### Interaction consistency

- Active nav item on public: `text-ink` with `.story-link` underline.
- Active nav item on app: `bg-secondary` fill + `text-accent` numeral.
- Hover on inactive nav: `text-ink-muted → text-ink`.
- Never introduce a third active-state visual.

---

## 11. Responsive rules

Desktop is the primary design target; tablet and mobile adapt naturally.

### Breakpoint reference (Tailwind defaults)

| Prefix | Min-width | Meaning in this app |
|---|---|---|
| — | 0 | Single-column, mobile. |
| `sm` | 640px | Small tablets; inline CTAs return. |
| `md` | 768px | Two-column card grids; wider padding. |
| `lg` | 1024px | Sidebar + main. Multi-column page grids. |
| `xl` | 1280px | Same as `lg`; content is `max-w-7xl` (1280px). |

### Universal rules

1. **Do not redesign for mobile.** Use the same primitives; stack them.
2. **Sidebar hides below `lg`.** Use `MobileNav` off-canvas drawer.
3. **Right rails move under the main column below `lg`.**
4. **Page grid gutter:** `gap-6` mobile → `gap-8..10` at `lg`.
5. **Page padding:** `px-4` mobile → `px-6` at `md`; `py-8` mobile → `py-10` at `md`.
6. **Sheet padding:** `p-6` mobile → `p-8..p-10` on larger heroes.
7. **Hero H1 scale:** `text-[44–52px]` mobile → `text-[52–64px]` at `md`.
8. **Tap targets:** minimum 40×40; primary tap targets 44×44 (`h-11`).
9. **Never hide primary content on mobile.** Score cells and secondary
   metadata may hide on tight rows, but never the row's identity or its
   primary action.

---

## 12. Motion

### Timings & easing

| Token | Duration | Easing | Use |
|---|---|---|---|
| Micro (color) | `150–200ms` | Tailwind `transition-colors` default | Hovers, focus, link color. |
| Standard (transform + shadow) | `250ms` | `cubic-bezier(.2,.7,.2,1)` | Sheet lift, generic transitions. |
| Underline reveal | `300ms` | `cubic-bezier(.2,.7,.2,1)` | `.story-link`. |
| Page in | `500ms` | `cubic-bezier(.2,.7,.2,1)` | `animate-page-in` on `<Outlet>` root. |
| Fade up | `500ms` | `cubic-bezier(.2,.7,.2,1)` | `animate-fade-up` on hero content, drawers, modals. |

### Keyframes (defined in `src/styles.css`)

```css
@keyframes page-in {
  0%   { opacity: 0; transform: translateY(8px) rotateX(4deg); transform-origin: top; }
  100% { opacity: 1; transform: translateY(0)   rotateX(0); }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- `animate-page-in` — a subtle page-turn tilt. Applied at the outlet
  root; do not apply to individual sections.
- `animate-fade-up` — one-shot upward fade. Use on hero content, modals,
  drawer entry, per-item reveals (sparingly).

### Motion principles

1. **Restrained by default.** Prefer color/opacity transitions over transform.
2. **Paper feels light.** `Sheet` hover is a 2px translate + a tiny `-0.15deg` rotate. Never scale.
3. **One entry animation per page.** The outlet handles `page-in`; do not stack more entries on top.
4. **No spring physics.** Every animation uses the same `cubic-bezier(.2,.7,.2,1)` for consistency.
5. **Icons don't spin.** Loading states use staged prose + subtle progress, not spinners.
6. **Respect motion preferences.** Never gate meaning on animation; every animated affordance has a static readable state.

---

## 13. Loading states

Every loading state uses the same editorial recipe:

```jsx
<Sheet className="relative p-10">
  <PaperClip />
  <Eyebrow>One moment</Eyebrow>
  <div className="mt-2 font-serif text-2xl">Reading the cabinet…</div>
  <div className="rule-line my-5" />
  {/* optional: staged copy, ghost rows, or a progress line */}
</Sheet>
```

Variants:

- **Skeleton rows:** `h-14 bg-secondary/40 border border-rule rounded-sm animate-pulse` — up to 3 rows.
- **Analyzing:** show numbered stages of work as a list; advance stage
  index on a `setInterval`. Progress line uses `bg-accent`.
- **Auth loading:** `AuthGate` renders the loading Sheet inside `PublicSite` so the shell never flickers.

Never use a bare spinner.

---

## 14. Empty states

Recipe: stacked-paper glyph + Eyebrow + serif title + muted lede + primary
CTA.

```jsx
<Sheet className="relative p-12 text-center" lift>
  <PaperClip />
  <div className="mx-auto w-20 h-24 relative opacity-80 mb-6">
    {/* 3 rotated ghost sheets */}
  </div>
  <Eyebrow>The cabinet is empty</Eyebrow>
  <div className="mt-3 font-serif text-3xl">Nothing filed yet.</div>
  <p className="mt-3 text-sm text-ink-muted max-w-md mx-auto">…</p>
  <Link className="mt-6 inline-block px-5 py-3 bg-ink text-paper text-sm rounded-sm">…</Link>
</Sheet>
```

Rules: every empty state names its subject in the eyebrow, gives the
reader something to do, and never renders on the raw desk — always inside
a Sheet.

---

## 15. Error states

Two levels:

**Inline field/section error** — the ruled left-margin note:

```jsx
<div className="border-l-2 border-destructive/60 bg-destructive/5
                pl-4 pr-4 py-3 text-sm font-serif italic text-destructive"
     role="alert">
  {message}
</div>
```

The shared `<AuthMessage kind="error|success|info">` renders this exact
recipe for auth flows.

**Page-level error inside a Sheet** — same recipe as loading, but the
title is the error, the eyebrow is `Trouble`, and the body offers a next
step ("Try again", "Check that VITE_API_URL is set", …).

Rules: destructive tone only; never a red banner across the top of the
page; always give the reader a next step or a diagnostic hint.

---

## 16. ATS score usage — reinforced

`AtsScore` is a **product identity** element. Enforce:

- Only one component may render the score. Anywhere the score appears —
  Dashboard "Continue working", History rows, History detail modal,
  Report cover, Report at-a-glance, marketing mock cards — it flows
  through `AtsScore`.
- Verdict labels use `verdictFor(value)`; band labels use `bandFor(value)`.
- The score numeral is always serif, accent-colored, right-tailed with `/100`.
- Coverage `%`, keyword counts, and chart legend `%` are *not* the score
  and stay in plain text.

---

## 17. Accessibility

- **Contrast:** `text-ink` on `bg-paper` (~15:1) and `text-ink-muted` on `bg-background` (~5:1) both meet WCAG AA. Never use `text-ink-muted/50` or lower for meaningful text.
- **Semantic structure:** one `<main>` per shell, `<header>`/`<footer>`
  landmarks, `<nav aria-label="…">` for each nav, `<ol>`/`<ul>` for real
  lists.
- **Headings:** one H1 per page. Section titles are H2. Don't skip levels.
- **Icon-only buttons:** always `aria-label`.
- **Forms:** every input paired with `<label htmlFor>`; every hint uses
  the field's associated hint slot.
- **Dialogs (modal, mobile drawer):** `role="dialog" aria-modal="true"`;
  Escape closes; backdrop click closes; body scroll locks.
- **FAQ accordion:** `aria-expanded` on the trigger; content is a sibling.
- **Alerts vs. status:** errors use `role="alert"`; successes use
  `role="status"` (both handled by `AuthMessage`).
- **Focus:** rely on the native focus ring for form controls; on the
  ruled inputs the visible change is the underline color. Do not remove
  `outline` from buttons.

---

## 18. Component usage guidelines — cheat sheet

| Need | Reach for | Do not |
|---|---|---|
| A container of content | `<Sheet>` | Custom bordered `div`. |
| A card grid | Grid of `<Sheet>` | A new `<Card>` primitive. |
| A section label | `<Eyebrow>` | Bold sans headings. |
| A separator inside a Sheet | `<div className="rule-line …" />` | `<hr>`, ad-hoc borders. |
| An editorial aside / tip | `<StickyNote>` | Muted `<Sheet>`. |
| Decoration on a hero Sheet | `<PaperClip />` (once) | Repeated clips. |
| A page hero | `PageIntro` (public) or in-page `<header>` with Eyebrow + serif H1 | New hero component. |
| The ATS score | `<AtsScore value size />` | `${x}%` or a new score component. |
| Primary action | Ink pill button recipe | Colored buttons other than ink or destructive. |
| Secondary action | Outlined ink button recipe | Ghost buttons with no border. |
| A text input | `<AuthInput>` / ruled `<input>` | Boxed inputs with visible chrome. |
| Loading | Sheet + Eyebrow + serif title + rule-line | Spinner. |
| Empty | Sheet + stacked-paper glyph + CTA | Generic "no data". |
| Error | `border-l-2 border-destructive/60 …` strip | Red banner or toast. |
| Public shell | `<PublicSite>` | `AppLayout` on public routes. |
| App shell | `<AppLayout>` mounted at the route | Nested layouts. |
| A new nav item | Add to `APP_NAV` | Hardcode in sidebar + drawer separately. |

---

## 19. Files & where things live

```
src/
├── styles.css                       Tokens, keyframes, .sheet, .eyebrow, .rule-line
├── components/
│   ├── paper.jsx                    Sheet, StickyNote, Eyebrow, PaperClip, Bookmark
│   ├── public/PublicSite.jsx        Public shell + PageIntro
│   ├── app/
│   │   ├── AppLayout.jsx            Authenticated shell + PageContainer
│   │   ├── AppHeader.jsx            Masthead + breadcrumbs
│   │   ├── AppSidebar.jsx           APP_NAV registry + sidebar
│   │   ├── MobileNav.jsx            Off-canvas drawer
│   │   ├── UserMenu.jsx             Account dropdown
│   │   ├── AppFooter.jsx            App footer bar
│   │   └── AtsScore.jsx             The canonical score
│   └── auth/
│       ├── AuthGate.jsx             Route protection + loading state
│       └── AuthLayout.jsx           Auth form shell + AuthField/AuthInput/AuthPrimaryButton/AuthMessage
└── pages/
    ├── Landing.jsx · Features.jsx · FAQ.jsx · NotFound.jsx
    ├── auth/…
    └── app/Dashboard.jsx · Analyze.jsx · Report.jsx · History.jsx · Account.jsx
```

When in doubt, open the closest neighbor page and mirror it. Consistency
is the design system.
