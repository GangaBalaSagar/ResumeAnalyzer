export default function HistoryItem({ item, onViewClick, onDeleteClick }) {
  return (
    <div className="past-item">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <b style={{ cursor: "pointer" }} onClick={onViewClick}>
          {item.resumeFilename}
        </b>
        <div className="meta small">
          {new Date(item.createdAt).toLocaleString()}
        </div>
      </div>

      <div>
        <button
          className="btn"
          style={{
            background: "transparent",
            color: "var(--muted)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
          onClick={onViewClick}
        >
          View
        </button>
        <button
          className="btn btn-danger"
          style={{ marginLeft: 8 }}
          onClick={onDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
