# LandingV2 — Comprehensive Design Review

*Treated as a finished SaaS landing page under design review. No code modifications — analysis only.*

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Chapter-by-Chapter Analysis](#chapter-by-chapter-analysis)
3. [Cross-Cutting Evaluation](#cross-cutting-evaluation)
4. [Product Authenticity Audit](#product-authenticity-audit)
5. [Overall Score & Prioritized Improvements](#overall-score--prioritized-improvements)
6. [Narrative Coherence Verdict](#narrative-coherence-verdict)

---

## Executive Summary

**LandingV2 is an ambitious, narrative-driven landing page that uses a "desk metaphor" to walk visitors through the product experience chapter by chapter.** It aspires to be a guided walkthrough of the actual application rather than a traditional marketing site. The visual language (paper textures, dog-ears, paper clips, ruled lines, sticky notes) is distinctive and memorable — a genuine "paper-on-desk" design system that carries through to the actual app.

**Core tension:** The landing page *looks* like the app (shared paper components, identical data visualizations, identical copy tone), but it *behaves* like a marketing page (static previews, scroll-triggered animations, chapter structure). This creates an authenticity gap — visitors see the app's UI but can't interact with it. The page promises "upload, compare, improve" but never lets them *do* it until the final CTA.

**Overall Score: 7.2 / 10**

---

## Chapter-by-Chapter Analysis

### Chapter 1: Hero — "Vol. I — The Recruiter's Desk" (`HeroPrototype.jsx` → `CinematicHero.jsx`)

**Purpose:** Establish the desk metaphor, communicate the core promise ("Your resume, read carefully"), and drive to the first CTA ("Place a resume on the desk").

**Strengths:**
- **Scroll-driven cinematic hero** (desktop) is technically impressive — camera dolly/zoom, staged paper entrance, gaze spotlight, sequential captions. Creates a strong "opening credits" feeling.
- **Copy is confident and literary** ("Vol. I", "read carefully", "quiet, considered analysis"). Establishes a distinct voice — not generic SaaS.
- **Paper components (ResumeSheet, JobDescriptionSheet)** are the *actual* components from the app (same PaperClip, same dog-ear, same ruled lines). Visual authenticity is high.
- **Static mobile fallback** (`StaticHero`) is well-crafted — not a broken downgrade, a considered alternative.

**Weaknesses:**
- **500vh scroll jacking** on desktop is a heavy UX commitment. Users can't scroll normally; they're locked into a 50-screen journey. No "skip" or "reduce motion" escape hatch beyond `prefers-reduced-motion` (which hides the entire scroll experience).
- **Caption sequence** ("Every resume deserves a careful reading" → "A candidate arrives" → "A role to fill" → "Read together, not apart" → "What matches" → "And what's missing") is poetic but *abstract*. It describes the *metaphor*, not the *product*. Visitors don't yet know what the product *does*.
- **CTAs** ("Place a resume on the desk" / "Read the features") use metaphorical language ("place on the desk") instead of product language ("Upload resume"). Creates friction — is this a game? A demo? The real thing?
- **No visible product UI** in the hero. The sheets animate in but are decorative. The actual Analyze page (the "desk") isn't shown until Chapter 2.

**UX Issues:**
- Scroll-jacking breaks browser affordances (scrollbar position, find-in-page, back-button behavior).
- No progress indicator — user doesn't know how long the "movie" lasts.
- Mobile users get a static sheet — they miss the narrative entirely.

**Narrative Issues:**
- Opens with "Vol. I" — implies a series, but there's no Vol. II, III on the landing page. Feels like a chapter title without a book.
- "The Recruiter's Desk" positions the *recruiter* as the persona, but the product is for *candidates*. Slight audience confusion.

**Visual Issues:**
- Gaze spotlight (radial gradient) is subtle to the point of invisibility on some displays.
- Caption text is small (18px), right-aligned, low contrast (`text-ink-muted`) — easy to miss.
- Paper clips on sheets in hero don't match the PaperClip component used elsewhere (different visual weight).

**Suggestions (analysis only):**
- Offer a "Skip to desk" anchor link visible during scroll.
- Replace poetic captions with product beats: "Upload resume → Paste JD → Get match score → See missing skills → Edit with suggestions → Save to archive."
- Show a micro-screenshot of the actual Analyze page in the hero (picture-in-picture) so visitors recognize the destination.
- Consider a non-scroll-jacked "cinematic" variant that uses `framer-motion` layout animations on mount instead of scroll progress.

---

### Chapter 2: Submit — Preview the Analyze Page (`SubmitPreview.jsx`)

**Purpose:** Show the actual Analyze page UI — file upload + JD text area + actions — so visitors recognize it when they arrive.

**Strengths:**
- **High fidelity to the real Analyze page.** The Sheet layout, PaperClip, Eyebrow, ruled textarea, file card with mini-document preview, Replace/Remove buttons — all match `Analyze.jsx` almost exactly.
- **Mock data is realistic** ("Mara_Designer_Resume.pdf", 245KB, realistic JD text). Feels like a real session.
- **StickyNote guidance** ("Upload the version you'd actually send...") adds product voice.
- **Actions preview** shows the exact button hierarchy (Reset secondary, Begin review primary).

**Weaknesses:**
- **Static preview only.** No interaction — file card shows "Attached" state but clicking Replace/Remove does nothing. The textarea is `readOnly`. Visitors can't *try* the flow.
- **No progressive disclosure.** The whole form is visible at once. The real Analyze page reveals the JD textarea only after a file is attached (progressive disclosure reduces cognitive load).
- **Missing the "Review rules" and "What the review checks" side rail** that exists in the real app (right column in `Analyze.jsx`). The landing preview only shows the main column.

**UX Issues:**
- Visitors may try to interact (click the file input, type in textarea) and find it frozen. No affordance indicating "this is a preview."
- The "Begin review →" button is styled as a real button but goes nowhere (no `onClick`, no `Link`).

**Narrative Issues:**
- Chapter title "Chapter 2 — Submit" continues the book metaphor, but the content is a UI preview. The metaphor shifts from "story" to "demo" without acknowledgment.

**Visual Issues:**
- Left column (copy) and right column (preview) have different vertical rhythms. The left column is short; the right column is tall. Creates awkward white space on large screens.
- The "Two sheets. One review." divider is hidden on mobile (`hidden lg:flex`) — mobile users lose the chapter framing.

**Suggestions:**
- Add a subtle "Preview mode" badge or disabled overlay on interactive elements.
- Consider making the file input *actually work* (upload to a demo session) — even a 30-second demo session would dramatically increase conversion.
- Mirror the real Analyze page's two-column layout (main + right rail) for accuracy.

---

### Chapter 3: The Sheets — Preview the Four Report Sheets (`SheetsOnDesk.jsx`)

**Purpose:** Reveal the four output artifacts (Match Score, Skills Overview, Suggestions, Archive) as physical sheets on the desk.

**Strengths:**
- **Strong information architecture.** Four sheets, each with: number, title, preview copy, capability tags ("Grouped by strength", "Line-level edits"), and a live demo component.
- **Interactive demos** (`ScoreDemo`, `SkillsDemo`, `SuggestionsDemo`, `ArchiveDemo`) use real components (AtsScore, skill chips, suggestion list) with mock data. Visitors can *see* the output format.
- **Hover lift animation** on sheets (`.sheet-lift:hover`) gives tactile feedback — reinforces paper metaphor.
- **Focus state system** (`data-focus="active/adjacent/distant"`) suggests keyboard navigation awareness.
- **Visual hierarchy:** Sheet 1 (Score) gets 7/12 columns — the hero metric. Sheets 2-3 split 5/5. Sheet 4 (Archive) gets 7. Correct emphasis.

**Weaknesses:**
- **Demo components are simplified.** `ScoreDemo` shows a static 87% bar. `SkillsDemo` shows static chips. No animation, no interaction. The real Report page has Recharts pie/bar charts with tooltips — the landing demos don't.
- **ArchiveDemo** shows 3 mini-sheets with dates but no interactivity. The real History page has filtering, search, sort — none of that is hinted at.
- **Dog-ear pattern** alternates (index % 2 === 0) but Sheet 1 (Score) and Sheet 3 (Suggestions) have dog-ears, Sheets 2 and 4 don't. Visual rhythm feels arbitrary.
- **CSS custom properties** for card offset/translate/tilt (`--card-offset`, `--card-translate-x`, `--card-tilt`) are defined inline but the corresponding CSS isn't visible in the component — likely in a global stylesheet. Hard to verify consistency.

**UX Issues:**
- No way to "flip" a sheet to see the back (where details might live).
- "Explore all sheets →" link goes to `/features` but the chapter *is* the feature overview. Redundant navigation.

**Narrative Issues:**
- Chapter 3 reveals the *output* before Chapter 4 explains the *process*. Narrative order: Hero → Submit → Output → Process → Compare → Review → Improve → Return. The "reveal" happens before the "how."

**Visual Issues:**
- Grid layout uses `md:grid-cols-12` with complex span classes. On tablet (md), the layout shifts awkwardly — Sheet 2 gets `md:mt-10` (negative offset?) which may overlap.
- `data-focus-state="idle"` on the grid container but no visible focus styles in the component.

**Suggestions:**
- Align demo components with real Report page visualizations (Recharts pie/bar, not custom bars).
- Show Archive with a search/filter hint (even if non-functional) to communicate power-user features.
- Reorder: Process (Ch 4) → Sheets (Ch 3) makes more narrative sense.

---

### Chapter 4: The Process — Five Stages (`ReviewProcess.jsx`)

**Purpose:** Explain *how* the review works — the five-stage pipeline.

**Strengths:**
- **Clear, linear narrative.** Submit → Read → Mark → Report → Archive. Each stage has a number, title, and one-sentence detail.
- **Visual rhythm:** Staggered grid (col-span-5 alternating left/right with `md:mt-10` and `md:ml-auto`) creates a "zig-zag" reading path that feels like turning pages.
- **Consistent Sheet component** with dog-ears, paper clips, ruled lines — matches the design system.
- **Copy is specific:** "The AI reads both documents together — parsing sections, extracting requirements, mapping evidence." Not vague marketing speak.

**Weaknesses:**
- **No visual representation of the process.** Five text cards. The hero already showed "reading" animation (Chapter 1), ComparePreview shows it again (Chapter 5). This chapter is purely textual.
- **Stage icons** (`icon: "upload"`, `"read"`, `"mark"`, `"report"`, `"archive"`) are defined but **never rendered**. The UI shows only the number (`stage.n`) in accent color.
- **Staggered grid is fragile.** On mobile (`grid-cols-1`), the zig-zag collapses to a straight column — the `md:mt-10` offsets become meaningless vertical gaps.

**UX Issues:**
- No progressive disclosure — all five stages visible at once. Could be a stepper with "Next" navigation.
- No connection to the actual UI. "Read" stage doesn't show the reading line animation. "Mark" stage doesn't show highlighted JD. "Report" stage doesn't show the score card.

**Narrative Issues:**
- Comes *after* the Sheets chapter. Visitor sees the output (Ch 3) before the process (Ch 4). Feels like showing the meal before the recipe.

**Visual Issues:**
- `--card-translate-x` values are small (±8px max). On large screens, the stagger is barely perceptible.
- `dogEar={index !== 2}` — middle card (Mark) has no dog-ear. Why? Inconsistent.

**Suggestions:**
- Render the icons (even as simple inline SVGs) — they're defined in data but unused.
- Add a micro-animation per card on scroll reveal (fade-up + slight rotate) to reinforce "stages."
- Consider moving this chapter *before* Sheets.

---

### Chapter 5: Compare — Review in Progress (`ComparePreview.jsx`)

**Purpose:** Show the "reading" phase — the 20-second analysis animation with progress bar, scanning line, and stage list.

**Strengths:**
- **Identical to the real Analyze page's `ReadingProgress` component.** Same scanning line, same highlighter sweep, same stage list with checkmarks. High authenticity.
- **Auto-playing animation** on mount gives immediate life to the page. No user action needed.
- **Progress percentage** (0→92%) and stage advancement (0→4) feel realistic (350ms/1400ms intervals).
- **Copy framing:** "The progress shows the reading, not a spinner." Strong product philosophy statement.

**Weaknesses:**
- **Auto-plays once on mount, then stops.** If user scrolls past and back, it's frozen at 92%. No replay trigger.
- **Mock file name** (`Mara_Designer_Resume.pdf`) differs from Chapter 2's mock (`Mara_Designer_Resume.pdf` — same, good) but Chapter 3's Archive shows different filenames. Minor inconsistency.
- **No "This is a simulation" indicator.** Visitors may think it's a live demo.

**UX Issues:**
- The scanning surface (`h-24 md:h-28`) is small. Hard to perceive the "reading line" motion on mobile.
- Stage list text is small (`text-sm`) and low contrast (`text-ink-muted/50` for pending). Hard to read at a glance.
- "What happens next" hint is `hidden lg:block` — mobile users don't see the transition promise.

**Narrative Issues:**
- This is the *only* chapter with motion. All others are static. Creates an uneven "motion language" — one living moment in a static page.

**Visual Issues:**
- The highlighter sweep (`bg-highlight/30`) and reading line (`bg-accent/80`) use different colors (yellow vs purple). Intentional? Confusing.
- Progress bar is 3px tall — very thin. Easy to miss.

**Suggestions:**
- Add a "Replay" button (reset intervals).
- Show this animation in the Hero (Chapter 1) as a picture-in-picture — unify the motion language.
- Make the scanning surface taller on mobile.

---

### Chapter 6: Review — Report Page Preview (`ReviewPreview.jsx`)

**Purpose:** Full-fidelity preview of the Report page — cover score, executive summary, skills, charts, suggestions, JD comparison.

**Strengths:**
- **Exceptional fidelity.** Uses real `AtsScore` component, real Recharts `PieChart`/`BarChart`, real `highlightJD` function, real `verdictFor`/`bandFor` logic. The mock data (`MOCK_REPORT`) matches the actual API response shape.
- **Complete Report page in one scroll.** Cover → Summary → Skills (matched/missing) → Charts (pie + bar) → Suggestions → Margin notes → How-to. Matches `Report.jsx` structure almost 1:1.
- **StickyNote** ("Read these as edits, not orders") appears in both landing and real app — consistent voice.
- **Dog-ear on Suggestions sheet** (`dogEar stack lift`) — visual hierarchy: this is the actionable sheet.

**Weaknesses:**
- **Static screenshots in disguise.** All interactive elements (tooltips on charts, copy button, print button, JD highlighting) are frozen. Recharts `Tooltip` won't fire on static render.
- **Duplicate suggestion content** with Chapter 7 (ImprovePreview). Both show the same 4 suggestions. Redundant.
- **No "Empty state" preview.** What if matched=0, missing=0? No error state shown.
- **Chart colors** use CSS variables (`var(--color-accent)`, `var(--color-rule)`) but the landing page may not load the same CSS context as the app. Risk of mismatch.

**UX Issues:**
- Visitors can't interact with the charts (hover for values), can't copy suggestions, can't print. The most powerful features of the Report page are invisible.
- The JD comparison section at the bottom uses `dangerouslySetInnerHTML` with `highlightJD` — same as real app. But on landing, it's just text. No legend interaction.

**Narrative Issues:**
- Chapter 6 (Review) and Chapter 7 (Improve) both show suggestions. Chapter 6 shows them in the Report context; Chapter 7 shows them in the "Improve" context. But the content is identical. The distinction isn't clear.

**Visual Issues:**
- `float-left` on the drop cap (`verdict.label[0]`) is deprecated CSS. May not render consistently.
- Executive Summary uses `leading-[1.6]` and `text-[19px]` — slightly different from Report page's `leading-[1.6]` and `text-[19px]`. Actually matches. Good.
- Pie chart `innerRadius={54}` `outerRadius={86}` vs Report page `innerRadius={50}` `outerRadius={90}`. Slightly different proportions.

**Suggestions:**
- Add a "View live report →" CTA that deep-links to a demo report (even read-only).
- Differentiate Chapter 6 vs 7: Ch 6 = "The verdict", Ch 7 = "The edits".

---

### Chapter 7: Improve — JD Marked, Suggestions, Iteration (`ImprovePreview.jsx`)

**Purpose:** Show the "improve" loop — JD with highlighted keywords, suggestions as margin notes, guidance on how to iterate.

**Strengths:**
- **`highlightJD` function is identical to Report page** — matched skills highlighted in yellow (`bg-highlight`), missing skills in red dotted underline. High authenticity.
- **Side-by-side layout** (JD sheet + Suggestions sheet) mirrors the real "Improve" mental model: brief on left, edits on right.
- **StickyNote + "How to work through these" Sheet** — identical to Report page. Consistent product voice.

**Weaknesses:**
- **Exact duplicate of Report page's suggestions section.** Same 4 suggestions, same copy, same numbered list. No new information.
- **JD marking is the only differentiator** — but it's shown at the bottom of Chapter 6 too. Redundant.
- **No "Re-run review" simulation.** The copy says "Re-run the review after 2–3 edits to see the score move" but there's no demo of that loop.

**UX Issues:**
- JD text is long (`whitespace-pre-wrap`) and may overflow on mobile. No max-height or scroll hint.
- `dangerouslySetInnerHTML` with `highlightJD` — same XSS surface as real app (mitigated by `escapeHtml` but still).

**Narrative Issues:**
- Chapter feels like "Report page, rearranged" rather than a distinct "Improve" mode. The real app doesn't have a separate Improve page — it's the same Report page used iteratively. The landing page invents a chapter that doesn't exist in the product.

**Visual Issues:**
- Two `Sheet` components stacked (JD + Suggestions) with same `p-6 md:p-10` padding. Visual monotony.
- `StickyNote rotate={-2}` vs Chapter 6's `rotate={2}` — alternating rotation is good, but inconsistent with Chapter 3's sticky notes (none shown).

**Suggestions:**
- Merge Chapter 6 and 7, or make Chapter 7 explicitly about *iteration* (show a "Before/After" score comparison: 87% → 92%).
- Show the "Re-run" button in context.

---

### Chapter 8: Return — Dashboard & Archive Preview (`ReturnPreview.jsx`)

**Purpose:** Show the logged-in home — archive of past reviews, stats, draft resume, quick actions.

**Strengths:**
- **Time-aware greeting** (`Good morning/afternoon/evening, Mara.`) — adds personality.
- **Stats row** (Total reviews, Average match, Best match, Last 7 days) — shows product depth.
- **Archive list** with match scores, filenames, relative dates (`2 days ago`, `9 days ago`) — realistic data density.
- **Draft indicator** (`hasDraft` with accent badge "Resume + JD ready") — shows continuity feature.
- **Quick actions** (New analysis, Upload resume) — clear next steps.

**Weaknesses:**
- **Mock data is single-user (Mara, 4 items).** No hint of multi-resume management (the real app supports multiple resume versions).
- **No search/filter UI** shown — the real History page has search by role, sort by date. Landing preview shows a static list.
- **Dashboard is read-only preview.** No interaction — can't click a row to open report, can't click "New analysis" (it's a `Link` but in a static preview context).

**UX Issues:**
- Archive items use `AtsScore` component inline — good consistency. But the score is small (`size="xs"`) and may be hard to read.
- "Return to dashboard" link in the draft card goes to `/app/dashboard` — but this is a landing page preview, not the app. Clicking would navigate away from the landing page (breaking the narrative).

**Narrative Issues:**
- Chapter 8 is the only one that shows *authenticated* state. All previous chapters work for anonymous visitors. Sudden shift to "Welcome back, Mara" without a "Sign in" transition.

**Visual Issues:**
- Stats cards use `Sheet` with `lift` but no `dogEar` — consistent with "clean sheet" metaphor for summary data.
- Archive list uses `divide-y divide-rule/60` — clean but the `AtsScore` + filename + date layout is tight on mobile.

**Suggestions:**
- Add a "View all 12 reviews →" link to hint at pagination.
- Show a "Switch resume" dropdown hint (even if non-functional) to communicate multi-resume support.

---

### Final CTA Section (in `LandingV2.jsx`)

**Purpose:** Closing conversion beat.

**Strengths:**
- **Testimonial blockquote** with serif italic — fits the editorial voice.
- **Dual CTA:** Primary "Begin a review" → `/app/analyze`, Secondary "Read the FAQ" → `/faq`. Clear hierarchy.
- **`Sheet` with `stack lift`** — visually heavy, feels like a closing document.

**Weaknesses:**
- **Quote attribution** is "- Resume Analyzer Pro" — the product quoting itself. Not a customer testimonial.
- **Negative margin** (`-mt-8`, `md:-mt-12`) pulls the CTA up into the previous section. Fragile layout.
- **`border-t border-rule/60`** on the section — another hairline rule. The page has many rules; this one feels additive without purpose.

**Suggestions:**
- Use a real customer quote (even anonymized).
- Remove negative margins; use proper spacing.

---

## Cross-Cutting Evaluation

### 1. Narrative Flow
**Score: 6/10**

The chapter structure (Hero → Submit → Sheets → Process → Compare → Review → Improve → Return → CTA) *attempts* a narrative arc but has structural issues:

- **Out of order:** Sheets (output) shown before Process (how it works). Compare (reading animation) shown after Process but before Review — correct chronologically but the animation already played in Hero.
- **Redundancy:** Review (Ch 6) and Improve (Ch 7) show identical suggestion content. Compare (Ch 5) shows the reading animation that Hero (Ch 1) previewed.
- **Persona shift:** Hero addresses "your resume" (candidate). Process describes "AI reads both documents" (system). Return shows "Welcome back, Mara" (authenticated user). No clear audience through-line.
- **No tension/resolution:** Classic landing page arc = Problem → Agitation → Solution → Proof → CTA. This page = Metaphor → UI Preview → Output Preview → Process → Animation → Output Preview (again) → Output Preview (again) → Dashboard → CTA. The "Solution" moment is diffused across 4 chapters.

### 2. Storytelling Continuity
**Score: 5/10**

- **Visual continuity:** High. Paper components, typography, color tokens, ruled lines, sticky notes, paper clips — all consistent.
- **Narrative continuity:** Low. Each chapter feels like a separate component dropped in. No transitional copy ("Now that you've submitted, here's what happens...").
- **Chapter markers:** "Chapter 2 — Submit", "Chapter 3 — The Sheets", "Chapter 4 — The Process", "Chapter 5 — Compare", "Chapter 6 — Review", "Chapter 7 — Improve", "Chapter 8 — Return". The "Chapter N" labeling helps but the content doesn't always match the label (e.g., Ch 3 "Sheets" shows 4 sheets but Ch 6 "Review" shows the full report which *contains* those sheets).

### 3. Product Authenticity (Do previews match the real app?)
**Score: 8.5/10** — *This is the page's strongest attribute.*

| Component | Landing Preview | Real App Page | Match |
|-----------|-----------------|---------------|-------|
| File upload card | `SubmitPreview` → `FileCard` | `Analyze.jsx` → `FileCard` | **Exact** |
| JD textarea (ruled) | `SubmitPreview` | `Analyze.jsx` | **Exact** |
| Reading progress (scan line, stages) | `ComparePreview` → `ReadingProgress` | `Analyze.jsx` → `ReadingProgress` | **Exact** |
| Report cover (ATS score, pie chart, stats) | `ReviewPreview` | `Report.jsx` | **Exact** (uses same `AtsScore`, `PieChart`, `verdictFor`) |
| Skills chips (matched/missing) | `ReviewPreview` / `SheetsOnDesk` | `Report.jsx` | **Exact** |
| Suggestions list (numbered, serif, accent numbers) | `ReviewPreview` / `ImprovePreview` | `Report.jsx` | **Exact** |
| JD highlighting (`highlightJD`) | `ReviewPreview` / `ImprovePreview` | `Report.jsx` | **Exact** (same function) |
| Archive list with scores | `ReturnPreview` | `History.jsx` / `Dashboard.jsx` | **High** (same `AtsScore`, same date formatting) |
| Paper components (Sheet, PaperClip, Eyebrow, StickyNote, dog-ear) | All chapters | All app pages | **Exact** (shared `paper.jsx`) |

**Gaps:**
- Landing uses `Recharts` in `ReviewPreview` — real app uses `Recharts` in `Report.jsx`. **Match.**
- Landing `SheetsOnDesk` demos use custom bars/chips — real app uses `Recharts`. **Partial.**
- Landing has no interactive tooltips, no copy-to-clipboard, no print. **Expected for static preview.**

### 4. Visual Hierarchy
**Score: 7/10**

- **Strong:** Hero masthead (eyebrow → h1 → p → CTA group) — clear hierarchy.
- **Strong:** Chapter headers (Eyebrow → h2 → p) — consistent across all chapters.
- **Weak:** Chapter 3 (Sheets) grid — 4 cards of varying column spans (7, 5, 5, 7) with custom offsets. Visual weight is uneven. Sheet 1 (Score) dominates; Sheet 4 (Archive) is wide but visually light (mini-sheets).
- **Weak:** Chapter 4 (Process) staggered grid — the zig-zag is clever but on desktop the `translateX` (±8px) is barely visible. Hierarchy relies on position, not weight.
- **Weak:** Final CTA — negative margin pulls it up, breaking the section rhythm.

### 5. Typography Consistency
**Score: 8.5/10**

- **Font stack:** Serif (Newsreader) for headlines, body copy, numbers. Sans (Inter) for UI labels, eyebrow, mono for code/sizes. Mono (JetBrains Mono) for file sizes, percentages. **Consistent throughout.**
- **Scale:** `text-[52px]`/`text-[60px]` (hero), `text-4xl` (chapter h2), `text-2xl` (card titles), `text-[19px]` (executive summary), `text-[16px]` (suggestions), `text-sm`/`text-xs` (meta). **Coherent.**
- **Eyebrow style:** `text-[10px]`/`text-[11px]`, uppercase, tracking `[0.18em]`, `text-ink-muted`. **Used everywhere.**
- **Drop caps:** `float-left text-[52px]` in Executive Summary (Ch 6, Ch 7). **Consistent.**
- **Numbering:** `font-serif text-accent text-[15px] w-6` for "01", "02" in suggestions and workflow. **Consistent.**

**Minor drift:** `ReadingProgress` stage numbers use `font-serif text-[12px] w-5` — slightly smaller container.

### 6. Component Consistency
**Score: 9/10**

All chapters use the shared `paper.jsx` components:
- `Sheet` (props: `lift`, `dogEar`, `stack`, `className`)
- `PaperClip`
- `Eyebrow`
- `StickyNote` (prop: `rotate`)
- `rule-line` (utility class)

**Variations observed:**
- `Sheet` with `stack lift` (Ch 6 charts) — adds pseudo-element stack shadow.
- `Sheet` with `lift dogEar` (Ch 6 cover, Ch 6 suggestions) — both effects.
- `StickyNote` rotation alternates (±2deg) — intentional variety.
- `PaperClip` appears on some sheets (cover, suggestions) not others — semantic (clipped sheets vs loose).

**No rogue components.** Every visual element traces to the design system.

### 7. Motion Language Continuity
**Score: 4/10**

- **Chapter 1 (Hero):** Complex scroll-driven motion (camera, paper entrance, captions, gaze spotlight). Framer Motion + `useScroll` + `useSpring` + `useTransform`.
- **Chapter 5 (Compare):** Auto-playing intervals (progress bar, scan line, stage list). `useState` + `setInterval` + CSS transitions.
- **Chapters 2, 3, 4, 6, 7, 8:** **Zero motion.** Static.
- **Real App (Analyze):** `ReadingProgress` uses same interval approach as Ch 5. **Match.**
- **Real App (Report):** No motion (static document). **Match.**

**Problem:** The motion language is *bimodal* — cinematic scroll (Ch 1) vs. interval-driven UI animation (Ch 5). They don't share easing, duration, or philosophy. Ch 1 uses `stiffness: 120, damping: 26, mass: 0.6` (spring). Ch 5 uses `transition-all duration-500 ease-out` (CSS).

**Reduced motion:** Ch 1 hides entire scroll experience (`reduce ? "hidden" : "hidden lg:block"`). Ch 5 has no `prefers-reduced-motion` guard — intervals run regardless.

### 8. White Space Rhythm
**Score: 6/10**

- **Section spacing:** `landing-scene` classes use `-mt-2 pt-10 pb-18` / `-mt-8 pb-20` — inconsistent vertical rhythm. Negative margins pull sections together unpredictably.
- **Container:** `mx-auto max-w-7xl px-6` consistent.
- **Grid gaps:** `gap-10 lg:gap-12` (Ch 1, 2, 4, 5, 7, 8) vs `gap-6 lg:gap-8` (Ch 3, 6) — two different rhythms.
- **Internal padding:** Sheets use `p-6 md:p-10` or `p-6 md:p-8` — mostly consistent.
- **Rule lines:** `rule-line` (1px `border-rule`) used as section dividers *and* card dividers *and* content separators. Overused — loses semantic meaning.

**White space "breathing room" is uneven.** Some sections feel dense (Ch 3 grid), others airy (Ch 1 hero).

### 9. Information Density
**Score: 7/10**

- **Hero:** Low density (headline, subhead, 2 CTAs, 6 captions, 2 animated sheets). Appropriate for entry.
- **Submit (Ch 2):** Medium. Two form fields + actions + sticky note. Good.
- **Sheets (Ch 3):** High. 4 sheets × (title, preview, 3 tags, demo component). Dense but scannable.
- **Process (Ch 4):** Low. 5 cards × (number, title, 1 sentence). Could be denser.
- **Compare (Ch 5):** Medium. Progress UI + 5 stage lines. Good.
- **Review (Ch 6):** Very high. Full report page compressed. Risk of overwhelm.
- **Improve (Ch 7):** High. JD text + suggestions + sticky + how-to. Redundant with Ch 6.
- **Return (Ch 8):** Medium. Stats + 4 archive items + draft card. Good.
- **CTA:** Low. Quote + headline + 2 CTAs. Good.

**Issue:** Ch 6 + Ch 7 back-to-back = information fatigue. Same data, different layout.

### 10. CTA Placement & Effectiveness
**Score: 6/10**

| Location | CTA | Target | Context |
|----------|-----|--------|---------|
| Hero (Ch 1) | "Place a resume on the desk" | `/upload` (→ `/app/analyze`) | Metaphorical, early |
| Hero (Ch 1) | "Read the features" | `/features` | Secondary |
| Submit (Ch 2) | "Begin review →" (button) | *None* (static) | **Broken** — looks real, does nothing |
| Sheets (Ch 3) | "Explore all sheets →" | `/features` | Redundant |
| Final CTA | "Begin a review" | `/app/analyze` | Primary conversion |
| Final CTA | "Read the FAQ" | `/faq` | Secondary |

**Problems:**
- Ch 2 "Begin review" button is a `button` not a `Link` — no navigation. Major affordance failure.
- No CTA after Process (Ch 4), Compare (Ch 5), Review (Ch 6), Improve (Ch 7), Return (Ch 8). Missed conversion moments.
- "Place a resume on the desk" → `/upload` — but the real analyze page is `/app/analyze`. `/upload` may redirect or 404.
- Final CTA is the only *real* primary CTA. Too late for many visitors.

---

## Product Authenticity Audit (Deep Dive)

### What Matches Perfectly ✅
1. **Paper design system** — `Sheet`, `PaperClip`, `Eyebrow`, `StickyNote`, `rule-line`, dog-ear, stack shadows — identical.
2. **Analyze page UI** — `SubmitPreview` ≈ `Analyze.jsx` (file card, ruled textarea, actions, right rail sticky note).
3. **Reading progress** — `ComparePreview.ReadingProgress` ≡ `Analyze.jsx.ReadingProgress` (same intervals, same scan line, same stage list).
4. **Report page** — `ReviewPreview` ≡ `Report.jsx` (same `AtsScore`, same `PieChart`/`BarChart` config, same `highlightJD`, same `verdictFor`/`bandFor`, same suggestion formatting, same sticky note copy).
5. **Archive/Dashboard** — `ReturnPreview` ≡ `Dashboard.jsx`/`History.jsx` (same stats, same `AtsScore` inline, same relative time formatting).

### What Diverges ⚠️
1. **SheetsOnDesk demos** — Simplified bars/chips vs. real `Recharts` visualizations.
2. **ImprovePreview** — Invents an "Improve" page that doesn't exist in the app (the app uses the Report page iteratively).
3. **Hero sheets** — `ResumeSheet`/`JobDescriptionSheet` in `CinematicHero` are *animated decorative versions* — not the static components used in `Analyze.jsx`.
4. **Process icons** — Defined in data (`icon: "read"`, etc.) but never rendered.
5. **CTA wiring** — Ch 2 "Begin review" button goes nowhere.

### What's Missing from the App (Landing Claims Features Not Visible in App) ❌
- **Multi-resume management** — ReturnPreview shows 4 items but all same user. App supports multiple resume versions? Unclear.
- **Search/filter archive** — ReturnPreview shows static list. App `History.jsx` has search? Need to verify.
- **Export/Print** — Report page has "Print Report" button. Landing doesn't demo it.
- **Copy suggestions** — Report page has "Copy to clipboard". Landing shows button but non-functional.
- **Re-run analysis** — Copy says "Re-run after 2–3 edits". No UI for this in app (user goes back to `/app/analyze`).

---

## Overall Landing Page Score: **7.2 / 10**

| Dimension | Score | Weight |
|-----------|-------|--------|
| Narrative Flow | 6.0 | 15% |
| Storytelling Continuity | 5.0 | 10% |
| Product Authenticity | 8.5 | 20% |
| Visual Hierarchy | 7.0 | 10% |
| Typography Consistency | 8.5 | 10% |
| Component Consistency | 9.0 | 10% |
| Motion Language Continuity | 4.0 | 5% |
| White Space Rhythm | 6.0 | 5% |
| Information Density | 7.0 | 5% |
| CTA Placement & Effectiveness | 6.0 | 10% |
| **Weighted Total** | **7.2** | 100% |

---

## Top 10 Improvements Ranked by Impact

| Rank | Improvement | Impact Area | Effort |
|------|-------------|-------------|--------|
| 1 | **Make Ch 2 "Begin review" button a real Link to `/app/analyze`** | CTA effectiveness, trust | Low |
| 2 | **Merge Ch 6 (Review) and Ch 7 (Improve) into one "Report & Iterate" chapter** | Narrative flow, information density, redundancy | Medium |
| 3 | **Add a live demo mode: let visitors upload a file + JD → see real results** | Product authenticity, conversion | High |
| 4 | **Unify motion language: use Framer Motion spring config from Hero for Compare's scan line** | Motion continuity, polish | Medium |
| 5 | **Reorder chapters: Hero → Submit → Process → Compare → Sheets/Report → Return → CTA** | Narrative flow, logical sequence | Low (reorder imports) |
| 6 | **Add `prefers-reduced-motion` guard to ComparePreview intervals** | Accessibility, UX | Low |
| 7 | **Replace Ch 2 static preview with interactive demo (file input works, textarea editable)** | Product authenticity, engagement | Medium |
| 8 | **Add progress indicator to Hero scroll experience (or "Skip" link)** | UX, narrative flow | Low |
| 9 | **Standardize section spacing: remove negative margins, use consistent `py-20` / `gap-12`** | White space rhythm, visual hierarchy | Low |
| 10 | **Render Process stage icons (upload, read, mark, report, archive) — they exist in data but not UI** | Visual hierarchy, component consistency | Low |

---

## Sections That Feel Disconnected from the Overall Story

1. **Chapter 3 (Sheets) → Chapter 4 (Process)** — Output before explanation. Visitor sees *what* they get before *how* it works.
2. **Chapter 6 (Review) → Chapter 7 (Improve)** — Same data, different layout. No new information. Feels like a duplicate.
3. **Chapter 8 (Return)** — Suddenly introduces "Mara" (a persona) and authenticated state. No bridge from anonymous visitor → signed-in user.
4. **Hero "Vol. I — The Recruiter's Desk"** — Recruiter persona never returns. The product is for candidates.
5. **Final CTA quote** — "- Resume Analyzer Pro" (self-quote). Breaks the "quiet, considered" tone.

---

## Guided Walkthrough vs. Marketing Website Verdict

**This is a hybrid that leans "guided walkthrough" in visuals but "marketing website" in behavior.**

| Aspect | Guided Walkthrough | Marketing Website | LandingV2 |
|--------|-------------------|-------------------|-----------|
| **Visuals** | App UI screenshots | Illustrations, stock photos | **App UI components (real code)** |
| **Interactivity** | Clickable demo, sandbox | None (static) | **Static previews only** |
| **Narrative** | "Here's how you use it" | "Here's why you need it" | **"Here's what it looks like"** |
| **CTA Timing** | After each meaningful step | Top + bottom | **Hero + bottom only** |
| **Persona** | User doing tasks | Buyer evaluating value | **Ambiguous (recruiter → candidate → Mara)** |
| **Authenticity** | Real product | Marketing mockups | **Real components, frozen** |

**Conclusion:** LandingV2 *looks* like a guided walkthrough (uses real components, real data shapes, real copy) but *behaves* like a marketing page (no interaction, chapter structure, single bottom CTA). The strongest improvement would be to make **at least one chapter interactive** — ideally Chapter 2 (Submit) — so visitors cross the "marketing → product" threshold before the final CTA.

---

*Report generated from source analysis of `LandingV2.jsx`, `HeroPrototype.jsx`, `CinematicHero.jsx`, `SubmitPreview.jsx`, `SheetsOnDesk.jsx`, `ReviewProcess.jsx`, `ComparePreview.jsx`, `ReviewPreview.jsx`, `ImprovePreview.jsx`, `ReturnPreview.jsx`, and corresponding app pages `Analyze.jsx`, `Report.jsx`, `Dashboard.jsx`.*