import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader.jsx";
import AppSidebar from "./AppSidebar.jsx";
import MobileNav from "./MobileNav.jsx";
import UserMenu from "./UserMenu.jsx";
import Footer from "./AppFooter.jsx";

/**
 * PageContainer — the shared width + padding + page-turn transition
 * used by every authenticated page. Reuses .animate-page-in.
 */
export function PageContainer({ children, className = "" }) {
  return <div className={`animate-page-in ${className}`}>{children}</div>;
}

/**
 * AppLayout — the authenticated application shell.
 *
 *   .bg-desk
 *     ├─ AppHeader (breadcrumbs + UserMenu + mobile toggle)
 *     ├─ MobileNav (off-canvas paper drawer)
 *     └─ <main> mx-auto max-w-7xl
 *          ├─ AppSidebar (paper index card)
 *          └─ PageContainer > Outlet   ← every page mounts here
 *
 * Wrap this in <AuthGate> at the route level. Every authenticated page
 * inherits the shell by being nested under the /app parent route.
 */
export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-desk flex flex-col">
      <AppHeader
        onOpenMobileNav={() => setNavOpen(true)}
        userMenu={<UserMenu />}
      />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-8 md:py-10">
        <div className="flex gap-8 lg:gap-12 items-start">
          <AppSidebar />
          <div className="flex-1 min-w-0">
            <PageContainer>
              <Outlet />
            </PageContainer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
