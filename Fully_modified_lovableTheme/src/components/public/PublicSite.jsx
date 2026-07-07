import { useState } from "react";
import { Link } from "react-router-dom";
import { Eyebrow } from "../paper.jsx";
import AppHeader from "../app/AppHeader.jsx";
import MobileNav from "../app/MobileNav.jsx";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/features", label: "Features" },
  { to: "/faq", label: "FAQ" },
];

function Mark() {
  return (
    <div className="relative h-9 w-7 shrink-0">
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[-4deg] shadow-paper" />
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[2deg] translate-x-[2px] translate-y-[1px]" />
      <div className="absolute inset-0 flex items-center justify-center font-serif text-[13px] font-semibold">R</div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-accent/80 rounded-b-sm" />
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-rule/60 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark />
            <div className="leading-tight">
              <div className="font-serif text-[15px]">Resume Analyzer</div>
              <div className="eyebrow text-[9px]">Est. 2026</div>
            </div>
          </div>
          <p className="mt-4 text-ink-muted text-[13px] max-w-xs leading-relaxed">
            A quiet workspace for careful reading. Your resume, matched to the role — carefully, considerately.
          </p>
        </div>
        <div>
          <div className="eyebrow text-[10px]">The Site</div>
          <ul className="mt-3 space-y-2 text-ink-muted">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-ink transition-colors">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow text-[10px]">Members</div>
          <ul className="mt-3 space-y-2 text-ink-muted">
            <li><Link to="/login" className="hover:text-ink transition-colors">Sign in</Link></li>
            <li><Link to="/signup" className="hover:text-ink transition-colors">Request a seat</Link></li>
            <li><Link to="/app/analyze" className="hover:text-ink transition-colors">Begin an analysis</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between text-xs text-ink-muted">
          <div>© Resume Analyzer · Est. 2026</div>
          <div className="flex gap-6">
            <span>Edition № 01</span>
            <span>Printed on warm paper</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * PublicSite — shared marketing shell for Landing, Features, FAQ.
 * Wraps children in a Desk background, sticky header, and rich footer.
 */
export default function PublicSite({ children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-desk flex flex-col">
      <AppHeader onOpenMobileNav={() => setNavOpen(true)} />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
      <main className="flex-1 animate-page-in">{children}</main>
      <PublicFooter />
    </div>
  );
}

/**
 * PageIntro — shared editorial intro used at the top of Features and FAQ.
 */
export function PageIntro({ eyebrow, title, italic, lede }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-5 font-serif text-[52px] md:text-[64px] leading-[1.02] tracking-tight max-w-3xl">
        {title}
        {italic && (
          <>
            <br />
            <span className="italic font-normal">{italic}</span>
          </>
        )}
      </h1>
      {lede && (
        <p className="mt-6 text-[17px] leading-relaxed text-ink-muted max-w-2xl">
          {lede}
        </p>
      )}
    </section>
  );
}
