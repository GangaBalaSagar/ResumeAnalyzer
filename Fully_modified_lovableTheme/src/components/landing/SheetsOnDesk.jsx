import { CanonicalPaper, Eyebrow, StickyNote, PaperClip } from "../../components/paper.jsx";
import { Link } from "react-router-dom";

const SHEETS = [
  {
    n: "01",
    title: "Match Score",
    preview: "How closely your resume fits the role — expressed as a single, clear number.",
    marks: ["Percentage fit", "Confidence range", "Role alignment"],
    demo: "ScoreDemo",
  },
  {
    n: "02",
    title: "Skills Overview",
    preview: "Matched and missing keywords, grouped by strength, ready to highlight.",
    marks: ["Grouped by strength", "Frequency counts", "Highlight-ready"],
    demo: "SkillsDemo",
  },
  {
    n: "03",
    title: "Suggestions",
    preview: "Specific line edits, in plain language, each attributable to a reason.",
    marks: ["Line-level edits", "Reasoned rewrites", "Copyable"],
    demo: "SuggestionsDemo",
  },
  {
    n: "04",
    title: "Archive",
    preview: "Every analysis filed by date, searchable by role, yours alone.",
    marks: ["Sortable by date", "Searchable by role", "Yours only"],
    demo: "ArchiveDemo",
  },
];

function ScoreDemo() {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <div className="text-3xl font-bold text-accent font-mono tabular-nums">87%</div>
        <div className="text-sm text-ink-muted font-serif italic">Strong</div>
      </div>
      <div className="mt-2 h-1.5 w-full bg-rule rounded overflow-hidden">
        <div className="h-full bg-accent transition-all duration-500" style={{ width: "87%" }} />
      </div>
    </div>
  );
}

function SkillsDemo() {
  const matched = ["React", "JavaScript", "Node.js", "REST APIs", "Product Strategy"];
  const missing = ["TypeScript", "Testing", "Docker"];
  return (
    <div className="mt-4 space-y-3">
      <div>
        <div className="eyebrow text-[10px]">Matched · 5</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {matched.map((s, i) => (
            <span key={s} className="px-2.5 py-1 text-xs rounded-sm bg-accent/10 text-ink border border-accent/30 anim-stagger" style={{ animationDelay: `${i * 80}ms` }}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="pt-2">
        <div className="eyebrow text-[10px]">Missing · 3</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {missing.map((s, i) => (
            <span key={s} className="px-2.5 py-1 text-xs rounded-sm bg-destructive/10 text-destructive border border-destructive/30 anim-missing" style={{ animationDelay: `${i * 80}ms` }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionsDemo() {
  const suggestions = [
    "Add quantified impact to your React achievements.",
    "Include TypeScript experience to close the gap.",
  ];
  return (
    <ol className="mt-4 space-y-3">
      {suggestions.map((s, i) => (
        <li key={i} className="flex gap-3 anim-suggestion" style={{ animationDelay: `${i * 120}ms` }}>
          <span className="font-serif text-accent text-[15px] w-6 shrink-0 mt-1">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="font-serif text-[16px] leading-[1.65] text-ink flex-1">{s}</p>
        </li>
      ))}
    </ol>
  );
}

function ArchiveDemo() {
  const entries = [
    { title: "Design roles", date: "May 24" },
    { title: "Eng roles", date: "Apr 24" },
    { title: "Product roles", date: "Mar 24" },
  ];
  return (
    <div className="mt-4 flex gap-2">
      {entries.map((entry, i) => (
        <div
          key={entry.title}
          className="sheet w-14 h-14 p-1.5 paper-fan mini-sheet"
          style={{ '--rot': `${i === 0 ? 0 : i === 1 ? 2 : -3}deg`, animationDelay: `${i * 100}ms` }}
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

export default function SheetsOnDesk() {
  return (
    <section id="sheets" className="landing-scene landing-scene--features relative -mt-2 pt-10 pb-18 md:-mt-4 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Eyebrow>The Workspace</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              Four sheets.
              <br />
              One desk.
            </h2>
            <p className="mt-5 text-ink-muted text-[15px] leading-relaxed max-w-md">
              Each review produces four sheets. They live on your desk, marked with
              evidence, and filed in your archive. Hover any sheet to see it lift.
            </p>
            <div className="mt-8 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              <span className="h-px flex-1 bg-rule/60" />
              <span>Hover a sheet to lift it</span>
            </div>
            <Link to="/features" className="story-link inline-block mt-6 text-sm text-ink">
              Explore all sheets {"->"}
            </Link>
          </div>

          <div className="lg:col-span-8">
            <div
              className="landing-field landing-field--cards landing-feature-grid grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start"
              data-focus-state="idle"
            >
              {SHEETS.map((sheet, index) => {
                const spanClasses =
                  index === 0
                    ? "md:col-span-7"
                    : index === 1
                    ? "md:col-span-5 md:mt-10"
                    : index === 2
                    ? "md:col-span-5"
                    : "md:col-span-7 md:mt-8";

                const dx = index - 1;
                const distance = Math.abs(dx) || 1;
                const translateX = `${Math.sign(dx) * Math.min(10, 6 * distance)}px`;
                const tilt = `${dx * 0.45}deg`;

                const DemoComponent = {
                  ScoreDemo,
                  SkillsDemo,
                  SuggestionsDemo,
                  ArchiveDemo,
                }[sheet.demo];

                return (
                  <CanonicalPaper
                    key={sheet.title}
                    label={`Sheet - ${sheet.n}`}
                    title={sheet.title}
                    dogEar={index === 0}
                    className={`landing-feature-card ${spanClasses} ${index === 3 ? "pb-4 md:pb-4" : ""}`}
                    style={{
                      "--card-offset": index === 0 ? "0px" : index === 1 ? "1.1rem" : index === 2 ? "0.45rem" : "1.55rem",
                      "--card-translate-x": translateX,
                      "--card-tilt": tilt,
                    }}
                    data-focus={index === 1 ? "active" : index === 0 || index === 2 ? "adjacent" : "distant"}
                  >
                    <p className="landing-feature-card__copy mt-2 text-sm text-ink-muted">{sheet.preview}</p>
                    <div className="rule-line landing-feature-card__rule mt-6" />
                    <div className="landing-feature-card__meta mt-3 text-xs text-ink-muted">
                      Filed under - Active analyses
                    </div>
                    <DemoComponent />
                  </CanonicalPaper>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}