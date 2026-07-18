import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../../components/paper.jsx";
import AtsScore, { bandFor, verdictFor } from "../../components/app/AtsScore.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useReport } from "../../contexts/ReportContext.jsx";
import api from "../../api.js";

/**
 * Report — the signature "expertly reviewed document" experience.
 *
 * Data contract (preserved from the uploaded Resume Analyzer Pro):
 *   localStorage["ra_last_result_v1"] = {
 *     ...res.data,            // { analysis: {...}, ... }
 *     jobDescription: string,
 *   }
 *   analysis = {
 *     matchPercent, matchedSkills[], missingSkills[],
 *     suggestions (string | string[]),
 *     resumeSummary? (string),
 *   }
 *
 * This page does not mutate the payload, does not touch ReportContext,
 * and does not call any new API endpoints — it only reads the same
 * stored result the Analyze flow already writes.
 */

const LS_LAST_RESULT = "ra_last_result_v1";

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function highlightJD(jd, matched, missing) {
  if (!jd) return "";
  const esc = (arr) =>
    arr.filter(Boolean).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matchedEsc = esc(matched).sort((a, b) => b.length - a.length);
  const missingEsc = esc(missing).sort((a, b) => b.length - a.length);
  let html = escapeHtml(jd);
  if (matchedEsc.length) {
    const re = new RegExp(`\\b(${matchedEsc.join("|")})\\b`, "gi");
    html = html.replace(re, (m) => `<mark class="bg-highlight px-0.5 rounded-sm">${m}</mark>`);
  }
  if (missingEsc.length) {
    const re = new RegExp(`\\b(${missingEsc.join("|")})\\b`, "gi");
    html = html.replace(
      re,
      (m) =>
        `<mark class="bg-destructive/10 text-destructive underline decoration-destructive/40 decoration-dotted px-0.5 rounded-sm">${m}</mark>`
    );
  }
  return html;
}

