import { Sheet, PaperClip, Eyebrow, StickyNote } from "../../components/paper.jsx";
import AtsScore from "../../components/app/AtsScore.jsx";
import { Link } from "react-router-dom";

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
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
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

const MOCK_ITEMS = [
  { _id: "1", resumeFilename: "Mara_Designer_Resume.pdf", matchPercent: 87, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "2", resumeFilename: "Mara_Eng_Resume.pdf", matchPercent: 72, createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "3", resumeFilename: "Mara_PM_Resume.pdf", matchPercent: 91, createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "4", resumeFilename: "Mara_Designer_v2_Resume.pdf", matchPercent: 83, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
];

const stats = {
  total: 12,
  avg: 78,
  best: 92,
  last7: 3,
};

function greetingFor(hour) {
  if (hour < 5) return "Still working";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function ReturnPreview() {
  const hour = new Date().getHours();
  const hello = greetingFor(hour);
  const name = "Mara";
  const hasDraft = true;

  return (
    <section className="landing-scene landing-scene--return relative -mt-8 pb-20 md:-mt-12 md:pb-24 border-t border-rule/60">
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        <header>
          <Eyebrow>Chapter 6 · Return</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight">
            {hello}, <span className="italic font-normal">{name}.</span>
          </h2>
          <p className="mt-5 text-ink-muted text-[15px] leading-relaxed max-w-xl">
            Your archive is tidy. Pick up where you left off, or open a new folder
            and run a fresh review.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* MAIN COLUMN */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Continue working */}
            <Sheet className="relative p-4 md:p-6" lift dogEar>
              <PaperClip />
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <Eyebrow>Continue working</Eyebrow>
                  <div className="mt-2 font-serif text-2xl leading-tight">
                    A draft is still in progress
                  </div>
                </div>
                <span className="hidden md:block eyebrow text-[10px]">auto-saved</span>
              </div>
              <div className="rule-line my-3" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="eyebrow text-[10px]">Last review</div>
                  <div className="mt-1 font-serif text-[18px] leading-tight truncate">
                    Mara_Designer_Resume.pdf
                  </div>
                  <div className="mt-1 flex items-baseline gap-2 text-sm text-ink-muted">
                    <span className="eyebrow text-[10px]">Match</span>
                    <AtsScore value={87} size="sm" />
                  </div>
                  <button className="mt-3 inline-block story-link text-sm">
                    Reopen the report →
                  </button>
                </div>
                <div className="min-w-0">
                  <div className="eyebrow text-[10px]">Job description in progress</div>
                  <div className="mt-1 font-serif italic text-[14.5px] leading-snug text-ink-muted line-clamp-3">
                    "We are looking for a Senior Product Designer to join our team. You will lead design for core product surfaces..."
                  </div>
                  <Link to="/app/analyze" className="mt-3 inline-block story-link text-sm">
                    Keep drafting →
                  </Link>
                </div>
              </div>
            </Sheet>

            {/* Recent activity */}
            <Sheet className="relative p-4 md:p-6" lift>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <Eyebrow>Recent activity</Eyebrow>
                  <div className="mt-2 font-serif text-2xl leading-tight">
                    Filed this week
                  </div>
                </div>
                <Link to="/app/history" className="eyebrow text-[10px] hover:text-ink text-ink-muted">
                  Open the archive →
                </Link>
              </div>
              <div className="rule-line my-3" />

              <ul className="divide-y divide-rule">
                {MOCK_ITEMS.slice(0, 3).map((d) => (
                  <li key={d._id} className="py-4 flex items-center gap-4">
                    <div className="relative h-11 w-9 shrink-0">
                      <div className="absolute inset-0 bg-paper border border-rule shadow-paper rounded-[2px]" />
                      <div className="absolute top-1.5 left-1.5 right-1.5 h-px bg-rule" />
                      <div className="absolute top-3 left-1.5 right-3 h-px bg-rule" />
                      <div className="absolute top-4.5 left-1.5 right-2 h-px bg-rule" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-[16px] leading-tight truncate">
                        {d.resumeFilename}
                      </div>
                      <div className="text-[12px] text-ink-muted font-mono">
                        {fmtDate(d.createdAt)} · {fmtRelative(d.createdAt)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <AtsScore value={d.matchPercent} size="sm" />
                      <button className="mt-1 inline-block eyebrow text-[10px] text-ink-muted hover:text-ink">
                        Open
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Sheet>
          </div>

          {/* RIGHT RAIL */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            {/* Statistics */}
            <Sheet className="relative p-4" lift>
              <Eyebrow>Running totals</Eyebrow>
              <div className="mt-2 font-serif text-xl leading-tight">Reviews at a glance</div>
              <div className="rule-line my-3" />

              <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <dt className="eyebrow text-[10px]">Reviews filed</dt>
                  <dd className="mt-1 font-serif text-ink text-[28px]">{stats.total}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-[10px]">This week</dt>
                  <dd className="mt-1 font-serif text-ink text-[28px]">{stats.last7}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-[10px]">Average match</dt>
                  <dd className="mt-1 font-serif text-accent text-[34px]">{stats.avg}%</dd>
                </div>
                <div>
                  <dt className="eyebrow text-[10px]">Best match</dt>
                  <dd className="mt-1 font-serif text-ink text-[28px]">{stats.best}%</dd>
                </div>
              </dl>

              <div className="rule-line mt-6" />
              <div className="mt-3 text-[11px] text-ink-muted italic font-serif">
                Totals update automatically as new reviews are added.
              </div>
            </Sheet>

            {/* Editor's note */}
            <StickyNote rotate={-2}>
              <div className="text-[13.5px] leading-snug">
                <div className="eyebrow text-[10px]">Note</div>
                <div className="mt-1 font-serif">
                  Two job descriptions beat one guess. Compare the same resume against two
                  roles to see where it truly fits.
                </div>
              </div>
            </StickyNote>

            {/* Quick actions */}
            <Sheet className="relative p-4" lift>
              <Eyebrow>Shortcuts</Eyebrow>
              <div className="rule-line mt-2 mb-3" />
              <ul className="space-y-3 text-sm">
                <Link
                  to="/app/analyze"
                  className="group flex items-baseline gap-3 py-1 -mx-2 px-2 rounded-sm transition-colors hover:bg-secondary/50 w-full text-left"
                >
                  <span className="font-serif text-[13px] text-ink-muted/70 w-5 shrink-0">01</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[15px] text-ink group-hover:text-accent transition-colors">
                      New review
                    </span>
                    <span className="block text-[12px] text-ink-muted">Upload a resume and paste a job description</span>
                  </span>
                  <span className="text-ink-muted/60 group-hover:text-ink transition-colors">→</span>
                </Link>
                <Link
                  to="/app/history"
                  className="group flex items-baseline gap-3 py-1 -mx-2 px-2 rounded-sm transition-colors hover:bg-secondary/50 w-full text-left"
                >
                  <span className="font-serif text-[13px] text-ink-muted/70 w-5 shrink-0">02</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[15px] text-ink group-hover:text-accent transition-colors">
                      Past reviews
                    </span>
                    <span className="block text-[12px] text-ink-muted">Every review, filed and dated</span>
                  </span>
                  <span className="text-ink-muted/60 group-hover:text-ink transition-colors">→</span>
                </Link>
                <Link
                  to="/app/report"
                  className="group flex items-baseline gap-3 py-1 -mx-2 px-2 rounded-sm transition-colors hover:bg-secondary/50 w-full text-left"
                >
                  <span className="font-serif text-[13px] text-ink-muted/70 w-5 shrink-0">03</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[15px] text-ink group-hover:text-accent transition-colors">
                      Latest report
                    </span>
                    <span className="block text-[12px] text-ink-muted">Reopen the most recent analysis</span>
                  </span>
                  <span className="text-ink-muted/60 group-hover:text-ink transition-colors">→</span>
                </Link>
                <Link
                  to="/faq"
                  className="group flex items-baseline gap-3 py-1 -mx-2 px-2 rounded-sm transition-colors hover:bg-secondary/50 w-full text-left"
                >
                  <span className="font-serif text-[13px] text-ink-muted/70 w-5 shrink-0">04</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[15px] text-ink group-hover:text-accent transition-colors">
                      How it works
                    </span>
                    <span className="block text-[12px] text-ink-muted">Frequently asked questions</span>
                  </span>
                  <span className="text-ink-muted/60 group-hover:text-ink transition-colors">→</span>
                </Link>
              </ul>
            </Sheet>
          </aside>
        </div>
      </div>
    </section>
  );
}