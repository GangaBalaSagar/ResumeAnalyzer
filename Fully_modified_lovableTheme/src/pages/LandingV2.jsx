import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/app/AppHeader.jsx";
import MobileNav from "../components/app/MobileNav.jsx";
import HeroPrototype from "./HeroPrototype.jsx";
import SubmitPreview from "../components/landing/SubmitPreview.jsx";
import SheetsOnDesk from "../components/landing/SheetsOnDesk.jsx";
import ReviewProcess from "../components/landing/ReviewProcess.jsx";
import ComparePreview from "../components/landing/ComparePreview.jsx";
import ReviewPreview from "../components/landing/ReviewPreview.jsx";
import ImprovePreview from "../components/landing/ImprovePreview.jsx";
import ReturnPreview from "../components/landing/ReturnPreview.jsx";
import { PublicFooter } from "../components/public/PublicSite.jsx";
import { Sheet, Eyebrow, StickyNote } from "../components/paper.jsx";

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

      {/* Chapter 1: Understand — The Hero */}
      <HeroPrototype />

      {/* Chapter 2: Submit — Preview the Analyze page */}
      <SubmitPreview />

      {/* Chapter 3: The Sheets — Preview the four report sheets */}
      <SheetsOnDesk />

      {/* Chapter 4: The Process — Five stages */}
      <ReviewProcess />

      {/* Chapter 5: Compare — Review in Progress */}
      <ComparePreview />

      {/* Chapter 6: Review — Report page preview (cover, summary, skills, charts, suggestions) */}
      <ReviewPreview />

      {/* Chapter 7: Improve — JD marked, suggestions, how to iterate */}
      <ImprovePreview />

      {/* Chapter 8: Return — Dashboard & Archive preview */}
      <ReturnPreview />

      {/* Final CTA */}
      <section className="landing-scene landing-scene--cta relative -mt-8 pb-20 md:-mt-12 md:pb-24 border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6">
          <Sheet className="landing-end-panel mx-auto max-w-6xl p-6 md:p-8" stack lift tabIndex={0}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="landing-end-panel__quote landing-field landing-field--testimonial lg:col-span-5 text-left lg:pr-6">
                <Eyebrow>A note</Eyebrow>
                <blockquote className="mt-6 font-serif text-3xl md:text-4xl italic leading-snug text-ink">
                  "Upload. Compare. Improve. The fastest way to know if your resume fits the role."
                </blockquote>
                <div className="mt-6 text-sm text-ink-muted">- Resume Analyzer Pro</div>
              </div>

              <div className="lg:col-span-7">
                <div className="landing-section-bridge hidden lg:block mb-8" />
                <div className="landing-end-panel__cta landing-field landing-field--cta">
                  <Eyebrow>Begin</Eyebrow>
                  <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-tight max-w-2xl">
                    Start a review now.
                  </h2>
                  <p className="mt-5 text-ink-muted max-w-xl">
                    One upload. One role brief. A considered analysis you can act on.
                  </p>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      to="/app/analyze"
                      className="landing-action landing-action--primary px-6 py-3.5 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
                    >
                      Begin a review
                    </Link>
                    <Link
                      to="/faq"
                      className="landing-action landing-action--secondary px-6 py-3.5 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm"
                    >
                      Read the FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Sheet>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}