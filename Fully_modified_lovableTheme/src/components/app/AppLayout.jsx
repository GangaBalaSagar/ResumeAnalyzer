import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader.jsx";
import MobileNav from "./MobileNav.jsx";
import Footer from "./AppFooter.jsx";

/**
 * PageContainer — the shared width + padding + page-turn transition
 * used by every application page. Reuses .animate-page-in.
 */
export function PageContainer({ children, className = "" }) {
  return <div className={`animate-page-in ${className}`}>{children}</div>;
}

/**
 * AppLayout — the shared application shell for public and private app pages.
 * It keeps one top navigation and an optional contextual side panel that
 * individual pages can use when needed.
 */
export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const contextualPanel = location.state?.sidebar;

  return (
    <div className="min-h-screen bg-desk flex flex-col">
      <AppHeader onOpenMobileNav={() => setNavOpen(true)} />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col gap-8 xl:flex-row">
          <div className="min-w-0 flex-1">
            <PageContainer>
              <Outlet />
            </PageContainer>
          </div>
          {contextualPanel ? (
            <aside className="w-full xl:w-72 shrink-0">{contextualPanel}</aside>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
