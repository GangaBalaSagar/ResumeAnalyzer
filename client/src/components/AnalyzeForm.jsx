import { useEffect, useRef, useState } from "react";
import api from "../api";
import ResultsPanel from "./ResultsPanel";

const LS_JD_KEY = "ra_jd_v1";
const LS_LAST_RESULT = "ra_last_result_v1";

export default function AnalyzeForm() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const progressRef = useRef(null);
  const fileInputRef = useRef(null); // important

  useEffect(() => {
    const saved = localStorage.getItem(LS_JD_KEY);
    if (saved) setJd(saved);

    const savedResult = localStorage.getItem(LS_LAST_RESULT);
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(LS_JD_KEY, jd || "");
    }, 400);
    return () => clearTimeout(id);
  }, [jd]);

  async function handleAnalyze() {
    if (!file) return alert("Please upload a resume");
    if (!jd.trim()) return alert("Enter job description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jd);

    try {
      setLoading(true);
      setProgress(6);

      progressRef.current = setInterval(() => {
        setProgress((p) => Math.min(92, p + Math.random() * 12));
      }, 350);

      const res = await api.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressRef.current);
      setProgress(100);
      setTimeout(() => setProgress(0), 400);

      setResult(res.data);

      try {
        localStorage.setItem(LS_LAST_RESULT, JSON.stringify(res.data));
      } catch (e) {}
    } catch (err) {
      clearInterval(progressRef.current);
      setProgress(0);
      alert(err.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setJd("");
    setResult(null);
    setProgress(0);

    try {
      localStorage.removeItem(LS_JD_KEY);
      localStorage.removeItem(LS_LAST_RESULT);
    } catch (e) {}

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      const ta = document.querySelector("textarea");
      if (ta) ta.style.height = "auto";
    }, 10);
  }

  function onDropFile(e) {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  }

  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function filePreview() {
    if (!file) return null;
    const sizeKB = Math.round(file.size / 1024);
    return `${file.name} • ${sizeKB} KB • ${file.type || "unknown"}`;
  }

  return (
    <div className="analysis-grid">
      {/* LEFT CARD */}
      <div className="card">
        <h3>Analyze Resume</h3>

        {/* -------------------------------
            FUTURISTIC FULL-WIDTH UPLOAD BOX
        -------------------------------- */}
        <div
          className="upload-box"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropFile}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">⬆</div>

          <div className="upload-title">Upload Resume</div>
          <div className="upload-sub">Drag & drop or click to browse</div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={onPickFile}
            style={{ display: "none" }}
          />

          {file && (
            <div className="upload-file-info small">{filePreview()}</div>
          )}
        </div>

        {/* TEXTAREA */}
        <div style={{ marginTop: 16 }}>
          <label className="small">Job Description</label>
          <textarea
            placeholder="Paste job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn" disabled={loading} onClick={handleAnalyze}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>

            <button
              className="btn btn-danger"
              type="button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

            {loading && (
              <div className="small muted">Processing your file…</div>
            )}
          </div>

          <div className="progress-wrap" style={{ marginTop: 12 }}>
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="card results-panel">
        {result ? (
          <ResultsPanel result={result.analysis} id={result.id} jd={jd} />
        ) : (
          <div>
            <h3>Analysis Result</h3>
            <div className="small muted" style={{ marginTop: 8 }}>
              Run an Analysis to see Charts, Skills,  AI Suggestions and Job Description preview keywords highlighted.
            </div>
            <div
              style={{ marginTop: 18 }}
              className="chart-wrap center small muted"
            >
              No data yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
