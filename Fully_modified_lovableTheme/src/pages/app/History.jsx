import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../../components/paper.jsx";
import AtsScore, { bandFor } from "../../components/app/AtsScore.jsx";
import { useReport } from "../../contexts/ReportContext.jsx";
import api from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

/**
 * History — an archival cabinet of previously analyzed resumes.
 *
 * Data contracts (preserved exactly from the uploaded project):
 *   GET    /analyses         → { items: [{ _id, resumeFilename, matchPercent, createdAt, ... }] }
 *   GET    /analyses/:id     → full record (opened in the detail sheet)
 *   DELETE /analyses/:id     → removes a filed reading
 *
 * The original Archive did not ship with server-side search or pagination.
 * We add ONLY a client-side search and client-side pagination here —
 * no backend contracts change, no query params are introduced.
 *
 * Visual language: reuses the same primitives as Report/Dashboard so the
 * ATS score renders identically everywhere via <AtsScore>.
 */

const PAGE_SIZE = 8;

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function History() {
  const navigate = useNavigate();
  const { setCurrentReportId } = useReport();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogItem, setDeleteDialogItem] = useState(null);
  const { user } = useAuth();
  const loadGuard = useRef(false);
  const deleteTriggerRef = useRef(null);

  function handleViewReport(id) {
    if (id) {
      setCurrentReportId(id);
    }
    navigate("/app/report");
  }

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/analyses");
      setItems(res.data?.items ?? []);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Could not load past analyses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Clear state when unauthenticated
    if (!user) {
      setItems([]);
      setLoading(false);
      setError(null);
      setQuery("");
      setPage(1);
      setDeletingId(null);
      setDeleteDialogItem(null);
      loadGuard.current = false;
      return;
    }

    if (loadGuard.current) return;

    loadGuard.current = true;
    load();
  }, [user]);


  if (!user) {
    return <PublicArchiveEmptyState />;
  }

  function requestDelete(item, triggerRef) {
    deleteTriggerRef.current = triggerRef?.current || null;
    setDeleteDialogItem(item);
  }

  async function confirmDelete() {
    const item = deleteDialogItem;
    if (!item?._id) return;
    try {
      setDeletingId(item._id);
      setDeleteDialogItem(null);
      await api.delete(`/analyses/${item._id}`);
      setItems((cur) => cur.filter((x) => x._id !== item._id));
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Could not delete this record.");
    } finally {
      setDeletingId(null);
      deleteTriggerRef.current?.focus?.();
      deleteTriggerRef.current = null;
    }
  }

  function cancelDelete() {
    setDeleteDialogItem(null);
    deleteTriggerRef.current?.focus?.();
    deleteTriggerRef.current = null;
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((d) =>
      String(d.resumeFilename || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  useEffect(() => {
    // Reset to first page whenever the filter changes.
    setPage(1);
  }, [query]);

  const stats = useMemo(() => {
    const total = items.length;
    const scores = items
      .map((d) => (typeof d.matchPercent === "number" ? d.matchPercent : null))
      .filter((n) => n !== null);
    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
    const best = scores.length ? Math.max(...scores) : null;
    return { total, avg, best };
  }, [items]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <Eyebrow>Archive · Saved analyses</Eyebrow>
          <h1 className="mt-3 font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight">
            Filed, dated, <span className="italic font-normal">kept.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-xl">
            Every resume the desk has analyzed, stored in the cabinet. Open a folder to
            revisit the analysis, or clear a card you no longer need.
          </p>
        </div>
        <Link
          to="/app/analyze"
          className="px-4 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
        >
          New analysis →
        </Link>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* MAIN — the ledger */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Search + summary strip */}
          <Sheet className="relative p-5 md:p-6" lift>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <label className="block eyebrow text-[10px]">Search the cabinet</label>
                <div className="mt-2 flex items-center gap-3 border-b border-rule focus-within:border-ink transition-colors">
                  <SearchGlyph />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter by document name…"
                    className="flex-1 bg-transparent border-0 focus:outline-none text-[15px] font-serif py-2 placeholder:text-ink-muted/50"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="eyebrow text-[10px] text-ink-muted hover:text-ink"
                    >
                      clear
                    </button>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="eyebrow text-[10px]">Showing</div>
                <div className="mt-1 font-serif text-[22px] leading-none">
                  {filtered.length}
                  <span className="text-[13px] text-ink-muted/70 ml-1">
                    of {items.length}
                  </span>
                </div>
              </div>
            </div>
          </Sheet>

          {/* Error */}
          {error && (
            <div className="border-l-2 border-destructive/60 bg-destructive/5 pl-4 pr-4 py-3 text-sm font-serif italic text-destructive">
              {error}
              <div className="mt-1 text-[11px] text-ink-muted not-italic font-sans">
                Check that <code className="font-mono">VITE_API_URL</code> points at your backend.
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && !error && (
            <Sheet className="relative p-10" lift>
              <PaperClip />
              <Eyebrow>One moment</Eyebrow>
              <div className="mt-2 font-serif text-2xl">Loading the cabinet…</div>
              <div className="rule-line my-5" />
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-secondary/40 border border-rule rounded-sm animate-pulse"
                  />
                ))}
              </div>
            </Sheet>
          )}

          {/* Empty */}
          {!loading && !error && items.length === 0 && (
            <EmptyCabinet />
          )}

          {/* Empty (filtered) */}
          {!loading && !error && items.length > 0 && filtered.length === 0 && (
            <Sheet className="relative p-10 text-center" lift>
              <Eyebrow>No matching folder</Eyebrow>
              <div className="mt-2 font-serif text-xl">
                Nothing on file matches "{query}".
              </div>
              <button
                onClick={() => setQuery("")}
                className="mt-4 text-sm story-link"
              >
                Clear the search →
              </button>
            </Sheet>
          )}

          {/* The ledger */}
          {!loading && !error && paged.length > 0 && (
            <>
              <Sheet className="relative p-2 md:p-3" lift>
                <ul className="divide-y divide-rule">
                  {paged.map((d) => (
                    <ArchiveRow
                      key={d._id}
                      item={d}
                      active={false}
                      onOpen={() => handleViewReport(d._id)}
                      onDelete={(triggerRef) => requestDelete(d, triggerRef)}
                      deleting={deletingId === d._id}
                    />
                  ))}
                </ul>
              </Sheet>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  page={pageSafe}
                  totalPages={totalPages}
                  onChange={setPage}
                  windowStart={(pageSafe - 1) * PAGE_SIZE + 1}
                  windowEnd={Math.min(pageSafe * PAGE_SIZE, filtered.length)}
                  total={filtered.length}
                />
              )}
            </>
          )}
        </div>

        {/* RIGHT RAIL */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <Sheet className="relative p-6" lift>
            <Eyebrow>Cabinet totals</Eyebrow>
            <div className="mt-2 font-serif text-xl leading-tight">Archive summary</div>
            <div className="rule-line my-4" />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
              <StatCell label="Total filed" value={stats.total} />
              <StatCell label="Best match" value={stats.best === null ? "—" : `${stats.best}%`} accent />
              <StatCell label="Average" value={stats.avg === null ? "—" : `${stats.avg}%`} />
              <StatCell label="On this page" value={paged.length} />
            </dl>
          </Sheet>

          <StickyNote rotate={-2}>
            <div className="text-[13.5px] leading-snug">
              <div className="eyebrow text-[10px]">Cabinet note</div>
              <div className="mt-1 font-serif">
                Delete freely. The desk keeps only what's useful. A reading you no
                longer need is a folder you'll never re-open.
              </div>
            </div>
          </StickyNote>

          <Sheet className="relative p-6" lift>
            <Eyebrow>How the archive is kept</Eyebrow>
            <div className="rule-line mt-3 mb-4" />
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">01</span>
                <span className="text-ink-muted">Filed in reverse order - newest first.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">02</span>
                <span className="text-ink-muted">Search filters by document name only.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">03</span>
                <span className="text-ink-muted">Deletes cannot be undone.</span>
              </li>
            </ul>
          </Sheet>
        </aside>
      </div>

      <DeleteArchiveDialog
        open={Boolean(deleteDialogItem)}
        item={deleteDialogItem}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

    </div>
  );
}

