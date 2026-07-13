import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/app/AppHeader.jsx";
import MobileNav from "../components/app/MobileNav.jsx";
import HeroPrototype from "./HeroPrototype.jsx";
import WorkspaceSection from "../components/landing/WorkspaceSection.jsx";
import WorkflowSection from "../components/landing/WorkflowSection.jsx";
import TestimonialSection from "../components/landing/TestimonialSection.jsx";
import { PublicFooter } from "../components/public/PublicSite.jsx";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/features", label: "Features" },
  { to: "/faq", label: "FAQ" },
];

function Mark() {
  return (
    <div className="relative h-9 w-7 shrink-0">
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[-4deg] shadow-stack" />
      <div className="absolute inset-0 bg-paper border border-rule rounded-[2px] rotate-[2deg] translate-x-[2px] translate-y-[1px] shadow-paper" />
      <div className="absolute inset-0 flex items-center justify-center font-serif text-[13px] font-semibold">R</div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-accent/80 rounded-b-sm" />
    </div>
  );
}

export default function LandingV2() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-desk">
      <AppHeader onOpenMobileNav={() => setNavOpen(true)} />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />

      <HeroPrototype />

      <WorkspaceSection />
      <WorkflowSection />
      <TestimonialSection />

      <PublicFooter />
    </div>
  );
}