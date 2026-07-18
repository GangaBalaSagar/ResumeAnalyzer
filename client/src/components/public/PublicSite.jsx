import { useState } from "react";
import { Eyebrow } from "../paper.jsx";
import AppHeader from "../app/AppHeader.jsx";
import MobileNav from "../app/MobileNav.jsx";
import AppFooter from "../app/AppFooter.jsx";

export function PublicFooter() {
  return <AppFooter />;
}

/**
 * PublicSite â€” shared marketing shell for Landing, Features, FAQ.
 * Wraps children in a Desk background, sticky header, and rich footer.
 */
export default function PublicSite({ children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-desk flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-ink text-paper rounded-sm">
        Skip to main content
      </a>
      <AppHeader onOpenMobileNav={() => setNavOpen(true)} />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
      <main id="main-content" className="flex-1 animate-page-in">{children}</main>
      <PublicFooter />
    </div>
  );
}

/**
 * PageIntro â€” shared editorial intro used at the top of Features and FAQ.
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
