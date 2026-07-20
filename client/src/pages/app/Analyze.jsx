import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, Eyebrow, StickyNote, PaperClip } from "../../components/paper.jsx";
import api from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useReport } from "../../contexts/ReportContext.jsx";
import { useAbortController, useRequestDedupe } from "../../hooks/useAbortController.js";

const LS_JD_KEY = "ra_jd_v1";
const LS_LAST_RESULT = "ra_last_result_v1";
const MAX_MB = 5;

// Validate file type and size before uploading
function validateFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5 MB
  const allowedExt = ['.pdf', '.docx'];
  const ext = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
  const dotExt = '.' + ext;
  if (!allowedExt.includes(dotExt)) {
    return 'Only PDF (.pdf) and Word (.docx) files are supported.';
  }
  if (file.size > maxSize) {
    return 'File size exceeds the 5 MB limit.';
  }
  return null;
}



const READING_STAGES = [
  "Reading the resume…",
  "Parsing sections and headings…",
  "Comparing against the role brief…",
  "Marking matched and missing requirements…",
  "Drafting review notes…",
];

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

export default function Analyze() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentReportId, clearCurrentReport } = useReport();
  const { getController, abort: abortRequest, isAborted, cleanup: cleanupAbort } = useAbortController();
  const { startRequest, endRequest, isInFlight } = useRequestDedupe();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const progressRef = useRef(null);
  const stageRef = useRef(null);

  function resetFileInput() {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearStoredAnalysisReferences() {
    clearCurrentReport();
    try {
      localStorage.removeItem(LS_LAST_RESULT);
    } catch {}
  }

  // Close guest modal on Escape key
  useEffect(() => {
    if (!showGuestModal) return;
    const onKey = (e) => e.key === "Escape" && setShowGuestModal(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showGuestModal]);

  // Restore saved JD
  useEffect(() => {
    const saved = localStorage.getItem(LS_JD_KEY);
    if (saved) setJd(saved);
  }, []);

  // Autosave JD
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(LS_JD_KEY, jd || ""), 400);
    return () => clearTimeout(id);
  }, [jd]);

  // Clean up intervals and abort controller on unmount
  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (stageRef.current) clearInterval(stageRef.current);
      abortRequest();
    };
  }, [abortRequest]);

  const wordCount = useMemo(
    () => (jd.trim() ? jd.trim().split(/\s+/).length : 0),
    [jd]
  );

  async function handleAnalyze() {
    if (isInFlight("analyze")) {
      return;
    }
    if (!startRequest("analyze")) {
      return;
    }

    setError(null);
    if (!file) {
      setError("Please attach a resume before starting the review.");
      endRequest("analyze");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`The resume is larger than ${MAX_MB} MB.`);
      endRequest("analyze");
      return;
    }
    if (!jd.trim()) {
      setError("Please paste the job description so we can compare it against your resume.");
      endRequest("analyze");
      return;
    }

    if (!user) {
      setShowGuestModal(true);
      endRequest("analyze");
      return;
    }

    clearStoredAnalysisReferences();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jd);

    const controller = getController();

    try {
      setLoading(true);
      setProgress(8);
      setStageIdx(0);

      progressRef.current = setInterval(() => {
        setProgress((p) => Math.min(92, p + Math.random() * 12));
      }, 350);

      stageRef.current = setInterval(() => {
        setStageIdx((i) => Math.min(READING_STAGES.length - 1, i + 1));
      }, 1400);

      const res = await api.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: controller.signal,
      });

      if (isAborted()) {
        return;
      }

      clearInterval(progressRef.current);
      clearInterval(stageRef.current);
      setProgress(100);
      setStageIdx(READING_STAGES.length - 1);

      const id = res.data?.id;
      if (id) {
        setCurrentReportId(id);
      }
      const payload = { ...res.data, jobDescription: jd };
      try {
        localStorage.setItem(LS_LAST_RESULT, JSON.stringify(payload));
      } catch {}

      setTimeout(() => navigate("/app/report"), 450);
    } catch (err) {
      if (isAborted() || err?.name === "CanceledError" || err?.name === "AbortError") {
        return;
      }
      if (progressRef.current) clearInterval(progressRef.current);
      if (stageRef.current) clearInterval(stageRef.current);
      setProgress(0);
      setStageIdx(0);
      const isNetworkError = !err?.response;
      setError(
        isNetworkError
          ? "Cannot reach the server. Please check your connection."
          : err?.response?.data?.error ||
            err?.message ||
            "We couldn't complete the review. Please try again."
      );
    } finally {
      endRequest("analyze");
      setLoading(false);
    }
  }

  // Validation helpers for file uploads
  function handleFileSelect(file) {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setFile(null);
      clearStoredAnalysisReferences();
    } else {
      setError(null);
      clearStoredAnalysisReferences();
      setFile(file);
    }
    resetFileInput();
  }

  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
    else resetFileInput();
  }

  function handleOpenLogin() {
    setShowGuestModal(false);
    navigate("/login", {
      state: { from: { pathname: "/app/analyze" } },
    });
  }

  function handleOpenSignup() {
    setShowGuestModal(false);
    navigate("/signup", {
      state: { from: { pathname: "/app/analyze" } },
    });
  }

  function handleReset() {
    setFile(null);
    setJd("");
    setError(null);
    setProgress(0);
    setStageIdx(0);
    clearStoredAnalysisReferences();
    try {
      localStorage.removeItem(LS_JD_KEY);
    } catch {}
    resetFileInput();
  }

  function onDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }

  function clearFile() {
    setFile(null);
    clearStoredAnalysisReferences();
    resetFileInput();
  }

  function handleReplaceFile() {
    resetFileInput();
    fileInputRef.current?.click();
  }

  const canSubmit = Boolean(file) && jd.trim().length > 0 && !loading;

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header>
        <Eyebrow>Review</Eyebrow>
        <h1 className="mt-3 font-serif text-[44px] md:text-[52px] leading-[1.02] tracking-tight">
          Upload your resume
          <br />
          <span className="italic font-normal">to begin.</span>
        </h1>
