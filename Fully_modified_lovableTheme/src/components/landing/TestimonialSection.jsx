import { Link } from "react-router-dom";
import { Sheet, Eyebrow } from "../paper.jsx";

export default function TestimonialSection() {
  return (
    <section className="landing-scene landing-scene--testimonial relative -mt-8 pb-20 md:-mt-12 md:pb-24 border-t border-rule/60">
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
                  Compare your resume to the role.
                </h2>
                <p className="mt-5 text-ink-muted max-w-xl">
                  One upload. One job description. An analysis you can act on.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    to="/app/analyze"
                    className="landing-action landing-action--primary px-6 py-3.5 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
                  >
                    Begin an analysis
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
  );
}