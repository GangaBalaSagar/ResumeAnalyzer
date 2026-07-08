import { Link } from "react-router-dom";
import PublicSite, { PageIntro } from "../components/public/PublicSite.jsx";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../components/paper.jsx";

const FEATURES = [
  {
    n: "01",
    title: "Match Score",
    lede: "How closely your resume fits the role — expressed as a single, clear number.",
    body: "The AI compares your resume to the job description and returns a match percentage grounded in keyword relevance, skill alignment, and role fit.",
    marks: ["Percentage fit", "Confidence range", "Role alignment"],
  },
  {
    n: "02",
    title: "Matched Skills",
    lede: "The keywords that appear on both pages, laid out clearly.",
    body: "See exactly which of the role's requirements the resume already speaks to. Matched skills are grouped by strength so you know what to lead with — and what to keep.",
    marks: ["Grouped by strength", "Frequency counts", "Highlight-ready"],
  },
  {
    n: "03",
    title: "Missing Skills",
    lede: "What the job asks for that the resume doesn't yet address.",
    body: "The analysis surfaces gaps without judgment: skills the role calls for that don't appear on the page. Add them if they're honestly yours, or use them to steer the next revision.",
    marks: ["Ranked by importance", "Grouped by theme", "Copyable list"],
  },
  {
    n: "04",
    title: "AI Suggestions",
    lede: "Specific line edits, in plain language, ready to paste.",
    body: "Not generic advice. The AI proposes concrete edits to specific lines — reframed bullets, sharper impact statements, missing quantifiers — each one attributable to a reason.",
    marks: ["Line-level edits", "Reasoned rewrites", "Copyable"],
  },
  {
    n: "05",
    title: "JD Preview",
    lede: "The job description, with matched and missing keywords highlighted.",
    body: "See the job description with matched keywords underlined and missing ones flagged in the margin. It's a side-by-side view of what's present and what's missing.",
    marks: ["Inline highlights", "Margin flags", "Print-friendly"],
  },
  {
    n: "06",
    title: "Private Archive",
    lede: "Every analysis, filed by date, ready to revisit.",
    body: "Nothing is public. Nothing is shared. Your past analyses live in a private archive on the desk — searchable by role, sortable by date, kept between visits.",
    marks: ["Sortable by date", "Searchable by role", "Yours only"],
  },
];

export default function Features() {
  return (
    <PublicSite>
      <PageIntro
        eyebrow="Vol. II · Features"
        title="Everything the desk"
        italic="compares, marks, and files."
        lede="Six capabilities, one workspace. Each feature helps you compare your resume to a job description — clearly, precisely, and with actionable results."
      />

      {/* Feature sheets */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map((f, i) => (
            <Sheet key={f.n} className="relative p-7 md:p-8" lift dogEar={i % 3 === 0}>
              {i % 4 === 0 && <PaperClip />}
              <div className="flex items-baseline justify-between gap-4">
                <Eyebrow>Sheet № {f.n}</Eyebrow>
                <span className="font-serif italic text-[13px] text-ink-muted">
                  Feature
                </span>
              </div>
              <div className="mt-3 font-serif text-[26px] leading-tight">
                {f.title}
              </div>
              <p className="mt-2 text-[15px] font-serif italic text-ink-muted">
                {f.lede}
              </p>
              <div className="rule-line my-5" />
              <p className="text-sm text-ink-muted leading-relaxed">{f.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {f.marks.map((m) => (
                  <li
                    key={m}
                    className="text-[11px] eyebrow px-2 py-1 border border-rule rounded-sm bg-secondary/40"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </Sheet>
          ))}
        </div>
      </section>

      {/* Cross-feature — how it fits together */}
      <section className="border-t border-rule/60 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <Eyebrow>How it fits together</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              One analysis,<br />many insights in the margin.
            </h2>
            <p className="mt-5 text-ink-muted text-[15px] leading-relaxed">
              Every feature draws from the same analysis. Change the resume, and
              the score, the matched skills, the missing skills, and the
              suggestions all update together — one document, one view.
            </p>
            <div className="mt-8">
              <StickyNote rotate={-2} className="max-w-sm">
                <div className="text-[13.5px] leading-snug">
                  "Compare the same resume against two different roles. The skill gaps tell you where each application stands."
                  <div className="mt-2 not-italic eyebrow text-[10px]">— A note from the desk</div>
                </div>
              </StickyNote>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Sheet className="relative p-8 md:p-10" dogEar>
              <PaperClip />
              <Eyebrow>House principles</Eyebrow>
              <div className="mt-2 font-serif text-2xl">Precise comparison, always.</div>
              <div className="rule-line my-5" />
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                {[
                  { t: "Private by default", d: "Your document never leaves your archive." },
                  { t: "Insightful, not opaque", d: "Line-level reasoning with clear, visible scores." },
                  { t: "Quiet interface", d: "No dashboards; only what needs reading." },
                  { t: "Reusable analyses", d: "Every analysis filed and returnable." },
                ].map((p) => (
                  <div key={p.t}>
                    <dt className="font-serif text-[17px]">{p.t}</dt>
                    <dd className="mt-1 text-ink-muted leading-relaxed">{p.d}</dd>
                  </div>
                ))}
              </dl>
            </Sheet>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 border-t border-rule/60">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Eyebrow>Begin</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-tight">
            See it on a resume of your own.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/app/analyze"
              className="px-6 py-3.5 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
            >
              Begin an analysis
            </Link>
            <Link
              to="/faq"
              className="px-6 py-3.5 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm"
            >
              Questions? Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </PublicSite>
  );
}
