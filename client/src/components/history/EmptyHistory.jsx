export default function EmptyHistory({ onAnalyzeClick }) {
  return (
    <div className="card empty-state">
      <div className="empty-state-content">
        <div className="empty-icon">📋</div>
        <h3>No analyses yet</h3>
        <p className="empty-description">
          Analyze your first resume to start building your history.
        </p>
        <button
          type="button"
          className="btn"
          onClick={onAnalyzeClick}
          style={{ marginTop: 16 }}
        >
          Analyze Resume
        </button>
      </div>
    </div>
  );
}
