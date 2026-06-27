import HistoryItem from "./HistoryItem";

export default function HistoryList({
  items,
  loadError,
  onViewClick,
  onDeleteClick,
}) {
  return (
    <div className="card">
      <h3>Past Analyses</h3>

      {loadError && (
        <div
          className="card"
          style={{ borderColor: "var(--danger)", marginBottom: 12 }}
        >
          <p style={{ color: "var(--danger)", margin: 0 }}>{loadError}</p>
        </div>
      )}

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {items.map((item) => (
          <HistoryItem
            key={item._id}
            item={item}
            onViewClick={() => onViewClick(item._id)}
            onDeleteClick={() => onDeleteClick(item._id)}
          />
        ))}
      </div>
    </div>
  );
}
