import { Sheet, PaperClip, Eyebrow, StickyNote } from "../../components/paper.jsx";
import { Link } from "react-router-dom";

const MOCK_REPORT = {
  matchPercent: 87,
  matchedSkills: ["React", "JavaScript", "Node.js", "REST APIs", "Figma", "Design Systems"],
  missingSkills: ["TypeScript", "Testing", "Docker", "GraphQL"],
  suggestions: [
    "Add TypeScript experience to improve alignment with the role's technical requirements.",
    "Include unit and integration testing examples to address the missing testing skill.",
    "Highlight containerization and deployment experience with Docker.",
    "Reframe two bullets to lead with quantified impact rather than responsibilities.",
  ],
  jobDescription: "We are looking for a qualified candidate to join our team. You will build user interfaces and design backend services. Additionally, we expect experience with TypeScript, unit Testing, and containerization using Docker.",
  resumeFilename: "Your_Resume.pdf",
  createdAt: new Date().toISOString(),
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => {
    if (c === "&") return "&";
    if (c === "<") return "<";
    if (c === ">") return ">";
    if (c === '"') return "";
    if (c === "'") return "";
    return c;
  });
}

function highlightJD(jd, matched, missing) {
  if (!jd) return "";
  const esc = (arr) => arr.filter(Boolean).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matchedEsc = esc(matched).sort((a, b) => b.length - a.length);
  const missingEsc = esc(missing).sort((a, b) => b.length - a.length);
  let html = escapeHtml(jd);
  if (matchedEsc.length) {
    const re = new RegExp(`\\b(${matchedEsc.join("|")})\\b`, "gi");
    html = html.replace(re, (m) => `<mark class="bg-highlight px-0.5 rounded-sm">${m}</mark>`);
  }
  if (missingEsc.length) {
    const re = new RegExp(`\\b(${missingEsc.join("|")})\\b`, "gi");
    html = html.replace(
      re,
      (m) => `<mark class="bg-destructive/10 text-destructive underline decoration-destructive/40 decoration-dotted px-0.5 rounded-sm">${m}</mark>`
    );
  }
  return html;
}

export default function ImprovePreview() {
  const report = MOCK_REPORT;
  const jd = MOCK_REPORT.jobDescription;
  const matchPercent = MOCK_REPORT.matchPercent;
  const matched = MOCK_REPORT.matchedSkills;
  const missing = MOCK_REPORT.missingSkills;

  return (
    <section className="landing-scene landing-scene--improve relative -mt-8 pb-20 md:-mt-12 md:pb-24 border-t border-rule/60">
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Eyebrow>Chapter 5 · Improve</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              The brief,
              <br />
              <span className="italic font-normal">marked and returned.</span>
            </h2>
            <p className="mt-5 text-ink-muted text-[15px] leading-relaxed max-w-md">
              See the role brief with every matched keyword underlined and every
              missing requirement flagged. The evidence sits beside the text.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {/* JD Comparison Sheet */}
            <Sheet className="relative p-4 md:p-6 ruled" lift>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <Eyebrow>Job description · Keywords marked</Eyebrow>
                  <div className="mt-2 font-serif text-2xl leading-tight">
                    The brief, side by side
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-highlight" />
                    <span>On the page</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-destructive/10 border border-destructive/30" />
                    <span>Missing</span>
                  </span>
                  <span className="font-mono">{jd.trim().split(/\s+/).length} words</span>
                </div>
              </div>
              <div className="rule-line mt-4 mb-6" />
              <div
                className="text-[15px] leading-[28px] whitespace-pre-wrap text-ink font-serif"
                dangerouslySetInnerHTML={{ __html: highlightJD(jd, matched, missing) }}
              />
            </Sheet>

            {/* Suggestions */}
            <Sheet className="relative p-4 md:p-6" dogEar lift>
              <PaperClip />
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <Eyebrow>Suggestions · Margin notes</Eyebrow>
                <span className="text-xs text-ink-muted">Copy to clipboard</span>
              </div>
              <div className="rule-line my-4" />
              <ol className="space-y-5">
                {report.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-serif text-accent text-[15px] w-6 shrink-0 mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-serif text-[16px] leading-[1.65] text-ink flex-1">{s}</p>
                  </li>
                ))}
              </ol>
            </Sheet>

            {/* Sticky Note + How to work through */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <StickyNote rotate={-2}>
                  <div className="text-[13.5px] leading-snug">
                    <div className="eyebrow text-[10px]">A note in the margin</div>
                    <div className="mt-1 font-serif">
                      Read these as edits, not orders. Keep your voice — the AI suggests, you decide.
                    </div>
                  </div>
                </StickyNote>
              </div>
              <div className="lg:col-span-4">
                <Sheet className="relative p-6" lift>
                  <Eyebrow>How to work through these</Eyebrow>
                  <div className="rule-line mt-3 mb-4" />
                  <ol className="space-y-3 text-sm">
                    {[
                      "Start with any suggestion that fixes a missing skill.",
                      "Reword one bullet at a time — don't rewrite whole sections.",
                      "Re-run the review after 2–3 edits to see the score move.",
                    ].map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-serif text-ink-muted/70 w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-ink-muted">{t}</span>
                      </li>
                    ))}
                  </ol>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}