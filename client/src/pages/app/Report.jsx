import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AnalysisDetail from "../../components/AnalysisDetail";
import { useReport } from "../../context/ReportContext";

export default function Report() {
  const navigate = useNavigate();
  const { currentReportId } = useReport();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!currentReportId) {
      setData(null);
      return;
    }

    api.get(`/analyses/${currentReportId}`).then((res) => setData(res.data));
  }, [currentReportId]);

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
