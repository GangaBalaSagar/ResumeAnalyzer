import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useReport } from "../../context/ReportContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentReportId } = useReport();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      setError("");
      return;
    }

    let ignore = false;

    async function loadDashboardData() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/analyses", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        if (!ignore) {
          setItems(res.data.items || []);
        }
      } catch (err) {
        if (!ignore) {
          const status = err.response?.status;

          if (status === 401) {
            setError("Your session has expired. Please log in again.");
          } else if (status === 429) {
            setError("Too many requests. Please wait a moment and try again.");
          } else if (!err.response) {
            setError("Unable to reach the server.");
          } else {
            setError(err.response?.data?.message || "Unable to load your dashboard.");
          }
          setItems([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      ignore = true;
    };
  }, [user]);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "there";

  const latestAnalysis = items[0] || null;
  const totalAnalyses = items.length;
  const averageScore = items.length
    ? Math.round(
        items.reduce((sum, item) => sum + (item.matchPercent || 0), 0) / items.length
      )
    : 0;

  const openReport = (analysisId = latestAnalysis?._id) => {
    setCurrentReportId(analysisId || null);
    navigate("/app/report", { state: { from: "/app/dashboard" } });
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card">
        <h2 style={{ marginBottom: "0.35rem" }}>Welcome back, {displayName}</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Ready to improve your resume today?
        </p>
      </div>

      {loading ? (
        <div className="card">
          <p style={{ margin: 0 }}>Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ borderColor: "var(--danger)" }}>
          <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
        </div>
      ) : totalAnalyses === 0 ? (
        <>
          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Statistics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ color: "var(--muted)", marginBottom: "0.35rem" }}>Total Analyses</div>
                <div style={{ fontSize: "1.7rem", fontWeight: 700 }}>0</div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ color: "var(--muted)", marginBottom: "0.35rem" }}>Average ATS Score</div>
                <div style={{ fontSize: "1.7rem", fontWeight: 700 }}>0%</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Latest Analysis</h3>
            <p style={{ margin: 0 }}>
              No analyses yet.<br />
              Start your first resume analysis to build your dashboard.
            </p>
            <button type="button" className="btn" style={{ marginTop: "1rem" }} onClick={() => navigate("/app/analyze")}>
              Analyze Resume
            </button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Quick Actions</h3>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button type="button" className="btn" onClick={() => navigate("/app/analyze")}>
                Analyze Resume
              </button>
              <button type="button" className="btn" onClick={() => navigate("/app/history")}>
                History
              </button>
              <button type="button" className="btn" onClick={() => openReport()}>
                Report
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Statistics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ color: "var(--muted)", marginBottom: "0.35rem" }}>Total Analyses</div>
                <div style={{ fontSize: "1.7rem", fontWeight: 700 }}>{totalAnalyses}</div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ color: "var(--muted)", marginBottom: "0.35rem" }}>Average ATS Score</div>
                <div style={{ fontSize: "1.7rem", fontWeight: 700 }}>{averageScore}%</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0 }}>Latest Analysis</h3>
              <button type="button" className="btn" onClick={() => openReport(latestAnalysis?._id)}>
                Open Report
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Resume Name</div>
                <div style={{ fontWeight: 600 }}>{latestAnalysis.resumeFilename}</div>
              </div>
              <div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>ATS Score</div>
                <div style={{ fontWeight: 600 }}>{latestAnalysis.matchPercent ?? 0}%</div>
              </div>
              <div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Analysis Date</div>
                <div style={{ fontWeight: 600 }}>{new Date(latestAnalysis.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Quick Actions</h3>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button type="button" className="btn" onClick={() => navigate("/app/analyze")}>
                Analyze Resume
              </button>
              <button type="button" className="btn" onClick={() => navigate("/app/history")}>
                History
              </button>
              <button type="button" className="btn" onClick={() => openReport(latestAnalysis?._id)}>
                Report
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
