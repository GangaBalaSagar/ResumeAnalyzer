import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const workspaceLinks = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/analyze", label: "Review" },
  { to: "/app/report", label: "Report" },
  { to: "/app/history", label: "Archive" },
  { to: "/app/account", label: "Account" },
];

const exploreLinks = [
  { to: "/features", label: "Features" },
  { to: "/faq", label: "FAQ" },
];

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

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="hover:text-ink transition-colors">
      {children}
    </Link>
  );
}

export default function AppFooter() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(user);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <footer className="border-t border-rule/60 mt-16">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark />
            <div className="leading-tight">
              <div className="font-serif text-[15px]">Resume Analyzer</div>
              <div className="eyebrow text-[9px]">REVIEW BEFORE YOU APPLY</div>
            </div>
          </div>
          <p className="mt-4 text-ink-muted text-[13px] max-w-xs leading-relaxed">
            A quiet workspace for resume analysis. Your resume, compared to the role clearly and precisely.
          </p>
        </div>

        <div>
          <div className="eyebrow text-[10px]">Workspace</div>
          <ul className="mt-3 space-y-2 text-ink-muted">
            {workspaceLinks.map((link) => (
              <li key={link.to}>
                <FooterLink to={link.to}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow text-[10px]">Explore</div>
          <ul className="mt-3 space-y-2 text-ink-muted">
            {exploreLinks.map((link) => (
              <li key={link.to}>
                <FooterLink to={link.to}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow text-[10px]">Account</div>
          <ul className="mt-3 space-y-2 text-ink-muted">
            {!isAuthenticated ? (
              <>
                <li>
                  <FooterLink to="/login">Sign in</FooterLink>
                </li>
                <li>
                  <FooterLink to="/signup">Create account</FooterLink>
                </li>
                <li>
                  <FooterLink to="/analyze">Begin an analysis</FooterLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <FooterLink to="/app/analyze">New Analysis</FooterLink>
                </li>
                <li>
                  <FooterLink to="/app/account">Account</FooterLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="hover:text-ink transition-colors"
                  >
                    Sign out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-ink-muted">
          <div>© Resume Analyzer · 2026</div>
          <div>
            {isAuthenticated
              ? "Secure authentication • AI-powered analysis"
              : "AI-powered resume analysis"}
          </div>
        </div>
      </div>
    </footer>
  );
}
