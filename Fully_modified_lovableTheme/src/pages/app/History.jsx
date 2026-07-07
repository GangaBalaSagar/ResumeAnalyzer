import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../../components/paper.jsx";
import AtsScore, { bandFor } from "../../components/app/AtsScore.jsx";
import api from "../../api.js";

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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    load();
  }, []);

  async function openDetail(id) {
    try {
      setDetailLoading(true);
      const res = await api.get(`/analyses/${id}`);
      setSelected(res.data);
    } catch (err) {
      setSelected({ error: err?.response?.data?.error || err?.message || "Could not open this record." });
    } finally {
      setDetailLoading(false);
    }
  }

  async function deleteItem(id) {
    if (!window.confirm("Remove this reading from the archive?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/analyses/${id}`);
      setItems((cur) => cur.filter((x) => x._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Could not delete this record.");
    } finally {
      setDeletingId(null);
    }
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
          <Eyebrow>The archive · Filed readings</Eyebrow>
          <h1 className="mt-3 font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight">
            Filed, dated, <span className="italic font-normal">kept.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted max-w-xl">
            Every resume the desk has read, stored in the cabinet. Open a folder to
            revisit the reading, or clear a card you no longer need.
          </p>
        </div>
        <Link
          to="/upload"
          className="px-4 py-2.5 text-sm bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
        >
          New analysis →
        </Link>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* MAIN — the ledger */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Search + summary strip */}
          <Sheet className="relative p-5 md:p-6">
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
            <Sheet className="relative p-10">
              <PaperClip />
              <Eyebrow>One moment</Eyebrow>
              <div className="mt-2 font-serif text-2xl">Reading the cabinet…</div>
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
            <Sheet className="relative p-10 text-center">
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
                      active={selected?._id === d._id}
                      onOpen={() => openDetail(d._id)}
                      onDelete={() => deleteItem(d._id)}
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
          <Sheet className="relative p-6">
            <Eyebrow>Cabinet totals</Eyebrow>
            <div className="mt-2 font-serif text-xl leading-tight">The archive, in numbers</div>
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

          <Sheet className="relative p-6">
            <Eyebrow>How the archive is kept</Eyebrow>
            <div className="rule-line mt-3 mb-4" />
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">§</span>
                <span className="text-ink-muted">Filed in reverse order — newest first.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">§</span>
                <span className="text-ink-muted">Search filters by document name only.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-accent shrink-0">§</span>
                <span className="text-ink-muted">Deletes cannot be undone.</span>
              </li>
            </ul>
          </Sheet>
        </aside>
      </div>

      {/* Detail sheet */}
      {selected && (
        <DetailModal
          item={selected}
          loading={detailLoading}
          onClose={() => setSelected(null)}
          onDelete={() => selected?._id && deleteItem(selected._id)}
        />
      )}
    </div>
  );
}

/* ---------------------------------- rows ---------------------------------- */

function ArchiveRow({ item, active, onOpen, onDelete, deleting }) {
  const p = typeof item.matchPercent === "number" ? item.matchPercent : null;
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
          onClick={onDelete}
          disabled={deleting}
          aria-label="Delete this analysis"
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

/* -------------------------------- empty ---------------------------------- */

function EmptyCabinet() {
  return (
    <Sheet className="relative p-12 text-center" lift>
      <PaperClip />
      <div className="mx-auto w-20 h-24 relative opacity-80 mb-6">
        <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[-6deg]" />
        <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[2deg] translate-x-1 translate-y-1" />
        <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[6deg] translate-x-2 translate-y-2" />
      </div>
      <Eyebrow>The cabinet is empty</Eyebrow>
      <div className="mt-3 font-serif text-3xl">Nothing filed yet.</div>
      <p className="mt-3 text-sm text-ink-muted max-w-md mx-auto">
        Every resume you have the desk read will be dated, scored, and kept here.
        Your archive begins with the first analysis.
      </p>
      <Link
        to="/upload"
        className="mt-6 inline-block px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
      >
        Read your first resume →
      </Link>
    </Sheet>
  );
}

/* ----------------------------- detail modal ----------------------------- */

function DetailModal({ item, loading, onClose, onDelete }) {
  const p = typeof item.matchPercent === "number" ? item.matchPercent : null;
  const matched = item.matchedSkills ?? [];
  const missing = item.missingSkills ?? [];
  const suggestions = Array.isArray(item.suggestions)
    ? item.suggestions.join("\n")
    : (item.suggestions || "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="bg-paper border border-rule rounded-sm shadow-paper-lift max-w-3xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 border-b border-rule flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <Eyebrow>Filed reading</Eyebrow>
            {item.error ? (
              <div className="mt-2 font-serif text-xl text-destructive">
                {item.error}
              </div>
            ) : (
              <>
                <div className="mt-2 font-serif text-2xl truncate">
                  {item.resumeFilename || "Untitled"}
                </div>
                <div className="mt-1 text-[12px] text-ink-muted font-mono">
                  Filed {fmtDate(item.createdAt)} · {fmtTime(item.createdAt)}
                </div>
              </>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="eyebrow text-[10px]">{bandFor(p)}</div>
            <div className="mt-1">
              <AtsScore value={p} size="md" />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {loading ? (
            <div className="text-sm text-ink-muted italic font-serif">Opening the folder…</div>
          ) : item.error ? null : (
            <>
              <section>
                <Eyebrow>Matched skills</Eyebrow>
                <div className="rule-line mt-2 mb-3" />
                {matched.length === 0 ? (
                  <div className="text-sm text-ink-muted italic font-serif">None on the page.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {matched.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs rounded-sm bg-accent/10 text-ink border border-accent/30">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <Eyebrow>Missing skills</Eyebrow>
                <div className="rule-line mt-2 mb-3" />
                {missing.length === 0 ? (
                  <div className="text-sm text-ink-muted italic font-serif">Nothing missing.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {missing.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs rounded-sm bg-destructive/10 text-destructive border border-destructive/30">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <Eyebrow>Suggestions</Eyebrow>
                <div className="rule-line mt-2 mb-3" />
                <pre className="font-serif text-[15px] leading-relaxed whitespace-pre-wrap text-ink">
                  {suggestions || "—"}
                </pre>
              </section>
            </>
          )}
        </div>

        <div className="p-5 md:p-6 border-t border-rule flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onDelete}
            className="text-sm px-3 py-1.5 text-destructive border border-destructive/30 hover:bg-destructive/5 rounded-sm transition-colors"
          >
            Delete this reading
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-3 py-1.5 border border-ink/20 hover:border-ink/60 rounded-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
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
