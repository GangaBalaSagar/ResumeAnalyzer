import { useEffect, useRef, useState } from "react";
import api from "../api";
import ResultsPanel from "./ResultsPanel";
import { useAuthGate } from "./auth/AuthGate";
import UploadBox from "./analyze/UploadBox";
import JobDescriptionInput from "./analyze/JobDescriptionInput";
import ActionControls from "./analyze/ActionControls";
import { useAuth } from "../context/AuthContext";

const LS_JD_KEY = "ra_jd_v1";
const LS_LAST_RESULT = "ra_last_result_v1";

export default function AnalyzeForm() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const { requireAuth } = useAuthGate();
  const { user } = useAuth();
  const progressRef = useRef(null);
  const fileInputRef = useRef(null);

  // Reset form and cache on logout
  useEffect(() => {
    if (!user) {
      handleReset();
    }
  }, [user]);

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
    if (f) {
      const validationError = validateFile(f);
      if (validationError) {
        setUploadError(validationError);
        // Clear any previously selected file
        setFile(null);
        return;
      }
      setUploadError("");
      setFile(f);
    }
  }

  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (f) {
      const validationError = validateFile(f);
      if (validationError) {
        setUploadError(validationError);
        // Clear any previously selected file
        setFile(null);
        // Reset file input so the same invalid file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setUploadError("");
      setFile(f);
    }
  }

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

        <UploadBox
          file={file}
          fileInputRef={fileInputRef}
          onDropFile={onDropFile}
          onPickFile={onPickFile}
          filePreview={filePreview}
        />
        {uploadError && (
          <div className="upload-error">
            {uploadError}
          </div>
        )}

        <JobDescriptionInput jd={jd} setJd={setJd} />

        <ActionControls
          loading={loading}
          progress={progress}
          onAnalyze={() => requireAuth(handleAnalyze)}
          onReset={handleReset}
        />
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
