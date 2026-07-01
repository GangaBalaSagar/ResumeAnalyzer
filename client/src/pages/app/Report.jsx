import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AnalysisDetail from "../../components/AnalysisDetail";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { useReport } from "../../context/ReportContext";
import demoReport from "../../demoReport.json";

export default function Report() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openLoginModal, openSignupModal } = useAuthModal();
  const { currentReportId } = useReport();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) {
      setData(demoReport);
      return;
    }

    if (!currentReportId) {
      setData(null);
      return;
    }

    api.get(`/analyses/${currentReportId}`).then((res) => setData(res.data));
  }, [currentReportId, user]);

  if (!user) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem" }}>
          <h2>📊 Demo Report</h2>
          <p>This is a sample ATS analysis.</p>
          <p>Sign in to analyze your own resume and generate personalized reports.</p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => openLoginModal()}>Login</button>
            <button type="button" onClick={() => openSignupModal()}>Sign Up</button>
          </div>
        </div>
        <AnalysisDetail reportData={demoReport} onClose={() => navigate("/app/history")} />
      </div>
    );
  }

  if (!currentReportId) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>📊 Analysis Report</h2>
        <p>No report selected yet.</p>
        <p>Run a resume analysis or open one from History.</p>
        <button type="button" onClick={() => navigate("/app/analyze")}>Go to Analyze</button>
      </div>
    );
  }

  if (!data) return null;

  return <AnalysisDetail id={currentReportId} onClose={() => navigate("/app/history")} />;
}
