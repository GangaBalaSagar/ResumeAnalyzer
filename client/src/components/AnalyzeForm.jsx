import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuthGate } from "./auth/AuthGate";
import UploadBox from "./analyze/UploadBox";
import JobDescriptionInput from "./analyze/JobDescriptionInput";
import ActionControls from "./analyze/ActionControls";
import { useAuth } from "../context/AuthContext";
import { useReport } from "../context/ReportContext";

const LS_JD_KEY = "ra_jd_v1";

export default function AnalyzeForm() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [showGuestModal, setShowGuestModal] = useState(false);

  const { requireAuth } = useAuthGate();
  const { user } = useAuth();
  const { setCurrentReportId } = useReport();
  const navigate = useNavigate();
  const progressIntervalRef = useRef(null);
  const progressResetTimeoutRef = useRef(null);
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
  }, []);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (progressResetTimeoutRef.current) {
        clearTimeout(progressResetTimeoutRef.current);
        progressResetTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(LS_JD_KEY, jd || "");
    }, 400);
    return () => clearTimeout(id);
  }, [jd]);

  function clearProgressTimers() {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (progressResetTimeoutRef.current) {
      clearTimeout(progressResetTimeoutRef.current);
      progressResetTimeoutRef.current = null;
    }
  }

  async function handleAnalyze() {
    if (!file) return alert("Please upload a resume");
    if (!jd.trim()) return alert("Enter job description");

    if (!user) {
      setShowGuestModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jd);

    try {
      setLoading(true);
      setProgress(6);

      progressIntervalRef.current = setInterval(() => {
        setProgress((p) => Math.min(92, p + Math.random() * 12));
      }, 350);

      const res = await api.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearProgressTimers();
      setProgress(100);
      progressResetTimeoutRef.current = setTimeout(() => {
        setProgress(0);
        progressResetTimeoutRef.current = null;
      }, 400);

      const id = res.data?.id;
      if (id) {
        setCurrentReportId(id);
      }
      navigate("/app/report", { state: { from: "/app/analyze" } });
    } catch (err) {
      clearProgressTimers();
      setProgress(0);
      alert(err.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenLogin() {
    setShowGuestModal(false);
    navigate("/login");
  }

  function handleOpenSignup() {
    setShowGuestModal(false);
    navigate("/signup");
  }

  function handleReset() {
    clearProgressTimers();
    setFile(null);
    setJd("");
    setProgress(0);

    try {
      localStorage.removeItem(LS_JD_KEY);
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
      {showGuestModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(17, 24, 39, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "2rem", maxWidth: "420px", width: "90%", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginTop: 0 }}>🔒 Analyze Your Resume</h3>
            <p>Create a free account to:</p>
            <ul style={{ paddingLeft: "1.2rem", marginBottom: "1rem" }}>
              <li>Analyze your own resume</li>
              <li>Generate ATS reports</li>
              <li>Save analysis history</li>
              <li>Track improvements</li>
            </ul>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button type="button" onClick={handleOpenLogin}>Login</button>
              <button type="button" onClick={handleOpenSignup}>Sign Up</button>
              <button type="button" onClick={() => setShowGuestModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
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
          onAnalyze={() => {
            if (!user) {
              setShowGuestModal(true);
              return;
            }
            requireAuth(handleAnalyze);
          }}
          onReset={handleReset}
        />
      </div>

    </div>
  );
}