/* ---------------------------------- rows ---------------------------------- */

function ArchiveRow({ item, active, onOpen, onDelete, deleting }) {
  const p = typeof item.matchPercent === "number" ? item.matchPercent : null;
  const deleteButtonRef = useRef(null);
  return (
    <li
      className={`group flex items-center gap-4 md:gap-5 px-3 md:px-4 py-4 transition-colors ${
        active ? "bg-secondary/60" : "hover:bg-secondary/40"
      }`}
    >
      {/* Mini document glyph — same primitive as Dashboard */}
      <div className="relative h-12 w-9 shrink-0">
        <div className="absolute inset-0 bg-paper border border-rule shadow-paper rounded-[2px]" />
        <div className="absolute top-1.5 left-1.5 right-1.5 h-px bg-rule" />
        <div className="absolute top-3 left-1.5 right-3 h-px bg-rule" />
        <div className="absolute top-4.5 left-1.5 right-2 h-px bg-rule" />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left"
      >
        <div className="font-serif text-[17px] leading-tight truncate group-hover:text-accent transition-colors">
          {item.resumeFilename || "Untitled"}
        </div>
        <div className="mt-0.5 text-[12px] text-ink-muted font-mono">
          {fmtDate(item.createdAt)} · {fmtTime(item.createdAt)}
        </div>
      </button>

      <div className="hidden sm:block text-right shrink-0 w-24">
        <div className="eyebrow text-[10px]">{bandFor(p)}</div>
        <div className="mt-1">
          <AtsScore value={p} size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onOpen}
          className="text-[12px] px-3 py-1.5 border border-ink/15 hover:border-ink/50 rounded-sm transition-colors"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onDelete(deleteButtonRef)}
          disabled={deleting}
          aria-label="Delete this analysis"
          ref={deleteButtonRef}
          className="h-8 w-8 inline-flex items-center justify-center text-ink-muted hover:text-destructive border border-transparent hover:border-destructive/30 rounded-sm transition-colors disabled:opacity-50"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
            <path
              d="M1 3h10M4 3V1.5h4V3M2.5 3l.6 9a1 1 0 001 .9h3.8a1 1 0 001-.9L9.5 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}

