import { useState } from "react";
import { Link } from "react-router-dom";
import PublicSite, { PageIntro } from "../components/public/PublicSite.jsx";
import { Sheet, Eyebrow, StickyNote } from "../components/paper.jsx";

const SECTIONS = [
  {
    title: "The analysis",
    items: [
      {
        q: "What does Resume Analyzer actually do?",
        a: "It compares a resume against a job description and returns a match score, the matched and missing skills, and specific, line-level edit suggestions. Think of it as a comparison tool — matching your resume to the role, not just scanning keywords.",
      },
      {
        q: "How is this different from a keyword scanner?",
        a: "Keyword scanners tell you which words appear. The AI reasons about context — seniority signals, phrasing, structure — and proposes edits that improve your alignment to the role.",
      },
      {
        q: "How long does an analysis take?",
        a: "Typically around twenty seconds. The desk shows the stages of analysis as it works so you can see where it is.",
      },
    ],
  },
  {
    title: "Files & formats",
    items: [
      {
        q: "Which file types are supported?",
        a: "PDF, DOCX, and plain TXT. PDFs are the most common; DOCX is fully supported. Scanned images inside a PDF may not read cleanly.",
      },
      {
        q: "Is there a file size limit?",
        a: "Up to 8 MB per document. Most resumes are well under 1 MB.",
      },
      {
        q: "Can I analyze the same resume against several jobs?",
        a: "Yes. Each analysis is filed independently in your archive. Compare them side by side later.",
      },
    ],
  },
  {
    title: "Privacy & the archive",
    items: [
      {
        q: "Where does my resume go?",
        a: "It stays with you. Documents are stored in your private archive and used only to produce your analysis. They aren't shared, sold, or used to train public models.",
      },
      {
        q: "Can I delete past analyses?",
        a: "Yes. Anything you file can be removed from the archive at any time — the underlying document goes with it.",
      },
      {
        q: "Do I need an account?",
        a: "You'll need one to begin an analysis and to keep your archive between visits. It's an email and a password — no lengthy forms.",
      },
    ],
  },
  {
    title: "Getting the most from your analysis",
    items: [
      {
        q: "What makes for a better analysis?",
        a: "Paste the job description exactly as posted, and use the version of your resume you'd actually send. The desk analyzes the document you'd actually send, not the draft.",
      },
      {
        q: "Should I edit my resume based on every suggestion?",
        a: "Only if the suggestion is honestly yours. The desk proposes; you decide. Some notes will be perfect; others are prompts for your own edit.",
      },
      {
        q: "Can I export the analysis?",
        a: "Yes — analyses are print-friendly and copyable. Skills lists and suggestions can be copied to the clipboard in one click.",
      },
    ],
  },
];

function FAQItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-rule/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-6 text-left py-5 group"
        aria-expanded={open}
      >
        <span className="font-serif text-[19px] leading-snug text-ink group-hover:text-ink">
          {q}
        </span>
        <span
          className={`shrink-0 mt-1 h-6 w-6 inline-flex items-center justify-center border border-rule rounded-sm text-ink-muted transition-transform ${
            open ? "rotate-45 border-ink/60 text-ink" : ""
          }`}
          aria-hidden
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-6 pr-10 text-[15px] leading-relaxed text-ink-muted animate-fade-up">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <PublicSite>
      <PageIntro
        eyebrow="Review 03 · Questions"
        title="Questions from"
        italic="the margins."
        lede="Short, honest answers about how the desk analyzes resumes, what it stores, and what to expect from a comparison."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sticky table of contents */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24">
              <Sheet className="p-6">
                <Eyebrow>Contents</Eyebrow>
                <ol className="mt-4 space-y-2">
                  {SECTIONS.map((s, i) => (
                    <li key={s.title}>
                      <a
                        href={`#s-${i}`}
                        className="flex items-baseline gap-3 group"
                      >
                        <span className="font-serif text-sm text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-[15px] text-ink-muted group-hover:text-ink transition-colors">
                          {s.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
                <div className="rule-line my-5" />
                <p className="text-xs text-ink-muted italic font-serif leading-relaxed">
                  Can't find your question? We're always improving.
                </p>
              </Sheet>

              <div className="mt-6">
                <StickyNote rotate={-2}>
                  <div className="text-[13px] leading-snug">
                    <div className="not-italic eyebrow text-[10px]">Analysis tip</div>
                    <div className="mt-1">
                      Paste the full job description. It sharpens every comparison.
                    </div>
                  </div>
                </StickyNote>
              </div>
            </div>
          </aside>

          {/* FAQ sections */}
          <div className="lg:col-span-8 space-y-10">
            {SECTIONS.map((s, i) => (
              <section key={s.title} id={`s-${i}`}>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-2xl md:text-[28px] leading-tight">
                    {s.title}
                  </h2>
                </div>
                <div className="rule-line mt-4" />
                <Sheet className="mt-5 px-6 md:px-8">
                  <div className="divide-y divide-rule/60">
                    {s.items.map((item, j) => (
                      <FAQItem
                        key={item.q}
                        q={item.q}
                        a={item.a}
                        defaultOpen={i === 0 && j === 0}
                      />
                    ))}
                  </div>
                </Sheet>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 border-t border-rule/60">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Eyebrow>Still curious?</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-tight">
            The desk works best <span className="italic font-normal">with a resume and a job description.</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/app/analyze"
              className="px-6 py-3.5 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
            >
              Begin an analysis
            </Link>
            <Link
              to="/features"
              className="px-6 py-3.5 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm"
            >
              Back to features
            </Link>
          </div>
        </div>
      </section>
    </PublicSite>
  );
}