function suggestionsToList(s) {
  if (!s) return [];
  if (Array.isArray(s)) return s.filter(Boolean).map(String);
  // Split on newlines or numbered/bulleted list markers, keep it forgiving.
  return String(s)
    .split(/\n+/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

const DEMO_REPORT = {
  matchPercent: 87,
  matchedSkills: ["React", "JavaScript", "Node.js", "REST APIs"],
  missingSkills: ["TypeScript", "Testing", "Docker"],
  suggestions: [
    "Add TypeScript experience to improve alignment.",
    "Include unit and integration testing examples.",
    "Highlight containerization and deployment experience."
  ],
  jobDescription: "We are looking for a Senior React Developer to join our team. You will build user interfaces with React and JavaScript, and design backend services with Node.js and REST APIs. Additionally, we expect experience with TypeScript, unit Testing, and containerization using Docker.",
  resumeFilename: "demo_resume_frontend.pdf",
  createdAt: new Date().toISOString()
};

export default function Report() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentReportId } = useReport();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      setPayload(DEMO_REPORT);
      setError(null);
      setLoading(false);
      return;
    }

    if (!currentReportId) {
      try {
        const raw = localStorage.getItem(LS_LAST_RESULT);
        if (raw) {
          setPayload(JSON.parse(raw));
          setError(null);
          setLoading(false);
          return;
        }
      } catch {}
      setPayload(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .get(`/analyses/${currentReportId}`)
      .then((res) => {
        if (!isMounted) return;
        setPayload(res.data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setPayload(null);
        setError(err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentReportId, user]);

  const result = payload?.analysis || payload;
  const jd = payload?.jobDescription ?? "";
  const filename =
    payload?.resumeFilename || payload?.filename || result?.resumeFilename || "Untitled document";
  const filedAt = payload?.createdAt ? new Date(payload.createdAt) : new Date();

  const matchPercent = Math.max(0, Math.min(100, result?.matchPercent ?? 0));
  const matched = result?.matchedSkills ?? [];
  const missing = result?.missingSkills ?? [];
  const suggestions = useMemo(() => suggestionsToList(result?.suggestions), [result]);
  const suggestionsText = useMemo(
    () => (Array.isArray(result?.suggestions) ? result.suggestions.join("\n") : String(result?.suggestions || "")),
    [result]
  );
  const resumeSummary =
    result?.resumeSummary ||
    result?.summary ||
    payload?.resumeSummary ||
    "";

  const jdWords = useMemo(() => (jd.trim() ? jd.trim().split(/\s+/).length : 0), [jd]);
  const totalSkills = matched.length + missing.length;
  const coverage = totalSkills ? Math.round((matched.length / totalSkills) * 100) : 0;
  const verdict = verdictFor(matchPercent);
  const band = bandFor(matchPercent);

  async function copySuggestions() {
    try {
      await navigator.clipboard.writeText(suggestionsText || suggestions.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <Sheet className="relative p-6" lift>
          <PaperClip />
          <Eyebrow>One moment</Eyebrow>
          <div className="mt-2 font-serif text-2xl">Loading the report…</div>
          <div className="rule-line my-5" />
          <p className="text-sm text-ink-muted">
            We are fetching the analysis details from the archives.
          </p>
        </Sheet>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <Sheet className="relative p-6" lift>
          <PaperClip />
          <Eyebrow>Trouble</Eyebrow>
          <div className="mt-2 font-serif text-2xl">Unable to load report</div>
          <div className="rule-line my-5" />
          <p className="text-sm text-ink-muted mb-6">
            We couldn't load this analysis right now. This can happen if the report was deleted, the link is invalid, or the network request failed.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors"
            >
              Retry
            </button>
            <Link
              to="/app/dashboard"
              className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </Sheet>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <Sheet className="relative p-6" lift>
          <PaperClip />
          <Eyebrow>No analysis yet</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl">No analysis to open yet.</h1>
          <p className="mt-4 text-ink-muted">
            Upload a resume and paste a job description to begin a new analysis.
          </p>
          <Link
            to="/app/analyze"
            className="inline-block mt-8 px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90"
          >
            Begin an analysis →
          </Link>
        </Sheet>
      </div>
    );
  }

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
    <div className="space-y-10 report-root">

      {!user && (
        <Sheet className="relative p-6 md:p-8 border border-accent/20 bg-accent/5 landing-feature-card" lift>
          <PaperClip />
          <Eyebrow>Demo Report</Eyebrow>
          <h2 className="font-serif text-2xl mt-2 mb-3">This is a sample ATS analysis.</h2>
          <p className="text-[15px] leading-relaxed text-ink-muted mb-6">
            Sign in to analyze your resume, generate personalized reports, and track your progress over time.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors bg-paper"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
            >
              Create an account
            </button>
          </div>
        </Sheet>
      )}

{/* Masthead — treat the page like a document cover */}
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <Eyebrow>Evaluation Report · Ready for Review</Eyebrow>
          <h1 className="mt-3 font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight">
            A close, <span className="italic font-normal">considered</span> analysis.
          </h1>
          <p className="mt-4 text-[14.5px] text-ink-muted font-mono">
            <span className="text-ink">{filename}</span>
            <span className="mx-2 text-ink-muted/50">·</span>
            Filed{" "}
            {filedAt.toLocaleString(undefined, {
              month: "short", day: "numeric", year: "numeric",
              hour: "numeric", minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/app/analyze"
            className="px-4 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
          >
            New Analysis →
          </Link>
        </div>
      </header>

      {/* 1 — Overall Match Score: the "cover" of the report */}
      <Sheet className="relative p-4 md:p-6 overflow-hidden landing-feature-card" lift dogEar>
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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={54}
                  outerRadius={86}
                  stroke="var(--color-paper)"
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-paper)",
                    border: "1px solid var(--color-rule)",
                    borderRadius: 2,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
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
        <Sheet className="col-span-12 lg:col-span-8 relative p-4 md:p-6 landing-feature-card" lift>
          <Eyebrow>Executive Summary</Eyebrow>
          <div className="rule-line mt-3 mb-5" />
          <p className="font-serif text-[19px] leading-[1.6] text-ink">
            <span className="float-left font-serif text-[52px] leading-[0.85] mr-2 mt-1 text-accent">
              {verdict.label[0]}
            </span>
            {resumeSummary || (
              <>
                {verdict.note} The document covers{" "}
                <span className="text-ink">{matched.length}</span> of the{" "}
                <span className="text-ink">{totalSkills}</span> skills the brief calls out —
                a coverage of <span className="text-accent">{coverage}%</span>. The gaps below
                are where a careful edit can move the score.
              </>
            )}
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
          <Sheet className="relative p-4 landing-feature-card" lift>
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
        <Sheet className="col-span-12 lg:col-span-6 relative p-4 md:p-6 landing-feature-card" lift>
          <div className="flex items-baseline justify-between">
            <Eyebrow>Matched skills · On the page</Eyebrow>
            <span className="eyebrow text-[10px]">{matched.length}</span>
          </div>
          <div className="rule-line mt-3 mb-4" />
          {matched.length === 0 ? (
            <p className="text-sm text-ink-muted italic font-serif">
              None of the brief's skills appear on the page.
            </p>
          ) : (
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
          )}
        </Sheet>

        <Sheet className="col-span-12 lg:col-span-6 relative p-4 md:p-6 landing-feature-card" lift>
          <div className="flex items-baseline justify-between">
            <Eyebrow>Missing skills · To add</Eyebrow>
            <span className="eyebrow text-[10px]">{missing.length}</span>
          </div>
          <div className="rule-line mt-3 mb-4" />
          {missing.length === 0 ? (
            <p className="text-sm text-ink-muted italic font-serif">
              Nothing missing — the page covers the role.
            </p>
          ) : (
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
          )}
        </Sheet>
      </div>

      {/* 4 — Charts */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <Sheet className="col-span-12 lg:col-span-6 relative p-4 md:p-6 landing-feature-card" stack lift>
          <Eyebrow>Match percentage</Eyebrow>
          <div className="rule-line mt-3 mb-2" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={90}
                  stroke="var(--color-paper)"
                  strokeWidth={2}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-paper)",
                    border: "1px solid var(--color-rule)",
                    borderRadius: 2,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-6 text-xs text-ink-muted">
            <LegendDot color="var(--color-accent)" label={`Match · ${matchPercent}%`} />
            <LegendDot color="var(--color-rule)" label={`Gap · ${100 - matchPercent}%`} />
          </div>
        </Sheet>

        <Sheet className="col-span-12 lg:col-span-6 relative p-4 md:p-6 landing-feature-card" lift>
          <Eyebrow>Skills overview</Eyebrow>
          <div className="rule-line mt-3 mb-2" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 12, right: 12, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-rule)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-ink-muted)" fontSize={11} tickLine={false} axisLine={{ stroke: "var(--color-rule)" }} />
                <YAxis stroke="var(--color-ink-muted)" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--color-secondary)" }}
                  contentStyle={{
                    background: "var(--color-paper)",
                    border: "1px solid var(--color-rule)",
                    borderRadius: 2,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  <Cell fill="var(--color-accent)" />
                  <Cell fill="var(--color-ink-muted)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Sheet>
      </div>

      {/* 5 — AI Suggestions */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8 relative">
        <Sheet className="col-span-12 lg:col-span-8 relative p-4 md:p-6 landing-feature-card" dogEar stack lift>
          <PaperClip />
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <Eyebrow>Suggestions · Margin notes</Eyebrow>
            <button
              type="button"
              onClick={copySuggestions}
              className="text-xs story-link"
            >
              {copied ? "Copied ✓" : "Copy to clipboard"}
            </button>
          </div>
          <div className="rule-line mt-3 mb-6" />
          {suggestions.length === 0 ? (
            <p className="text-sm text-ink-muted italic font-serif">
              No suggestions returned.
            </p>
          ) : (
            <ol className="space-y-5">
              {suggestions.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-serif text-accent text-[15px] w-6 shrink-0 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-serif text-[16px] leading-[1.65] text-ink flex-1">
                    {s}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Sheet>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <StickyNote rotate={-2}>
            <div className="text-[13.5px] leading-snug">
                <div className="eyebrow text-[10px]">A note in the margin</div>
                <div className="mt-1 font-serif">
                Read these as edits, not orders. Keep your voice — the AI suggests,
                you decide.
                </div>
            </div>
          </StickyNote>
          <Sheet className="relative p-4 landing-feature-card" lift>
            <Eyebrow>How to work through these</Eyebrow>
            <div className="rule-line mt-3 mb-4" />
            <ol className="space-y-3 text-sm">
              {[
                "Start with any suggestion that fixes a missing skill.",
                "Reword one bullet at a time — don't rewrite whole sections.",
                "Re-run the analysis after 2–3 edits to see the score move.",
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

      {/* 6 — Job Description comparison */}
      <Sheet className="relative p-4 md:p-6 ruled landing-feature-card" lift>
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>Job description · Keywords marked</Eyebrow>
            <div className="mt-2 font-serif text-2xl leading-tight">
              The brief, side by side
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <LegendDot color="var(--color-highlight)" label="On the page" square />
            <LegendDot color="var(--color-destructive)" label="Missing" square muted />
            <span className="font-mono">{jdWords} words</span>
          </div>
        </div>
        <div className="rule-line mt-4 mb-6" />
        {jd ? (
          <div
            className="text-[15px] leading-[28px] whitespace-pre-wrap text-ink font-serif"
            dangerouslySetInnerHTML={{ __html: highlightJD(jd, matched, missing) }}
          />
        ) : (
          <p className="text-sm text-ink-muted italic font-serif">
            No job description was saved with this analysis.
          </p>
        )}
      </Sheet>

      {/* Footer — closes the document like a signature line */}
      <footer className="pt-6 border-t border-rule/60 flex items-baseline justify-between text-xs text-ink-muted">
        <span className="font-serif italic">
        Prepared for review · Review 01
        </span>
        <span className="font-mono">
          Report · {filedAt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        </span>
      </footer>
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------
 * Presentation-only helpers scoped to Report. They compose existing tokens
 * (eyebrow, font-serif, text-accent, rule-line) rather than introducing new
 * visual patterns, so they stay in-file.
 * -------------------------------------------------------------------------- */

function ScoreRow({ label, value }) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-3 items-start">
      <dt className="eyebrow text-[10px]">{label}</dt>
      <dd className="font-serif text-[22px] text-ink leading-none">{value}</dd>
    </div>
  );
}

function MetaRow({ k, v, accent = false }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{k}</dt>
      <dd className={`font-serif ${accent ? "text-accent text-lg" : "text-ink"}`}>{v}</dd>
    </div>
  );
}

function LegendDot({ color, label, square = false, muted = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-block h-2.5 w-2.5 ${square ? "rounded-[1px]" : "rounded-full"}`}
        style={{ background: color, opacity: muted ? 0.6 : 1 }}
      />
      <span>{label}</span>
    </span>
  );
}
