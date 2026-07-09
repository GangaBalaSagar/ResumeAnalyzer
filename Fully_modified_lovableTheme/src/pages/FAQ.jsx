import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PublicSite from "../components/public/PublicSite.jsx";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../components/paper.jsx";

const SECTIONS = [
  {
    title: "The analysis",
    items: [
      {
        q: "What does Resume Analyzer actually do?",
        a: "It compares a resume against a job description and returns a match score, the matched and missing skills, and specific, line-level edit suggestions. Think of it as a comparison tool - matching your resume to the role, not just scanning keywords.",
      },
      {
        q: "How is this different from a keyword scanner?",
        a: "Keyword scanners tell you which words appear. The AI reasons about context - seniority signals, phrasing, structure - and proposes edits that improve your alignment to the role.",
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
        a: "Yes. Anything you file can be removed from the archive at any time - the underlying document goes with it.",
      },
      {
        q: "Do I need an account?",
        a: "You'll need one to begin an analysis and to keep your archive between visits. It's an email and a password - no lengthy forms.",
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
        a: "Yes - analyses are print-friendly and copyable. Skills lists and suggestions can be copied to the clipboard in one click.",
      },
    ],
  },
];

const DEFAULT_OPEN = `${SECTIONS[0].title}::${SECTIONS[0].items[0].q}`;

