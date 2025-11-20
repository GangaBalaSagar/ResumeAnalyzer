import { useEffect, useState } from "react";
import api from "../api";
import AnalysisDetail from "./AnalysisDetail";

export default function PastAnalysesList() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load() {
    const res = await api.get("/analyses");
    setItems(res.data.items);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteItem(id) {
    if (!confirm("Delete this analysis?")) return;
    await api.delete(`/analyses/${id}`);
    load();
  }

  return (
    <div className="card">
      <h3>Past Analyses</h3>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {items.map((item) => (
          <div className="past-item" key={item._id}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <b style={{ cursor: "pointer" }} onClick={() => setSelected(item._id)}>{item.resumeFilename}</b>
              <div className="meta small">{new Date(item.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <button className="btn" style={{ background: "transparent", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.35)" }} onClick={() => setSelected(item._id)}>View</button>
              <button className="btn" style={{ marginLeft: 8, background: "linear-gradient(90deg,var(--danger), #ff5252)" }} onClick={() => deleteItem(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {selected && <AnalysisDetail id={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
