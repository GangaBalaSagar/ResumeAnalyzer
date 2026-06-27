export default function ActionControls({
  loading,
  progress,
  onAnalyze,
  onReset,
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          className="btn"
          disabled={loading}
          onClick={onAnalyze}
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>

        <button
          className="btn btn-danger"
          type="button"
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </button>

        {loading && (
          <div className="small muted">Processing your file…</div>
        )}
      </div>

      <div className="progress-wrap" style={{ marginTop: 12 }}>
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
