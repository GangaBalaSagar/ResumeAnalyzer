import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

function initials(nameOrEmail = "") {
  const s = String(nameOrEmail).trim();
  if (!s) return "·";
  const at = s.indexOf("@");
  const base = at > 0 ? s.slice(0, at) : s;
  const parts = base.split(/[.\s_-]+/).filter(Boolean);
  const chars = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return chars.toUpperCase() || base[0].toUpperCase();
}

/**
 * UserMenu — a compact editor-style dropdown for dashboard, account and sign-out.
 */
export default function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const focusable = ref.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first || !ref.current?.contains(document.activeElement)) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    
    document.addEventListener("keydown", onKey);
    first?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const label = user?.user_metadata?.full_name || user?.email || "";

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 border border-ink/15 hover:border-ink/50 rounded-sm transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="relative flex items-center justify-center h-7 w-7 bg-paper border border-rule rounded-[2px] shadow-paper font-serif text-[12px] font-semibold">
          {initials(label)}
        </span>
        <span className="hidden md:flex flex-col items-start leading-tight max-w-[160px]">
          <span className="font-serif italic text-[13px] text-ink truncate max-w-[160px]">
            {label || "Guest"}
          </span>
          <span className="eyebrow text-[9px]">Signed in</span>
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-ink-muted" aria-hidden="true">
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" fill="none" strokeWidth="1.2" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 sheet p-4 z-[60] animate-fade-up !shadow-overlay"
        >
          <div className="eyebrow text-[10px]">Signed in as</div>
          <div className="mt-1 font-serif text-[15px] truncate">{user?.email}</div>
          <div className="rule-line my-3" />
          <div className="space-y-1">
            <Link
              to="/app/account"
              className="block px-2 py-1.5 rounded-sm text-sm text-ink-muted hover:text-ink hover:bg-secondary/60"
              role="menuitem"
            >
              Account
            </Link>
          </div>
          <div className="rule-line my-3" />
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-2 py-1.5 rounded-sm text-sm text-ink hover:bg-secondary/60"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
