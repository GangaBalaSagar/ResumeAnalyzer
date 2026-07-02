import { useEffect, useState } from "react";
import api from "../api";

export default function AnalysisDetail({ id, reportData }) {
  const [data, setData] = useState(reportData ?? null);

  useEffect(() => {
    if (reportData) {
      setData(reportData);
      return;
    }

    if (!id) return;
    api.get(`/analyses/${id}`).then((res) => setData(res.data));
  }, [id, reportData]);

  if (!data) return null;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="card">
        <h3>Analysis Detail</h3>
        <p><b>Match %:</b> {data.matchPercent}</p>
      </div>

      <div className="card">
        <p><b>Matched Skills:</b></p>
        <ul className="modal-list">
          {data.matchedSkills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="card">
        <p><b>Missing Skills:</b></p>
        <ul className="modal-list">
          {data.missingSkills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="card">
        <p><b>Suggestions:</b></p>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {JSON.stringify(data.suggestions, null, 2)}
        </pre>
      </div>
    </div>
  );
}
