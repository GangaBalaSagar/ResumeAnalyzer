import { Link } from "react-router-dom";
import PublicSite, { PageIntro } from "../components/public/PublicSite.jsx";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../components/paper.jsx";
import React, { useState, useEffect, useRef } from "react";

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

/* Demo components for each feature */
function ScoreDemo({ active }) {
  const [score, setScore] = useState(0);
  const frameRef = useRef(null);
  const target = 87; // Example target score

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!active) {
      setScore(0);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    if (reduced) {
      setScore(target);
      return;
    }

    let start;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / 1000, 1);
      setScore(Math.round(percent * target));

      if (percent < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [active, target]);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold text-primary">{score}%</div>
      </div>
      <div className="confidence-bar" style={{ width: active ? `${score}%` : '0%' }} />
    </div>
  );
}

function SkillsDemo() {
  const skills = ["React", "Node.js", "CSS", "TypeScript"];
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span
          key={skill}
          className="feature-chip text-[11px] eyebrow px-2 py-1 border border-rule rounded-sm bg-secondary/40 anim-stagger"
          style={{ animationDelay: `${idx * 150}ms` }}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function MissingSkillsDemo() {
  const missing = ["GraphQL", "Docker", "AWS"];
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {missing.map((skill, idx) => (
        <span
          key={skill}
          className="feature-chip text-[11px] eyebrow px-2 py-1 border border-destructive rounded-sm bg-destructive/20 anim-missing"
          style={{ animationDelay: `${idx * 120}ms` }}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function SuggestionsDemo() {
  const suggestions = [
    "Add quantifiable impact to your achievements.",
    "Replace vague verbs with action-oriented words."
  ];
  return (
    <ul className="mt-2 list-disc list-inside text-sm text-ink-muted">
      {suggestions.map((s, idx) => (
        <li key={idx} className="anim-suggestion" style={{ animationDelay: `${idx * 150}ms` }}>{s}</li>
      ))}
    </ul>
  );
}

function JDPreviewDemo() {
  return (
    <p className="mt-2 text-sm text-ink-muted">
      We need a <span className="highlight">Full‑Stack Engineer</span> experienced with
      <span className="highlight">React</span>, <span className="highlight">Node.js</span>, and
      <span className="highlight">AWS</span>.
    </p>
  );
}

function ArchiveDemo() {
  const entries = [
    { title: "Design roles", date: "May 24" },
    { title: "Eng roles", date: "Apr 24" },
    { title: "Product roles", date: "Mar 24" },
  ];

  return (
    <div className="mt-2 flex gap-2">
      {entries.map((entry, idx) => (
        <div
          key={entry.title}
          className="sheet w-14 h-14 p-1.5 paper-fan mini-sheet"
          style={{ '--rot': `${idx === 0 ? 0 : idx === 1 ? 2 : -3}deg`, animationDelay: `${idx * 120}ms` }}
        >
          <div className="flex h-full flex-col justify-between rounded-[2px] border border-rule/70 bg-secondary/50 p-1.5">
            <div className="h-1.5 w-5 rounded-full bg-ink/15" />
            <div className="h-1.5 w-7 rounded-full bg-ink/10" />
            <div className="text-[7px] uppercase tracking-[0.18em] text-ink-muted">{entry.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureDemo({ title, active }) {
  switch (title) {
    case "Match Score":
      return <ScoreDemo active={active} />;
    case "Matched Skills":
      return <SkillsDemo />;
    case "Missing Skills":
      return <MissingSkillsDemo />;
    case "AI Suggestions":
      return <SuggestionsDemo />;
    case "JD Preview":
      return <JDPreviewDemo />;
    case "Private Archive":
      return <ArchiveDemo />;
    default:
      return null;
  }
}

export default function Features() {
  const [hovered, setHovered] = useState(null);
  const sizeClass = (title) => {
    switch (title) {
      case "Match Score":
        return "md:col-span-2";
      case "Matched Skills":
        return "md:row-span-2";
      default:
        return "";
    }
  };
  return (
    <PublicSite>
      <PageIntro
        eyebrow="Review 02 · Features"
        title="Everything the desk"
        italic="compares, marks, and files."
        lede="Six capabilities, one workspace. Each feature helps you compare your resume to a job description — clearly, precisely, and with actionable results."
      />

      {/* Feature sheets */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="landing-feature-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
{FEATURES.map((f, i) => (
            <React.Fragment key={f.n}>
              {i === 0 && (
                <div className="col-span-full mb-4">
                  <Eyebrow>Evaluation</Eyebrow>
                </div>
              )}
              {i === 2 && (
                <div className="col-span-full mb-4">
                  <Eyebrow>Analysis</Eyebrow>
                </div>
              )}
              {i === 4 && (
                <div className="col-span-full mb-4">
                  <Eyebrow>Output</Eyebrow>
                </div>
              )}
              <Sheet
                key={f.n}
                className={`relative p-7 md:p-8 ${sizeClass(f.title)} landing-feature-card`}
                lift
                dogEar={i % 3 === 0}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                data-focus={hovered === null ? undefined : hovered === i ? "active" : Math.abs(hovered - i) === 1 ? "adjacent" : "distant"}
              >
                {i % 4 === 0 && <PaperClip />}
                <div className="flex items-baseline justify-between gap-4">
                  <Eyebrow>Feature {f.n}</Eyebrow>
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
                <FeatureDemo title={f.title} active={hovered === i} />
              </Sheet>
            </React.Fragment>
          ))}

        </div>
      </section>

      {/* Cross-feature — how it fits together */}
      <section className="border-t border-rule/60 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <Eyebrow>How it fits together</Eyebrow>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-serif text-ink-muted">Resume</span>
                <span className="text-ink-muted">↓</span>
                <span className="font-serif text-ink-muted">Job Description</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-ink-muted">AI Analysis</span>
                <span className="text-ink-muted">↓</span>
                <span className="font-serif text-ink-muted">Results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-ink-muted">Archive</span>
              </div>
            </div>
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
            <Sheet className="relative p-8 md:p-10" dogEar lift>
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
      <section className="py-20 md:py-24 border-t border-rule/60 animate-fade-up">
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
