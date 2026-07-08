import { Link } from "react-router-dom";
import PublicSite from "../components/public/PublicSite.jsx";
import { Sheet, StickyNote, Eyebrow, PaperClip } from "../components/paper.jsx";
import AtsScore from "../components/app/AtsScore.jsx";

export default function Landing() {
  return (
    <PublicSite>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 animate-fade-up">
          <Eyebrow>Vol. I · Resume meets role</Eyebrow>
          <h1 className="mt-6 font-serif text-[52px] md:text-[64px] leading-[1.02] tracking-tight">
            Your resume,
            <br />
            <span className="italic font-normal">matched to the role.</span>
          </h1>
          <p className="mt-7 text-[17px] leading-relaxed text-ink-muted max-w-xl">
            Drop a resume on the desk, paste the job description, and receive an
            AI-powered analysis — ATS match score, matched and missing skills,
            and targeted suggestions to improve your fit.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/app/analyze"
              className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
            >
              Start your analysis
            </Link>
            <Link
              to="/features"
              className="px-5 py-3 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm"
            >
              Explore the features
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-8 max-w-xl">
            {[
              { n: "01", t: "Match Score", d: "How closely the resume fits the role" },
              { n: "02", t: "Skills Gap", d: "Matched and missing keywords" },
              { n: "03", t: "AI Suggestions", d: "Targeted improvements for the role" },
            ].map((f) => (
              <div key={f.n}>
                <div className="font-serif text-2xl text-accent">{f.n}</div>
                <div className="mt-2 text-sm font-medium">{f.t}</div>
                <div className="mt-1 text-xs text-ink-muted">{f.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative h-[560px] hidden lg:block">
          <div className="absolute right-12 top-8 w-[320px] h-[440px] sheet sheet-lift dog-ear p-7 rotate-[3deg]">
            <PaperClip />
            <div className="eyebrow">Resume · Analysis №412</div>
            <div className="mt-3 font-serif text-xl leading-tight">Elena Marsh</div>
            <div className="text-xs text-ink-muted">Senior Product Designer</div>
            <div className="rule-line mt-4" />
            <div className="mt-6 eyebrow">Skills</div>
            <div className="mt-2 space-y-2">
              <div className="h-1.5 w-full bg-secondary rounded" />
              <div className="h-1.5 w-[80%] bg-secondary rounded" />
              <div className="h-1.5 w-[60%] bg-secondary rounded" />
              <div className="h-1.5 w-[90%] bg-secondary rounded" />
            </div>
            <div className="absolute bottom-6 right-7">
              <AtsScore value={92} size="md" />
            </div>
          </div>

          <StickyNote className="absolute left-2 top-72 w-[200px]">
            "Lead with outcomes — your impact line is buried under the role title."
          </StickyNote>

          <div className="absolute left-8 bottom-2 w-[220px] sheet p-4 rotate-[4deg]">
            <Eyebrow>Match · Senior PM</Eyebrow>
            <div className="mt-1"><AtsScore value={86} size="sm" /></div>
            <div className="mt-1 text-xs text-ink-muted">Strong on craft, light on metrics.</div>
          </div>
        </div>
      </section>

      {/* Value cards */}
      <section id="how" className="border-t border-rule/60 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <Eyebrow>The Workspace</Eyebrow>
              <h2 className="mt-4 font-serif text-4xl leading-tight">
                Resume, job description,<br />one clear result.
              </h2>
              <p className="mt-5 text-ink-muted text-[15px] leading-relaxed">
                Your resume is compared against the job description — skill by skill.
                Each analysis is laid out clearly, marked with insights, and filed
                in your archive.
              </p>
              <Link
                to="/features"
                className="story-link inline-block mt-6 text-sm text-ink"
              >
                Explore all features →
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { t: "Match Score", d: "A clear percentage: how closely your resume fits the role.", n: "01" },
                { t: "Skills Overview", d: "Matched and missing keywords, charted clearly.", n: "02" },
                { t: "AI Suggestions", d: "Specific edits, copyable, in plain language.", n: "03" },
                { t: "Archive", d: "Every analysis filed by date, ready to revisit.", n: "04" },
              ].map((c, i) => (
                <Sheet key={c.t} className="p-6" lift dogEar={i % 2 === 0}>
                  <div className="flex items-baseline justify-between">
                    <Eyebrow>Sheet № {c.n}</Eyebrow>
                  </div>
                  <div className="mt-3 font-serif text-2xl">{c.t}</div>
                  <p className="mt-2 text-sm text-ink-muted">{c.d}</p>
                  <div className="rule-line mt-6" />
                  <div className="mt-3 text-xs text-ink-muted">Filed under · Active analyses</div>
                </Sheet>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow — three-step reading */}
      <section className="py-20 md:py-24 border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <Eyebrow>The workflow</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              Three steps. Clear results.
            </h2>
            <p className="mt-4 text-ink-muted text-[15px] leading-relaxed">
              Upload a resume, paste the job description, and receive an ATS match
              score with actionable insights.
            </p>
          </div>

          <ol className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Upload the resume", d: "Drop a PDF or DOCX. Your document is parsed and prepared for analysis." },
              { n: "02", t: "Add the job description", d: "The role details the desk needs to compare against." },
              { n: "03", t: "Review your results", d: "ATS match score, matched and missing skills, and AI-powered suggestions." },
            ].map((s) => (
              <li key={s.n}>
                <Sheet className="p-6 h-full" lift>
                  <div className="font-serif text-3xl text-accent">{s.n}</div>
                  <div className="rule-line my-4" />
                  <div className="font-serif text-xl">{s.t}</div>
                  <p className="mt-2 text-sm text-ink-muted">{s.d}</p>
                </Sheet>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Editorial testimonial */}
      <section className="py-20 md:py-24 border-t border-rule/60">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Eyebrow>From the desk</Eyebrow>
          <blockquote className="mt-6 font-serif text-3xl md:text-4xl italic leading-snug text-ink">
            "Upload. Compare. Improve. The fastest way to know if your resume fits the role."
          </blockquote>
          <div className="mt-6 text-sm text-ink-muted">
            — The Recruiter's Desk
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 border-t border-rule/60">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Eyebrow>Begin</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-tight">
            Compare your resume to the role.
          </h2>
          <p className="mt-5 text-ink-muted max-w-xl mx-auto">
            One upload. One job description. An analysis you can act on.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
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
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </PublicSite>
  );
}
