import { Link, useLocation } from "react-router-dom";
import { APP_NAV } from "./AppSidebar.jsx";

/**
 * Build breadcrumbs from the current pathname using the APP_NAV registry
 * as the source of labels. Extra unregistered segments show titleized.
 */
function crumbsFor(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [];
  const registry = new Map(APP_NAV.map((n) => [n.to, n.label]));
  const out = [];
  let acc = "";
  for (const p of parts) {
    acc += `/${p}`;
    const label =
      registry.get(acc) ||
      p.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    out.push({ to: acc, label });
  }
  return out;
}

/**
 * AppHeader — sticky editorial masthead for the authenticated shell.
 * Left: logo + breadcrumbs (as a table-of-contents run).
 * Right: mobile menu toggle, primary CTA, user menu.
 * Reuses paper primitives and existing button classes.
 */
export default function AppHeader({ onOpenMobileNav, userMenu }) {
  const { pathname } = useLocation();
  const crumbs = crumbsFor(pathname);

  return (
    <header className="border-b border-rule/60 bg-background/85 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3.5 flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden h-9 w-9 inline-flex items-center justify-center border border-ink/15 hover:border-ink/50 rounded-sm transition-colors"
          aria-label="Open navigation"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1 1h14M1 6h14M1 11h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <Link to="/app" className="flex items-center gap-2.5 shrink-0">
          <Mark />
          <div className="leading-tight hidden sm:block">
            <div className="font-serif text-[16px] tracking-tight">Resume Analyzer</div>
            <div className="eyebrow text-[9px]">The Recruiter's Desk</div>
          </div>
        </Link>

        {/* Breadcrumbs — editorial "table of contents" row */}
        <nav
          aria-label="Breadcrumb"
          className="hidden md:flex items-center gap-2 min-w-0 ml-3 pl-3 border-l border-rule/60"
        >
          <ol className="flex items-center gap-2 min-w-0">
            {crumbs.length === 0 && (
              <li className="eyebrow text-[10px] truncate">Home</li>
            )}
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.to} className="flex items-center gap-2 min-w-0">
                  {i > 0 && (
                    <span className="text-ink-muted/50 font-serif text-sm">·</span>
                  )}
                  {last ? (
                    <span className="font-serif italic text-[14px] text-ink truncate">
                      {c.label}
                    </span>
                  ) : (
                    <Link
                      to={c.to}
                      className="eyebrow text-[10px] text-ink-muted hover:text-ink"
                    >
                      {c.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/upload"
            className="hidden sm:inline-flex text-sm px-3.5 py-2 bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
          >
            New Analysis
          </Link>
          {userMenu}
        </div>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <div className="relative h-9 w-7">
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[-4deg] shadow-paper" />
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[2deg] translate-x-[2px] translate-y-[1px]" />
      <div className="absolute inset-0 flex items-center justify-center font-serif text-[13px] font-semibold">
        R
      </div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-accent/80 rounded-b-sm" />
    </div>
  );
}
