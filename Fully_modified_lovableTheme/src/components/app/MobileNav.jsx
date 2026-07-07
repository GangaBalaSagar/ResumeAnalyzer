import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { APP_NAV } from "./AppSidebar.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

function initials(nameOrEmail = "") {
  const s = String(nameOrEmail).trim();
  if (!s) return "·";
  const at = s.indexOf("@");
  const base = at > 0 ? s.slice(0, at) : s;
  const parts = base.split(/[.\s_-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() ||
    base[0].toUpperCase();
}

/**
 * MobileNav — an off-canvas paper drawer for small screens.
 * Slides in from the left; taps outside dismiss it.
 */
export default function MobileNav({ open, onClose }) {
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const displayName = user?.user_metadata?.full_name || "";
  const email = user?.email || "";
  const primary = displayName || email || "Guest";
  const secondary = displayName ? email : "";

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Desk backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]"
      />

      {/* Paper drawer — flex column so the footer sits at the bottom */}
      <div className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] bg-desk border-r border-rule shadow-paper-lift animate-fade-up flex flex-col">
        {/* Masthead */}
        <div className="px-5 pt-5 pb-4 border-b border-rule/60 flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow text-[10px]">The Desk</div>
            <div className="mt-1 font-serif text-[17px] leading-tight">
              Resume Analyzer
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 shrink-0 inline-flex items-center justify-center border border-ink/15 hover:border-ink/50 rounded-sm"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Contents */}
        <div className="px-5 pt-5 pb-2 eyebrow text-[10px]">Contents</div>
        <nav className="px-3 pb-4 space-y-0.5">
          {APP_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-baseline gap-3 px-3 py-2.5 rounded-sm transition-colors ${
                  isActive
                    ? "bg-secondary text-ink"
                    : "text-ink-muted hover:text-ink hover:bg-secondary/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`font-serif text-sm ${isActive ? "text-accent" : "text-ink-muted/60"}`}>
                    {item.num}
                  </span>
                  <span className="font-serif text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Primary CTA — kept modest, matches header CTA */}
        <div className="px-5 pb-5">
          <Link
            to="/upload"
            onClick={onClose}
            className="block text-center text-sm px-3.5 py-2 bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
          >
            New Analysis
          </Link>
        </div>

        {/* Spacer pushes the account card to the bottom */}
        <div className="flex-1" />

        {/* Account card — filled sheet, gives the drawer a finished foot */}
        <div className="px-4 pb-4">
          <div className="rule-line mb-4" />
          <div className="sheet p-4">
            <div className="flex items-center gap-3">
              <span className="relative flex items-center justify-center h-9 w-9 shrink-0 bg-paper border border-rule rounded-[2px] shadow-paper font-serif text-[13px] font-semibold">
                {initials(primary)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="eyebrow text-[9px]">Signed in as</div>
                <div className="mt-0.5 font-serif text-[14px] leading-tight truncate">
                  {primary}
                </div>
                {secondary && (
                  <div className="text-[11px] text-ink-muted truncate">
                    {secondary}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={async () => { await signOut(); onClose(); }}
                className="shrink-0 text-[12px] text-ink-muted hover:text-ink underline underline-offset-4 decoration-rule hover:decoration-ink transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-ink-muted/80">
            <span className="eyebrow text-[9px]">Edition № 01</span>
            <span className="font-serif italic">Printed on warm paper</span>
          </div>
        </div>
      </div>
    </div>
  );
}
