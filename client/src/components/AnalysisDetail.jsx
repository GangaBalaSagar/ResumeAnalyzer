import { useEffect, useState } from "react";
import api from "../api";

export default function AnalysisDetail({ id, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/analyses/${id}`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card fixed-modal">

        {/* HEADER */}
        <div className="modal-header">
          <h3>Analysis Detail</h3>
          {/* <button className="btn modal-close-btn" onClick={onClose}>Close</button> */}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="modal-content">
          <p><b>Match %:</b> {data.matchPercent}</p>

          <p><b>Matched Skills:</b></p>
          <ul className="modal-list">
            {data.matchedSkills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <p><b>Missing Skills:</b></p>
          <ul className="modal-list">
            {data.missingSkills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <p><b>Suggestions:</b></p>
          <pre className="modal-pre">
            {JSON.stringify(data.suggestions, null, 2)}
          </pre>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn modal-close-btn" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}