function DeleteArchiveDialog({ open, item, onCancel, onConfirm }) {
  const dialogRef = useRef(null);
  const primaryRef = useRef(null);
  const secondaryRef = useRef(null);
  const focusablesRef = useRef([]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = [secondaryRef.current, primaryRef.current].filter(Boolean);
    focusablesRef.current = focusables;
    (primaryRef.current || dialogRef.current)?.focus?.();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = focusablesRef.current.filter(Boolean);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !dialogRef.current?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close delete dialog"
        onClick={onCancel}
        className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]"
      />

      <Sheet
        ref={dialogRef}
        className="relative z-10 w-full max-w-md p-8 md:p-10"
        lift
        dogEar
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-archive-title"
        aria-describedby="remove-archive-description"
        tabIndex={-1}
      >
        <div className="absolute right-0 top-0 h-3 w-20 bg-tape/70" aria-hidden="true" />
        <Eyebrow>Archive confirmation</Eyebrow>
        <h2 id="remove-archive-title" className="mt-3 font-serif text-[28px] leading-tight tracking-tight">
          Remove from Archive
        </h2>
        <p id="remove-archive-description" className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-sm">
          This analysis will be permanently removed from your archive.
          <br />
          This action cannot be undone.
        </p>

        <div className="rule-line my-6" />

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            ref={secondaryRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors"
          >
            Keep in Archive
          </button>
          <button
            ref={primaryRef}
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
          >
            Remove File
          </button>
        </div>
      </Sheet>
    </div>
  );
}

/* ------------------------------ pagination ------------------------------ */

function Pagination({ page, totalPages, onChange, windowStart, windowEnd, total }) {
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="text-[12px] text-ink-muted font-mono">
        {windowStart}–{windowEnd} of {total}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => canPrev && onChange(page - 1)}
          disabled={!canPrev}
          className="text-sm px-3 py-1.5 border border-ink/15 hover:border-ink/50 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <div className="px-3 py-1.5 text-[12px] font-mono text-ink-muted">
          Page <span className="text-ink font-serif text-[14px] mx-0.5">{page}</span>
          <span className="text-ink-muted/60"> / {totalPages}</span>
        </div>
        <button
          type="button"
          onClick={() => canNext && onChange(page + 1)}
          disabled={!canNext}
          className="text-sm px-3 py-1.5 border border-ink/15 hover:border-ink/50 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ public empty ----------------------------- */