<p className="mt-5 text-[15px] leading-relaxed text-ink-muted max-w-xl">
          Drop a PDF or DOCX, paste the job description, and we'll compare your
          resume against the requirements.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* WORKBENCH — main sheet */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Document drop */}
          <Sheet className="relative p-6 md:p-10 landing-feature-card" dogEar lift>
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
            <div className="rule-line my-4" />

            {file ? (
              <FileCard file={file} onReplace={handleReplaceFile} onClear={clearFile}>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={onPickFile}
                />
              </FileCard>
            ) : (
              <label
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Upload resume file (PDF or DOCX, max 5MB)"
                className={`group block relative border border-dashed rounded-sm py-14 md:py-16 px-6 md:px-8 text-center cursor-pointer transition-all ${
                  drag
                    ? "border-accent bg-accent/5 scale-[1.003]"
                    : "border-rule hover:border-ink/40 hover:bg-secondary/25"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={onPickFile}
                  id="resume-upload"
                  aria-label="Upload your resume (PDF or DOCX, max 5MB)"
                  aria-describedby="resume-upload-hint"
                />
                <span id="resume-upload-hint" className="sr-only">
                  Choose a PDF or DOCX file up to 5MB
                </span>
                <PaperStack tilt={drag} />
<div className="mt-6 font-serif text-2xl md:text-[26px]">
                  {drag ? "Drop it here." : "Drop your resume here"}
                </div>
                <div className="mt-2 text-sm text-ink-muted">
                  or <span className="underline underline-offset-4 decoration-rule group-hover:decoration-ink">click to choose</span>
                  <span className="md:hidden"> · PDF, DOCX · ≤ {MAX_MB} MB</span>
                </div>
              </label>
            )}
          </Sheet>

          {/* Job description — editorial writing sheet */}
          <Sheet className="relative p-4 md:p-6 landing-feature-card" lift>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <Eyebrow>Step 02 · The role brief</Eyebrow>
                <div className="mt-2 font-serif text-2xl leading-tight">
                  Paste the role brief
                </div>
              </div>
              <span className="eyebrow text-[10px]">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
            </div>
            <div className="rule-line my-4" />

            <div className="relative">
              {/* Left-margin editorial ruling */}
              <div className="absolute top-0 bottom-0 left-6 w-px bg-destructive/25 pointer-events-none hidden md:block" />
              <textarea
                rows={10}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the role brief here, exactly as posted…"
                className="ruled w-full pl-4 md:pl-12 pr-4 py-2 bg-transparent border-0 focus:outline-none text-[15px] leading-[28px] font-serif text-ink placeholder:text-ink-muted/50 resize-y"
              />
            </div>

            <div className="mt-3 text-[11px] text-ink-muted italic font-serif">
              Your draft stays saved as you type, so it will still be here if you step away.
            </div>
          </Sheet>

          {/* Error */}
          {error && (
            <div className="border-l-2 border-destructive/60 bg-destructive/5 pl-4 pr-4 py-3 text-sm font-serif italic text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-ink-muted italic font-serif">
              Your review is private. Filed under your archive only.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm disabled:opacity-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!canSubmit}
                className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
              {loading ? "Reviewing…" : "Begin review →"}
              </button>
            </div>
          </div>

          {/* Reading progress — feels like document analysis, not a spinner */}
          {loading && (
            <ReadingProgress progress={progress} stageIdx={stageIdx} file={file} />
          )}
        </div>

        {/* RIGHT RAIL */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <StickyNote rotate={-2}>
            <div className="text-[13.5px] leading-snug">
              "Upload the version you'd actually send. We compare the resume against the role, not the draft."
            </div>
          </StickyNote>

          <Sheet className="relative p-4 landing-feature-card" lift>
            <Eyebrow>What the review checks</Eyebrow>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "Role match percentage",
                "Matched evidence in the resume",
                "Missing requirements to flag",
                "Suggested improvements for your resume",
                "Role keywords highlighted",
              ].map((x, i) => (
                <li key={x} className="flex gap-3">
                  <span className="text-accent font-serif shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-muted">{x}</span>
                </li>
              ))}
            </ul>
          </Sheet>

          <Sheet className="relative p-4 landing-feature-card" lift>
            <Eyebrow>Review rules</Eyebrow>
            <div className="rule-line mt-3 mb-4" />
            <dl className="space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">File types</dt>
                <dd className="font-serif text-ink">PDF · DOCX</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Max size</dt>
                <dd className="font-serif text-ink">{MAX_MB} MB</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Review time</dt>
                <dd className="font-serif italic text-ink">~ 20 seconds</dd>
              </div>
            </dl>
          </Sheet>
        </aside>
      </div>

      {showGuestModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-up">
          <Sheet className="!shadow-overlay relative p-8 md:p-10 max-w-md w-full" dogEar lift>
            <PaperClip aria-hidden="true" />
            <Eyebrow>Sign in required</Eyebrow>
            <h3 className="font-serif text-2xl mt-3 mb-4">Start a review</h3>
            <p className="text-[15px] leading-relaxed text-ink-muted">
              Create a free account to:
            </p>
            <ul className="mt-4 mb-6 space-y-2.5 text-sm">
              {[
                "Review your own resume",
                "Generate review reports",
                "Save past reviews",
                "Track revisions",
              ].map((item, i) => (
                <li key={item} className="flex gap-2.5 items-baseline">
                  <span className="text-accent font-serif shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-muted">{item}</span>
                </li>
              ))}
            </ul>
            <div className="rule-line my-5" />
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleOpenLogin}
                className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 rounded-sm transition-colors"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={handleOpenSignup}
                className="px-5 py-3 bg-ink text-paper text-sm rounded-sm hover:bg-ink/90 transition-colors"
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                className="px-4 py-2.5 text-sm border border-ink/20 hover:border-ink/60 hover:bg-secondary rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                Close
              </button>
            </div>
          </Sheet>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function PaperStack({ tilt }) {
  return (
    <div
      className={`mx-auto w-16 h-20 relative transition-transform duration-300 ${
        tilt ? "scale-[1.01] -rotate-[1deg]" : ""
      }`}
    >
      <div className="absolute inset-0 bg-paper border border-rule shadow-stack rotate-[-4deg]" />
      <div className="absolute inset-0 bg-paper border border-rule shadow-paper rotate-[3deg] translate-x-1" />
      <div className="absolute inset-x-3 top-4 h-px bg-rule" />
      <div className="absolute inset-x-3 top-7 h-px bg-rule" />
      <div className="absolute inset-x-3 top-10 h-px bg-rule" />
    </div>
  );
}

function FileCard({ file, onReplace, onClear, children }) {
  return (
    <div className="relative">
      {children}
      <div className="flex items-center gap-4 p-4 md:p-5 bg-secondary/40 border border-rule rounded-sm shadow-paper hover:shadow-paper-lift transition-all duration-200">
        {/* Mini document */}
        <div className="relative h-14 w-11 shrink-0">
          <div className="absolute inset-0 bg-paper border border-rule shadow-paper rounded-[2px]" />
          <div className="absolute top-1.5 left-1.5 right-1.5 h-px bg-rule" />
          <div className="absolute top-3 left-1.5 right-3 h-px bg-rule" />
          <div className="absolute top-4.5 left-1.5 right-2 h-px bg-rule" />
          <div className="absolute bottom-1 left-1.5 right-1.5 text-[7px] font-mono text-ink-muted text-center">
            {fileKind(file.name)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="eyebrow text-[10px]">Attached</div>
          <div className="mt-0.5 font-serif text-[16px] leading-tight truncate">
            {file.name}
          </div>
          <div className="text-[12px] text-ink-muted">
            {fileKind(file.name)} · {fmtSize(file.size)}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onReplace}
            className="text-[12px] px-3 py-1.5 border border-ink/15 hover:border-ink/50 rounded-sm transition-colors"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={onClear}
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
  );
}

function ReadingProgress({ progress, stageIdx, file }) {
  return (
    <Sheet className="relative p-6 md:p-8 overflow-hidden landing-feature-card" lift>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <Eyebrow>Review in progress</Eyebrow>
          <div className="mt-2 font-serif text-xl leading-tight">
            {file?.name || "Your resume"}
          </div>
        </div>
        <span className="font-mono text-xs text-ink-muted">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Scanning surface — a small ruled sheet with a moving reading line */}
      <div className="relative mt-6 h-24 md:h-28 bg-paper border border-rule rounded-sm overflow-hidden ruled">
        {/* Reading line */}
        <div
          className="absolute left-0 right-0 h-[2px] bg-accent/80 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-500 ease-out"
          style={{ top: `${Math.max(6, Math.min(92, progress))}%` }}
        />
        {/* Highlighter sweep at the tip */}
        <div
          className="absolute left-0 right-0 h-6 bg-highlight/30 -mt-3 transition-all duration-500 ease-out"
          style={{ top: `${Math.max(6, Math.min(92, progress))}%` }}
        />
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-[3px] w-full bg-rule/70 rounded overflow-hidden">
        <div
          className="h-full bg-ink transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage list */}
      <ol className="mt-5 space-y-1.5">
        {READING_STAGES.map((label, i) => {
          const done = i < stageIdx;
          const current = i === stageIdx;
          return (
            <li
              key={label}
              className={`flex items-baseline gap-3 text-sm transition-colors ${
                current ? "text-ink" : done ? "text-ink-muted" : "text-ink-muted/50"
              }`}
            >
              <span className="font-serif text-[12px] w-5 shrink-0 text-ink-muted/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`font-serif ${current ? "italic" : ""}`}>
                {label}
              </span>
              {done && <span className="text-accent">·</span>}
            </li>
          );
        })}
      </ol>
    </Sheet>
  );
}
