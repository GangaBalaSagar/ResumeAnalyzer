import { Sheet, PaperClip, Eyebrow, StickyNote } from "../../components/paper.jsx";
import AtsScore, { bandFor, verdictFor } from "../../components/app/AtsScore.jsx";

const MOCK_REPORT = {
  matchPercent: 87,
  matchedSkills: ["React", "JavaScript", "Node.js", "REST APIs", "Figma", "Design Systems"],
  missingSkills: ["TypeScript", "Testing", "Docker", "GraphQL"],
  suggestions: [
    "Add TypeScript experience to improve alignment with the role's technical requirements.",
    "Include unit and integration testing examples to address the missing testing skill.",
    "Highlight containerization and deployment experience with Docker.",
    "Reframe two bullets to lead with quantified impact rather than responsibilities.",
  ],
  jobDescription: "We are looking for a Senior Product Designer to join our team. You will build user interfaces with React and JavaScript, and design backend services with Node.js and REST APIs. Additionally, we expect experience with TypeScript, unit Testing, and containerization using Docker.",
  resumeFilename: "Mara_Designer_Resume.pdf",
  createdAt: new Date().toISOString(),
};

function ScoreRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="eyebrow text-[10px]">{label}</dt>
      <dd className="font-serif text-[22px] text-ink leading-none">{value}</dd>
    </div>
  );
}

function MetaRow({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{k}</dt>
      <dd className="font-serif text-ink">{v}</dd>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="text-xs text-ink-muted">{label}</span>
    </span>
  );
}