function PublicArchiveEmptyState() {
  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <Eyebrow>Archive · Saved analyses</Eyebrow>
          <h1 className="mt-3 font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight">
            Filed, dated, <span className="italic font-normal">kept.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-xl">
            A private cabinet for your resume analyses, ATS scores, and the reports you want to revisit later.
          </p>
        </div>
        <Link
          to="/login"
          className="px-4 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
        >
          Sign In
        </Link>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        <div className="col-span-12 lg:col-span-8">
          <Sheet className="relative p-8 md:p-10 text-center" lift>
            <PaperClip />
            <div className="mx-auto w-20 h-24 relative opacity-80 mb-6">
              <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[-6deg]" />
              <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[2deg] translate-x-1 translate-y-1" />
              <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[6deg] translate-x-2 translate-y-2" />
            </div>
            <Eyebrow>Open the cabinet</Eyebrow>
            <div className="mt-3 font-serif text-3xl">Your archive is ready to fill.</div>
            <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
              Create an account to keep every reading filed by date, compare ATS scores, and return to reports whenever you need them.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Link
                to="/login"
                className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-3 border border-ink/15 hover:border-ink/50 text-sm rounded-sm transition-colors"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3 text-left">
              <div className="rounded-sm border border-rule bg-secondary/40 p-4">
                <div className="eyebrow text-[10px]">Save each analysis</div>
                <div className="mt-2 text-sm text-ink-muted">
                  Keep every analysis in a private archive for later review.
                </div>
              </div>
              <div className="rounded-sm border border-rule bg-secondary/40 p-4">
                <div className="eyebrow text-[10px]">Track progress</div>
                <div className="mt-2 text-sm text-ink-muted">
                  Compare ATS scores and watch your resumes improve over time.
                </div>
              </div>
              <div className="rounded-sm border border-rule bg-secondary/40 p-4">
                <div className="eyebrow text-[10px]">Return anytime</div>
                <div className="mt-2 text-sm text-ink-muted">
                  Reopen past reports without starting from scratch.
                </div>
              </div>
            </div>
          </Sheet>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <StickyNote rotate={-2}>
            <div className="text-[13.5px] leading-snug">
              <div className="eyebrow text-[10px]">Cabinet note</div>
              <div className="mt-1 font-serif">
                The desk remembers what matters. A signed-in account keeps each analysis close at hand.
              </div>
            </div>
          </StickyNote>

          <Sheet className="relative p-6">
            <Eyebrow>Why create an account</Eyebrow>
            <div className="rule-line mt-3 mb-4" />
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">01</span>
                <span className="text-ink-muted">Access all your past analyses in one private archive.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">02</span>
                <span className="text-ink-muted">Compare ATS scores and track your resume improvements.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">03</span>
                <span className="text-ink-muted">Pick up where you left off without re-uploading files.</span>
              </li>
            </ul>
          </Sheet>
        </aside>
      </div>
    </div>
  );
}

function EmptyCabinet() {
  return (
    <Sheet className="relative p-12 text-center" lift>
      <PaperClip />
      <div className="mx-auto w-20 h-24 relative opacity-80 mb-6">
        <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[-6deg]" />
        <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[2deg] translate-x-1 translate-y-1" />
        <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[6deg] translate-x-2 translate-y-2" />
      </div>
      <Eyebrow>The cabinet is empty</Eyebrow>
      <div className="mt-3 font-serif text-3xl">Nothing filed yet.</div>
      <p className="mt-3 text-sm text-ink-muted max-w-md mx-auto">
        Every resume you have the desk analyze will be dated, scored, and kept here.
        Your archive begins with the first analysis.
      </p>
      <Link
        to="/app/analyze"
        className="mt-6 inline-block px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
      >
        Analyze your first resume →
      </Link>
    </Sheet>
  );
}


/* ------------------------------ atoms ------------------------------ */

function StatCell({ label, value, accent = false }) {
  return (
    <div>
      <dt className="eyebrow text-[10px]">{label}</dt>
      <dd
        className={`mt-1 font-serif leading-none ${
          accent ? "text-accent text-[30px]" : "text-ink text-[26px]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="text-ink-muted" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
