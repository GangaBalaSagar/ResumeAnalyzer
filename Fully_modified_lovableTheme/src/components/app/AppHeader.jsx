import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import UserMenu from "./UserMenu.jsx";

function Mark() {
  return (
    <div className="relative h-9 w-7 shrink-0">
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[-4deg] shadow-stack" />
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[2deg] translate-x-[2px] translate-y-[1px] shadow-paper" />
      <div className="absolute inset-0 flex items-center justify-center font-serif text-[13px] font-semibold">
        R
      </div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-accent/80 rounded-b-sm" />
    </div>
  );
}

const sharedLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/features", label: "Features", end: true },
  { to: "/faq", label: "FAQ", end: true },
];

const publicLinks = [
  sharedLinks[0],
  { to: "/analyze", label: "Review", end: true },
  { to: "/report", label: "Report", end: true },
  { to: "/history", label: "Archive", end: true },
  ...sharedLinks.slice(1),
];

const privateLinks = [
  sharedLinks[0],
  { to: "/app/dashboard", label: "Dashboard", end: true },
  { to: "/app/analyze", label: "Review", end: true },
  { to: "/app/report", label: "Report", end: true },
  { to: "/app/history", label: "Archive", end: true },
  ...sharedLinks.slice(1),
];

/**
 * AppHeader — a single editorial top nav for both public and authenticated users.
 * Dashboard appears in the main nav for signed-in users, while account actions remain under the avatar dropdown.
 */
export default function AppHeader({ onOpenMobileNav }) {
  const { user } = useAuth();
  const navLinks = user ? privateLinks : publicLinks;

  return (
    <header className="border-b border-rule/60 bg-background/85 backdrop-blur-sm sticky top-0 z-40 overflow-visible">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3.5 flex items-center justify-between gap-4 overflow-visible">
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center border border-ink/15 hover:border-ink/50 rounded-sm transition-colors"
            aria-label="Open navigation"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
              <path d="M1 1h14M1 6h14M1 11h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Mark />
            <div className="leading-tight hidden sm:block">
              <div className="font-serif text-[16px] tracking-tight">Resume Analyzer</div>
              <div className="eyebrow text-[9px]">Review Before You Apply</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm text-ink-muted">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `story-link ${isActive ? "text-ink font-serif italic" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/app/analyze"
                className="hidden sm:inline-flex text-sm px-3.5 py-2 bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
              >
                New Analysis
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex text-sm px-3 py-2 text-ink-muted hover:text-ink transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/analyze"
                className="text-sm px-4 py-2 bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors"
              >
                Begin an analysis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