export default function ReviewPreview() {
  const report = MOCK_REPORT;
  const jd = MOCK_REPORT.jobDescription;
  const filename = MOCK_REPORT.resumeFilename;
  const filedAt = new Date(MOCK_REPORT.createdAt);
  const matchPercent = MOCK_REPORT.matchPercent;
  const matched = MOCK_REPORT.matchedSkills;
  const missing = MOCK_REPORT.missingSkills;
  const suggestions = MOCK_REPORT.suggestions;
  const jdWords = jd.trim().split(/\s+/).length;
  const totalSkills = matched.length + missing.length;
  const coverage = totalSkills ? Math.round((matched.length / totalSkills) * 100) : 0;
  const verdict = verdictFor(matchPercent);
  const band = bandFor(matchPercent);

  const pieData = [
    { name: "Match", value: matchPercent },
    { name: "Gap", value: Math.max(0, 100 - matchPercent) },
  ];
  const PIE_COLORS = ["var(--color-accent)", "var(--color-rule)"];

  const barData = [
    { name: "Matched", count: matched.length },
    { name: "Missing", count: missing.length },
  ];

  return (
    <section className="landing-scene landing-scene--review relative -mt-8 pb-20 md:-mt-12 md:pb-24 border-t border-rule/60">
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        {/* Section intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Eyebrow>Chapter 4 · Review</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              The report
              <br />
              <span className="italic font-normal">opens on your desk.</span>
            </h2>
            <p className="mt-5 text-ink-muted text-[15px] leading-relaxed max-w-md">
              Cover sheet. Executive summary. Evidence. Charts. Suggestions.
              The full brief, marked. Every claim traceable to a line.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {/* 1 — Cover Sheet / ATS Match Score */}
            <Sheet className="relative p-6 md:p-10 overflow-hidden" lift dogEar>
              <PaperClip />
              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-12 md:col-span-4 text-center md:text-left">
                  <Eyebrow>ATS match score</Eyebrow>
                  <div className="mt-3">
                    <AtsScore value={matchPercent} size="xl" />
                  </div>
                  <div className="mt-3 text-sm text-ink-muted font-serif italic">
                    {band} · <span className="text-ink not-italic font-normal">{verdict.label}</span>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 h-52">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                      <circle
                        cx="100"
                        cy="100"
                        r="86"
                        stroke="var(--color-rule)"
                        strokeWidth="32"
                        fill="none"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="86"
                        stroke="var(--color-accent)"
                        strokeWidth="32"
                        fill="none"
                        strokeDasharray={`${(matchPercent / 100) * 540} 540`}
                        strokeDashoffset="135"
                        strokeLinecap="round"
                        style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px" }}
                      />
                      <text
                        x="100"
                        y="108"
                        textAnchor="middle"
                        fontFamily="var(--font-serif)"
                        fontSize="48"
                        fill="var(--color-ink)"
                        fontWeight="bold"
                      >
                        {matchPercent}%
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <dl className="space-y-4">
                    <ScoreRow label="Matched skills" value={matched.length} />
                    <ScoreRow label="Missing skills" value={missing.length} />
                    <ScoreRow label="Keyword coverage" value={`${coverage}%`} />
                    <ScoreRow label="JD length" value={`${jdWords} words`} />
                  </dl>
                </div>
              </div>
            </Sheet>

            {/* 2 — Executive Summary */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              <Sheet className="col-span-12 lg:col-span-8 relative p-6 md:p-10" lift>
                <Eyebrow>Executive Summary</Eyebrow>
                <div className="rule-line mt-3 mb-5" />
                <p className="font-serif text-[19px] leading-[1.6] text-ink">
                  <span className="float-left font-serif text-[52px] leading-[0.85] mr-2 mt-1 text-accent">
                    {verdict.label[0]}
                  </span>
                  {verdict.note} The document covers{" "}
                  <span className="text-ink">{matched.length}</span> of the{" "}
                  <span className="text-ink">{totalSkills}</span> skills the brief calls out —
                  a coverage of <span className="text-accent">{coverage}%</span>. The gaps below
                  are where a careful edit can move the score.
                </p>
              </Sheet>

              <div className="col-span-12 lg:col-span-4 space-y-6">
                <StickyNote rotate={2}>
                  <div className="text-[13.5px] leading-snug">
                    <div className="eyebrow text-[10px]">Verdict</div>
                    <div className="mt-1 font-serif text-lg">{verdict.label}</div>
                    <div className="mt-1 font-serif italic">{verdict.note}</div>
                  </div>
                </StickyNote>
                <Sheet className="relative p-6" lift>
                  <Eyebrow>At a glance</Eyebrow>
                  <div className="rule-line mt-3 mb-4" />
                  <dl className="space-y-3 text-sm">
                    <MetaRow k="Score band" v={band} />
                    <MetaRow k="Match" v={<AtsScore value={matchPercent} size="xs" />} />
                    <MetaRow k="Coverage" v={`${coverage}%`} />
                    <MetaRow k="Skills matched" v={matched.length} />
                    <MetaRow k="Skills missing" v={missing.length} />
                  </dl>
                </Sheet>
              </div>
            </div>

            {/* 3 — Skills Analysis */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              <Sheet className="col-span-12 lg:col-span-6 relative p-6 md:p-8" lift>
                <div className="flex items-baseline justify-between">
                  <Eyebrow>Matched skills · On the page</Eyebrow>
                  <span className="eyebrow text-[10px]">{matched.length}</span>
                </div>
                <div className="rule-line mt-3 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {matched.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-sm bg-accent/10 text-ink border border-accent/30"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Sheet>

              <Sheet className="col-span-12 lg:col-span-6 relative p-6 md:p-8" lift>
                <div className="flex items-baseline justify-between">
                  <Eyebrow>Missing skills · To add</Eyebrow>
                  <span className="eyebrow text-[10px]">{missing.length}</span>
                </div>
                <div className="rule-line mt-3 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {missing.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-sm bg-destructive/10 text-destructive border border-destructive/30"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Sheet>
            </div>

            {/* 4 — Charts */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              <Sheet className="col-span-12 lg:col-span-6 relative p-6 md:p-8" stack lift>
                <Eyebrow>Match percentage</Eyebrow>
                <div className="rule-line mt-3 mb-2" />
                <div className="h-64 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" width="100%" height="100%">
                    <circle cx="100" cy="100" r="70" stroke="var(--color-rule)" strokeWidth="20" fill="none" />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      stroke="var(--color-accent)"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${(matchPercent / 100) * 440} 440`}
                      strokeDashoffset="110"
                      strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px" }}
                    />
                    <text x="100" y="108" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="36" fill="var(--color-ink)" fontWeight="bold">
                      {matchPercent}%
                    </text>
                  </svg>
                </div>
                <div className="mt-2 flex items-center justify-center gap-6 text-xs text-ink-muted">
                  <LegendDot color="var(--color-accent)" label={`Match · ${matchPercent}%`} />
                  <LegendDot color="var(--color-rule)" label={`Gap · ${100 - matchPercent}%`} />
                </div>
              </Sheet>

              <Sheet className="col-span-12 lg:col-span-6 relative p-6 md:p-8" lift>
                <Eyebrow>Skills overview</Eyebrow>
                <div className="rule-line mt-3 mb-2" />
                <div className="h-64 flex items-end justify-center gap-4 px-4">
                  <div className="flex-1 max-w-[120px] flex flex-col items-center">
                    <div
                      className="w-full bg-accent rounded-t-[2px] transition-all duration-500"
                      style={{ height: `${(matched.length / totalSkills) * 100}%`, minHeight: "20px" }}
                    />
                    <div className="mt-2 text-center">
                      <div className="font-serif text-[14px] text-ink">{matched.length}</div>
                      <div className="eyebrow text-[10px]">Matched</div>
                    </div>
                  </div>
                  <div className="flex-1 max-w-[120px] flex flex-col items-center">
                    <div
                      className="w-full bg-ink-muted rounded-t-[2px] transition-all duration-500"
                      style={{ height: `${(missing.length / totalSkills) * 100}%`, minHeight: "20px" }}
                    />
                    <div className="mt-2 text-center">
                      <div className="font-serif text-[14px] text-ink">{missing.length}</div>
                      <div className="eyebrow text-[10px]">Missing</div>
                    </div>
                  </div>
                </div>
              </Sheet>
            </div>

            {/* 5 — Suggestions */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8 relative">
              <Sheet className="col-span-12 lg:col-span-8 relative p-6 md:p-10" dogEar stack lift>
                <PaperClip />
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <Eyebrow>Suggestions · Margin notes</Eyebrow>
                  <span className="text-xs text-ink-muted">Copy to clipboard</span>
                </div>
                <div className="rule-line mt-3 mb-6" />
                <ol className="space-y-5">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-serif text-accent text-[15px] w-6 shrink-0 mt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-serif text-[16px] leading-[1.65] text-ink flex-1">{s}</p>
                    </li>
                  ))}
                </ol>
              </Sheet>

              <aside className="col-span-12 lg:col-span-4 space-y-6">
                <StickyNote rotate={-2}>
                  <div className="text-[13.5px] leading-snug">
                    <div className="eyebrow text-[10px]">A note in the margin</div>
                    <div className="mt-1 font-serif">
                      Read these as edits, not orders. Keep your voice — the AI suggests, you decide.
                    </div>
                  </div>
                </StickyNote>
                <Sheet className="relative p-6" lift>
                  <Eyebrow>How to work through these</Eyebrow>
                  <div className="rule-line mt-3 mb-4" />
                  <ol className="space-y-3 text-sm">
                    {[
                      "Start with any suggestion that fixes a missing skill.",
                      "Reword one bullet at a time — don't rewrite whole sections.",
                      "Re-run the review after 2–3 edits to see the score move.",
                    ].map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-serif text-ink-muted/70 w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-ink-muted">{t}</span>
                      </li>
                    ))}
                  </ol>
                </Sheet>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}