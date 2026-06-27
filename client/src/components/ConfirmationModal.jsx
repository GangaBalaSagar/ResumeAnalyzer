export default function ConfirmationModal({
  isOpen,
  title,
  message,
  warning,
  cancelText = "Cancel",
  confirmText = "Delete",
  onCancel,
  onConfirm,
  loading = false,
  error,
  danger = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card confirmation-modal-card">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>

        <div className="modal-content">
          <p style={{ marginBottom: 12, color: "var(--text)" }}>{message}</p>
          {warning && (
            <p style={{ marginTop: 0, color: "var(--text-soft)", fontSize: "0.95rem" }}>
              {warning}
            </p>
          )}
          {error && <p className="modal-error">{error}</p>}
        </div>

        <div className="modal-footer modal-actions">
          <button className="btn" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : ""}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