function normalize(value) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function ChapterItem({ item, open, onToggle, chapterId, itemIndex, isFiltered = false }) {
  const panelId = `${chapterId}-${itemIndex}-panel`;
  const buttonId = `${chapterId}-${itemIndex}-button`;
  const panelRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(0);
  const [panelHeight, setPanelHeight] = useState(open ? "auto" : 0);

  useLayoutEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stop = () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    stop();

    if (reducedMotion) {
      setPanelHeight(open ? "auto" : 0);
      return undefined;
    }

    const node = panelRef.current;
    const inner = innerRef.current;
    if (!node || !inner) return undefined;

    if (open) {
      const target = inner.scrollHeight;
      setPanelHeight(0);
      rafRef.current = window.requestAnimationFrame(() => {
        setPanelHeight(target);
      });
    } else {
      const start = node.getBoundingClientRect().height || inner.scrollHeight;
      setPanelHeight(start);
      rafRef.current = window.requestAnimationFrame(() => {
        setPanelHeight(0);
      });
    }

    return stop;
  }, [open]);

  return (
    <div
      className="faq-accordion-item group"
      data-open={open ? "true" : "false"}
      data-filtered={isFiltered ? "true" : "false"}
    >
      <button
        id={buttonId}
        type="button"
        className="faq-accordion-button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="faq-accordion-question font-serif text-[18px] md:text-[19px] leading-snug text-ink">
          {item.q}
        </span>
        <span className="faq-accordion-icon" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" className="faq-accordion-plus">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div
        ref={panelRef}
        className="faq-answer-shell"
        aria-hidden={!open}
        style={{ height: panelHeight === "auto" ? "auto" : `${panelHeight}px` }}
        onTransitionEnd={(event) => {
          if (event.propertyName === "height" && open) {
            setPanelHeight("auto");
          }
        }}
      >
        <div ref={innerRef}>
          <div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="faq-answer-content text-[15px] leading-relaxed text-ink-muted"
          >
            {item.a}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChapterCard({
  section,
  index,
  openMap,
  toggleItem,
  filteredItems,
  visibleCount,
  sectionRef,
  active,
}) {
  const chapterId = `s-${index}`;
  const hasFilter = filteredItems.length !== section.items.length;

  return (
    <section ref={sectionRef} id={chapterId} className="faq-chapter scroll-mt-28">
      <Sheet
        className="faq-chapter-sheet p-5 md:p-6 lg:p-7"
        lift
        dogEar={index % 2 === 0}
        data-active={active ? "true" : "false"}
        style={{ "--faq-chapter-shift": index % 2 === 0 ? "0px" : "10px" }}
      >
        <div className="faq-chapter-header flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-3xl text-accent">{String(index + 1).padStart(2, "0")}</span>
              <Eyebrow>Chapter {String(index + 1).padStart(2, "0")}</Eyebrow>
            </div>
            <h2 className="mt-3 font-serif text-2xl md:text-[30px] leading-tight">{section.title}</h2>
          </div>

          <div className="faq-chapter-meta text-xs uppercase tracking-[0.18em] text-ink-muted">
            {visibleCount} question{visibleCount === 1 ? "" : "s"} visible
          </div>
        </div>

        <div className="rule-line faq-chapter-rule mt-5" />

        <div className="mt-5 space-y-1">
          {filteredItems.map((item, itemIndex) => {
            const open = openMap[`${section.title}::${item.q}`] ?? (index === 0 && itemIndex === 0);
            return (
              <ChapterItem
                key={item.q}
                item={item}
                open={open}
                onToggle={() => toggleItem(section.title, item.q)}
                chapterId={chapterId}
                itemIndex={itemIndex}
                isFiltered={hasFilter}
              />
            );
          })}
        </div>
      </Sheet>
    </section>
  );
}

export default function FAQ() {
  const rootRef = useRef(null);
  const sectionRefs = useRef([]);
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(`s-0`);
  const [openMap, setOpenMap] = useState({ [DEFAULT_OPEN]: true });

  const filteredSections = useMemo(() => {
    const q = normalize(query);

    if (!q) {
      return SECTIONS.map((section) => ({
        ...section,
        filteredItems: section.items,
      }));
    }

    return SECTIONS.map((section) => ({
      ...section,
      filteredItems: section.items.filter((item) => {
        const haystack = `${section.title} ${item.q} ${item.a}`;
        return normalize(haystack).includes(q);
      }),
    }));
  }, [query]);

  const visibleSections = filteredSections.filter((section) => section.filteredItems.length > 0);

  const toggleItem = (sectionTitle, question) => {
    const key = `${sectionTitle}::${question}`;
    setOpenMap((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  useEffect(() => {
    const root = rootRef.current;
    const nodes = sectionRefs.current.filter(Boolean);
    if (!root || typeof window === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const bestEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (bestEntry?.target?.id) {
          setActiveSection(bestEntry.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [filteredSections]);

  const handleContentsClick = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PublicSite>
      <div ref={rootRef} className="faq-shell relative isolate">
        <div aria-hidden="true" className="faq-ambient">
          <div className="faq-ambient__glow faq-ambient__glow--a" />
          <div className="faq-ambient__glow faq-ambient__glow--b" />
          <div className="faq-ambient__sheen" />
        </div>

        <section className="faq-hero relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7">
              <Eyebrow>Review 03 - Questions</Eyebrow>
              <h1 className="mt-5 font-serif text-[52px] md:text-[64px] leading-[1.02] tracking-tight max-w-3xl">
                Questions from
                <br />
                <span className="italic font-normal">the margins.</span>
              </h1>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-muted max-w-2xl">
                Short, honest answers about how the desk analyzes resumes, what it stores, and what to expect from a comparison.
              </p>
            </div>

            <div className="lg:col-span-5">
              <Sheet className="faq-hero-search sheet-lift p-5 md:p-6" dogEar>
                <PaperClip />
                <Eyebrow>Search the archive</Eyebrow>
                <label htmlFor="faq-search" className="sr-only">
                  Search FAQ
                </label>
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search questions or answers"
                  className="faq-search-input mt-4 w-full rounded-sm border border-rule/70 bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
                />
                <div className="mt-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-ink-muted">
                  <span>{visibleSections.length} chapters visible</span>
                  <span>{query ? "Filtered results" : "All questions"}</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Analysis", value: "01" },
                    { label: "Files", value: "02" },
                    { label: "Privacy", value: "03" },
                  ].map((item, index) => (
                    <div key={item.label} className="sheet faq-hero-stat p-3" style={{ "--card-offset": `${index * 2}px` }}>
                      <div className="font-serif text-2xl text-accent">{item.value}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-muted">{item.label}</div>
                    </div>
                  ))}
                </div>
              </Sheet>
            </div>
          </div>
        </section>

        <section className="faq-body relative z-10 mx-auto max-w-7xl px-6 pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="faq-contents sticky top-24">
                <Sheet className="faq-contents-sheet p-5 md:p-6" lift>
                  <div className="flex items-center justify-between gap-4">
                    <Eyebrow>Contents</Eyebrow>
                  </div>

                  <ol className="mt-5 space-y-2">
                    {filteredSections.map((section, index) => {
                      if (section.filteredItems.length === 0) return null;
                      const id = `s-${index}`;
                      const isActive = activeSection === id;
                      return (
                        <li key={section.title}>
                          <a
                            href={`#${id}`}
                            onClick={(event) => handleContentsClick(event, id)}
                            className="faq-toc-link group flex items-baseline gap-3"
                            data-active={isActive ? "true" : "false"}
                          >
                            <span className="faq-toc-number font-serif text-sm text-accent">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="faq-toc-title font-serif text-[15px] transition-colors">
                              {section.title}
                            </span>
                          </a>
                        </li>
                      );
                    })}
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

            <div className="lg:col-span-8 space-y-8 md:space-y-10">
              {filteredSections.map((section, index) => {
                if (section.filteredItems.length === 0) return null;

                return (
                  <ChapterCard
                    key={section.title}
                    section={section}
                    index={index}
                    openMap={openMap}
                    toggleItem={toggleItem}
                    filteredItems={section.filteredItems}
                    visibleCount={section.filteredItems.length}
                    sectionRef={(node) => {
                      sectionRefs.current[index] = node;
                    }}
                    active={activeSection === `s-${index}`}
                  />
                );
              })}

              <Sheet className="faq-cta-panel faq-chapter-sheet p-6 md:p-8 lg:p-10" lift stack dogEar>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5">
                    <Eyebrow>Still curious?</Eyebrow>
                    <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight">
                      The desk works best <span className="italic font-normal">with a resume and a job description.</span>
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                      If you're ready, start an analysis and see the comparison in context.
                    </p>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="landing-section-bridge mb-6" />
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/app/analyze"
                        className="landing-action landing-action--primary px-6 py-3.5 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
                      >
                        Begin an analysis
                      </Link>
                      <Link
                        to="/features"
                        className="landing-action landing-action--secondary px-6 py-3.5 text-sm border border-ink/20 hover:border-ink/60 transition-colors rounded-sm"
                      >
                        Back to features
                      </Link>
                    </div>
                  </div>
                </div>
              </Sheet>
            </div>
          </div>
        </section>
      </div>
    </PublicSite>
  );
}
