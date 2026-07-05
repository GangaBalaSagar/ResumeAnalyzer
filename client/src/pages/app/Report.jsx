import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AnalysisDetail from "../../components/AnalysisDetail";
import { useAuth } from "../../context/AuthContext";
import { useReport } from "../../context/ReportContext";
import demoReport from "../../demoReport.json";

export default function Report() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentReportId } = useReport();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setData(demoReport);
      setError(null);
      setLoading(false);
      return;
    }

    if (!currentReportId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .get(`/analyses/${currentReportId}`)
      .then((res) => {
        if (!isMounted) return;
        setData(res.data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setData(null);
        setError(err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentReportId, user]);

  if (!user) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h2>📊 Demo Report</h2>
          <p>This is a sample ATS analysis.</p>
          <p>Sign in to analyze your own resume and generate personalized reports.</p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => navigate("/login")}>Login</button>
            <button type="button" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>
        <AnalysisDetail reportData={demoReport} />
      </div>
    );
  }

  if (!currentReportId) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="card">
          <h2>📊 Analysis Report</h2>
          <p>No report selected yet.</p>
          <p>Run a resume analysis or open one from History.</p>
          <button type="button" onClick={() => navigate("/app/analyze")}>Go to Analyze</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="card">
          <h2>📊 Analysis Report</h2>
          <p>Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="card" style={{ display: "grid", gap: "1rem" }}>
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <h2 style={{ margin: 0 }}>Unable to load report</h2>
          <p style={{ margin: 0, color: "var(--text-soft)" }}>
            We couldn’t load this analysis right now. This can happen if the report was deleted, the link is invalid, or the network request failed.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.location.reload()}>
              Retry
            </button>
            <button type="button" onClick={() => navigate("/app/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <AnalysisDetail id={currentReportId} />
    </div>
  );
}
