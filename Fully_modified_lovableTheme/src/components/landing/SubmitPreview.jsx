import { Sheet, PaperClip, Eyebrow, StickyNote } from "../../components/paper.jsx";

const MAX_MB = 5;

function fmtSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKind(name = "") {
  const ext = name.split(".").pop()?.toUpperCase();
  return ext && ext.length <= 5 ? ext : "FILE";
}

export default function SubmitPreview() {
  const mockFile = { name: "Mara_Designer_Resume.pdf", size: 245760 };
  const mockJD = "We are looking for a Senior Product Designer to join our team. You will lead design for core product surfaces, collaborate with engineering and product management, and define design systems. Required: 5+ years product design, Figma expertise, design systems experience, portfolio demonstrating shipped consumer products.";

  return (
    <section className="landing-scene landing-scene--submit relative -mt-2 pt-10 pb-18 md:-mt-4 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Eyebrow>Chapter 2 · Submit</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              Place your resume
              <br />
              <span className="italic font-normal">on the desk.</span>
            </h2>
            <p className="mt-5 text-ink-muted text-[15px] leading-relaxed max-w-md">
              Drop your resume, paste the role brief, and begin the review.
              The same desk. The same paper. The same care.
            </p>
            <div className="mt-8 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              <span className="h-px flex-1 bg-rule/60" />
              <span>Two sheets. One review.</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Resume Sheet */}
            <Sheet className="relative p-6 md:p-10" lift dogEar>
              <PaperClip />
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <Eyebrow>Step 01 · The resume</Eyebrow>
                  <div className="mt-2 font-serif text-2xl leading-tight">
                    Upload your resume
                  </div>
                </div>
                <span className="hidden md:block eyebrow text-[10px]">
                  PDF · DOCX · ≤ {MAX_MB} MB
                </span>
              </div>
              <div className="rule-line my-6" />

              {/* File Card - attached state */}
              <div className="relative">
                <div className="flex items-center gap-4 p-4 md:p-5 bg-secondary/40 border border-rule rounded-sm shadow-paper">
                  {/* Mini document */}
                  <div className="relative h-14 w-11 shrink-0">
                    <div className="absolute inset-0 bg-paper border border-rule shadow-paper rounded-[2px]" />
                    <div className="absolute top-1.5 left-1.5 right-1.5 h-px bg-rule" />
                    <div className="absolute top-3 left-1.5 right-3 h-px bg-rule" />
                    <div className="absolute top-4.5 left-1.5 right-2 h-px bg-rule" />
                    <div className="absolute bottom-1 left-1.5 right-1.5 text-[7px] font-mono text-ink-muted text-center">
                      {fileKind(mockFile.name)}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="eyebrow text-[10px]">Attached</div>
                    <div className="mt-0.5 font-serif text-[16px] leading-tight truncate">
                      {mockFile.name}
                    </div>
                    <div className="text-[12px] text-ink-muted">
                      {fileKind(mockFile.name)} · {fmtSize(mockFile.size)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-[12px] px-3 py-1.5 border border-ink/15 hover:border-ink/50 rounded-sm transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      aria-label="Remove document"
                      className="h-8 w-8 inline-flex items-center justify-center text-ink-muted hover:text-ink border border-transparent hover:border-ink/20 rounded-sm transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Sheet>

            {/* Job Description Sheet */}
            <Sheet className="relative p-6 md:p-10" lift>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <Eyebrow>Step 02 · The role brief</Eyebrow>
                  <div className="mt-2 font-serif text-2xl leading-tight">
                    Paste the role brief
                  </div>
                </div>
                <span className="eyebrow text-[10px]">
                  {mockJD.trim().split(/\s+/).length} words
                </span>
              </div>
              <div className="rule-line my-6" />

              <div className="relative">
                {/* Left-margin editorial ruling */}
                <div className="absolute top-0 bottom-0 left-6 w-px bg-destructive/25 pointer-events-none hidden md:block" />
                <textarea
                  rows={8}
                  value={mockJD}
                  readOnly
                  className="ruled w-full pl-4 md:pl-12 pr-4 py-2 bg-transparent border-0 focus:outline-none text-[15px] leading-[28px] font-serif text-ink placeholder:text-ink-muted/50 resize-none min-h-[220px]"
                >
{mockJD}
                </textarea>
              </div>

              <div className="mt-3 text-[11px] text-ink-muted italic font-serif">
                Your draft stays saved as you type, so it will still be here if you step away.
              </div>
            </Sheet>

            {/* Sticky Note Guidance */}
            <StickyNote rotate={-2} className="max-w-xl">
              <div className="text-[13.5px] leading-snug">
                "Upload the version you'd actually send. We compare the resume against the role, not the draft."
              </div>
            </StickyNote>

            {/* Actions Preview */}
            <Sheet className="relative p-6 md:p-8" lift>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="text-xs text-ink-muted italic font-serif">
                  Your review is private. Filed under your archive only.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
                  >
                    Begin review →
                  </button>
                </div>
              </div>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}