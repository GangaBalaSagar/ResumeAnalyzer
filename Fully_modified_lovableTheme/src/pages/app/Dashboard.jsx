import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../../components/paper.jsx";
import AtsScore from "../../components/app/AtsScore.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useReport } from "../../contexts/ReportContext.jsx";
import api from "../../api.js";

/**
 * Dashboard — the command center of Resume Analyzer Pro.
 *
 * Reuses only existing paper primitives (Sheet, PaperClip, StickyNote,
 * Eyebrow) and the shared AppLayout container. No new visual patterns.
 *
 * Data source: GET /analyses (same contract as the Archive page). Stats
 * are derived client-side from that list so no new backend surface is
 * introduced.
 *
 * Information hierarchy, top-to-bottom:
 *   1. Continue working  →  masthead + resume-in-progress banner
 *   2. Recent activity   →  filed sheets ledger
 *   3. Statistics        →  running totals card
 *   4. Helpful shortcuts →  workflow sticky notes + quick actions
 */

const LS_JD_KEY = "ra_jd_v1";
const LS_LAST_RESULT = "ra_last_result_v1";

function greetingFor(hour) {
  if (hour < 5) return "Still at the desk";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function firstName(user) {
  const meta = user?.user_metadata || {};
  const full = meta.full_name || meta.name || "";
  if (full) return String(full).trim().split(/\s+/)[0];
  if (user?.email) return String(user.email).split("@")[0];
  return "friend";
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

function fmtRelative(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.round(d / 30);
  return `${mo} mo ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentReportId } = useReport();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState({ jd: "", lastResult: null });

  function handleOpenReport(id) {
    if (id) {
      setCurrentReportId(id);
    }
    navigate("/app/report");
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/analyses");
        if (!alive) return;
        setItems(res.data?.items ?? []);
        setError(null);
      } catch (err) {
        if (!alive) return;
        setError(err?.response?.data?.error || err?.message || "Could not read the archive.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Read the "continue working" hints written by the Analyze page.
  useEffect(() => {
    try {
      const jd = localStorage.getItem(LS_JD_KEY) || "";
      const raw = localStorage.getItem(LS_LAST_RESULT);
      const lastResult = raw ? JSON.parse(raw) : null;
      setDraft({ jd, lastResult });
    } catch {
      setDraft({ jd: "", lastResult: null });
    }
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const scores = items
      .map((d) => (typeof d.matchPercent === "number" ? d.matchPercent : null))
      .filter((n) => n !== null);
    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
    const best = scores.length ? Math.max(...scores) : null;
    const now = new Date();
    const last7 = items.filter((d) => {
      const t = new Date(d.createdAt).getTime();
      return now.getTime() - t < 7 * 24 * 3600 * 1000;
    }).length;
    return { total, avg, best, last7 };
  }, [items]);

  const recent = items.slice(0, 5);
  const hour = new Date().getHours();
  const hello = greetingFor(hour);
  const name = firstName(user);
  const hasDraft = Boolean(draft.jd?.trim() || draft.lastResult);

  return (
    <div className="space-y-10">
      {/* 1 — Welcome / Continue working */}
      <header>
        <Eyebrow>The desk · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</Eyebrow>
        <h1 className="mt-3 font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight">
          {hello}, <span className="italic font-normal">{name}.</span>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-muted max-w-xl">
          Your desk is tidy. Pick up where you left off, or open a new folder and
          run a fresh analysis.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* MAIN COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Continue working */}
          <Sheet className="relative p-6 md:p-8" lift dogEar>
            <PaperClip />
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div>
                <Eyebrow>Continue working</Eyebrow>
                <div className="mt-2 font-serif text-2xl leading-tight">
                  {hasDraft ? "A draft is still on the desk" : "The desk is clear"}
                </div>
              </div>
              <span className="hidden md:block eyebrow text-[10px]">
                {hasDraft ? "auto-saved" : "ready when you are"}
              </span>
            </div>
            <div className="rule-line my-5" />

            {hasDraft ? (
              <div className="grid md:grid-cols-2 gap-6">
                {draft.lastResult && (
                  <div>
                    <div className="eyebrow text-[10px]">Last analysis</div>
                    <div className="mt-1 font-serif text-[18px] leading-tight truncate">
                      {draft.lastResult.resumeFilename || draft.lastResult.filename || "Untitled document"}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2 text-sm text-ink-muted">
                      <span className="eyebrow text-[10px]">Match</span>
                      <AtsScore
                        value={
                          typeof draft.lastResult.matchPercent === "number"
                            ? draft.lastResult.matchPercent
                            : null
                        }
                        size="sm"
                      />
                    </div>
                    <button
                      onClick={() => handleOpenReport(draft.lastResult?.id)}
                      className="mt-3 inline-block story-link text-sm"
                    >
                      Reopen the report →
                    </button>
                  </div>
                )}
                {draft.jd?.trim() && (
                  <div className="min-w-0">
                    <div className="eyebrow text-[10px]">Job description in progress</div>
                    <div className="mt-1 font-serif italic text-[14.5px] leading-snug text-ink-muted line-clamp-3">
                      "{draft.jd.trim().slice(0, 220)}
                      {draft.jd.trim().length > 220 ? "…" : ""}"
                    </div>
                    <Link
                      to="/app/analyze"
                      className="mt-3 inline-block story-link text-sm"
                    >
                      Keep drafting →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <p className="text-[14.5px] text-ink-muted max-w-md leading-relaxed font-serif italic">
                  No open folders. Upload a resume and a job description to begin a fresh analysis.
                </p>
                <Link
                  to="/app/analyze"
                  className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
                >
                  Begin a new analysis →
                </Link>
              </div>
            )}
          </Sheet>

          {/* 2 — Recent activity */}
          <Sheet className="relative p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <Eyebrow>The ledger · recent analyses</Eyebrow>
                <div className="mt-2 font-serif text-2xl leading-tight">
                  Filed this week
                </div>
              </div>
              <Link
                to="/app/history"
                className="eyebrow text-[10px] hover:text-ink text-ink-muted"
              >
                Open the archive →
              </Link>
            </div>
            <div className="rule-line my-5" />

            {error && (
              <div className="border-l-2 border-destructive/60 bg-destructive/5 pl-4 pr-4 py-3 text-sm font-serif italic text-destructive">
                {error}
              </div>
            )}

            {!error && loading && (
              <div className="py-10 text-center text-sm text-ink-muted italic font-serif">
                Loading the cabinet…
              </div>
            )}

            {!error && !loading && recent.length === 0 && (
              <div className="py-10 text-center">
                <div className="mx-auto w-14 h-16 relative opacity-70">
                  <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[-5deg]" />
                  <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[3deg] translate-x-1" />
                </div>
                <div className="mt-4 font-serif text-[17px]">Nothing filed yet.</div>
                <div className="mt-1 text-sm text-ink-muted">
                  Your first analysis will land here.
                </div>
                <Link
                  to="/app/analyze"
                  className="mt-5 inline-block text-sm px-4 py-2 border border-ink/20 hover:border-ink/60 rounded-sm transition-colors"
                >
                  Analyze a resume
                </Link>
              </div>
            )}

            {!error && !loading && recent.length > 0 && (
              <ul className="divide-y divide-rule">
                {recent.map((d) => (
                  <li key={d._id} className="py-4 flex items-center gap-4">
                    {/* Mini document glyph */}
                    <div className="relative h-11 w-9 shrink-0">
                      <div className="absolute inset-0 bg-paper border border-rule shadow-paper rounded-[2px]" />
                      <div className="absolute top-1.5 left-1.5 right-1.5 h-px bg-rule" />
                      <div className="absolute top-3 left-1.5 right-3 h-px bg-rule" />
                      <div className="absolute top-4.5 left-1.5 right-2 h-px bg-rule" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-[16px] leading-tight truncate">
                        {d.resumeFilename || "Untitled"}
                      </div>
                      <div className="text-[12px] text-ink-muted font-mono">
                        {fmtDate(d.createdAt)} · {fmtRelative(d.createdAt)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <AtsScore value={d.matchPercent} size="sm" />
                      <button
                        onClick={() => handleOpenReport(d._id)}
                        className="mt-1 inline-block eyebrow text-[10px] text-ink-muted hover:text-ink"
                      >
                        Open
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Sheet>
        </div>

        {/* RIGHT RAIL */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* 3 — Statistics */}
          <Sheet className="relative p-6">
            <Eyebrow>Running totals</Eyebrow>
            <div className="mt-2 font-serif text-xl leading-tight">The desk, in numbers</div>
            <div className="rule-line my-4" />

            <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
              <StatCell label="Analyses filed" value={stats.total} />
              <StatCell label="Analyzed this week" value={stats.last7} />
              <StatCell
                label="Average match"
                value={stats.avg === null ? "—" : `${stats.avg}%`}
                accent
              />
              <StatCell
                label="Best match"
                value={stats.best === null ? "—" : `${stats.best}%`}
              />
            </dl>

            <div className="rule-line mt-6" />
            <div className="mt-3 text-[11px] text-ink-muted italic font-serif">
              Totals refresh each time you open the desk.
            </div>
          </Sheet>

          {/* Editor's note — reuses StickyNote as the workflow signpost */}
          <StickyNote rotate={-2}>
            <div className="text-[13.5px] leading-snug">
              <div className="eyebrow text-[10px]">Desk note</div>
              <div className="mt-1 font-serif">
                Two job descriptions beat one guess. Compare the same resume against two
                roles to see where it truly fits.
              </div>
            </div>
          </StickyNote>

          {/* 4 — Quick actions / shortcuts */}
          <Sheet className="relative p-6">
            <Eyebrow>Shortcuts</Eyebrow>
            <div className="rule-line mt-3 mb-4" />
            <ul className="space-y-3 text-sm">
              <ShortcutRow
                to="/app/analyze"
                num="01"
                title="New analysis"
                hint="Drop a resume, paste a JD"
              />
              <ShortcutRow
                to="/app/history"
                num="02"
                title="Past analyses"
                hint="Every analysis, filed and dated"
              />
              <ShortcutRow
                onClick={() => handleOpenReport(draft.lastResult?.id)}
                num="03"
                title="Latest report"
                hint="Reopen the most recent analysis"
                muted={!draft.lastResult}
              />
              <ShortcutRow
                to="/faq"
                num="04"
                title="How the desk works"
                hint="Frequently asked questions"
              />
            </ul>
          </Sheet>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------
 * These are tiny presentation-only helpers scoped to Dashboard. They compose
 * existing tokens (font-serif, text-accent, eyebrow, story-link) rather than
 * introducing new visual patterns, so they don't warrant their own file.
 * -------------------------------------------------------------------------- */

function StatCell({ label, value, accent = false }) {
  return (
    <div>
      <dt className="eyebrow text-[10px]">{label}</dt>
      <dd
        className={`mt-1 font-serif leading-none ${
          accent ? "text-accent text-[34px]" : "text-ink text-[28px]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function ShortcutRow({ to, onClick, num, title, hint, muted = false }) {
  const className = `group flex items-baseline gap-3 py-1 -mx-2 px-2 rounded-sm transition-colors hover:bg-secondary/50 w-full text-left ${
    muted ? "opacity-70" : ""
  }`;

  const content = (
    <>
      <span className="font-serif text-[13px] text-ink-muted/70 w-5 shrink-0">
        {num}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-[15px] text-ink group-hover:text-accent transition-colors">
          {title}
        </span>
        <span className="block text-[12px] text-ink-muted">{hint}</span>
      </span>
      <span className="text-ink-muted/60 group-hover:text-ink transition-colors">→</span>
    </>
  );

  return (
    <li>
      {onClick ? (
        <button type="button" onClick={onClick} className={className} disabled={muted}>
          {content}
        </button>
      ) : (
        <Link to={to} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}
