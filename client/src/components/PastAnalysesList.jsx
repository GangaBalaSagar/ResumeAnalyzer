import { useEffect, useRef, useState } from "react";
import api from "../api";
import AnalysisDetail from "./AnalysisDetail";
import ConfirmationModal from "./ConfirmationModal";

export default function PastAnalysesList({ setActiveTab }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [loadError, setLoadError] = useState("");
  const loadGuard = useRef(false);

  async function load() {
    setLoadError("");

    try {
      const res = await api.get("/analyses");
      setItems(res.data.items);
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        setLoadError("Your session has expired. Please log in again.");
      } else if (status === 429) {
        setLoadError("Too many requests. Please wait a moment and try again.");
      } else if (!error.response) {
        setLoadError("Unable to reach server.");
      } else if (status >= 500) {
        setLoadError("Something went wrong.");
      } else {
        setLoadError(error.response?.data?.message || "Unable to load analyses.");
      }
    }
  }

  useEffect(() => {
    if (loadGuard.current) return;
    loadGuard.current = true;
    load();
  }, []);

  function openDeleteModal(id) {
    setConfirmingDeleteId(id);
    setDeleteError("");
  }

  function closeDeleteModal() {
    if (deleteLoading) return;
    setConfirmingDeleteId(null);
    setDeleteError("");
  }

  async function handleDeleteConfirm() {
    if (!confirmingDeleteId) return;
    setDeleteLoading(true);
    setDeleteError("");

    try {
      await api.delete(`/analyses/${confirmingDeleteId}`);
      setItems((current) => current.filter((item) => item._id !== confirmingDeleteId));
      setSelected((current) => (current === confirmingDeleteId ? null : current));
      setConfirmingDeleteId(null);
    } catch (error) {
      setDeleteError(
        error?.response?.data?.message || error?.message || "Failed to delete analysis. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  // Empty state - no analyses yet
  if (items.length === 0) {
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
            onClick={() => setActiveTab("analyze")}
            style={{ marginTop: 16 }}
          >
            Analyze Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Past Analyses</h3>

      {loadError && (
        <div className="card" style={{ borderColor: "var(--danger)", marginBottom: 12 }}>
          <p style={{ color: "var(--danger)", margin: 0 }}>
            {loadError}
          </p>
        </div>
      )}

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {items.map((item) => (
          <div className="past-item" key={item._id}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <b style={{ cursor: "pointer" }} onClick={() => setSelected(item._id)}>
                {item.resumeFilename}
              </b>
              <div className="meta small">{new Date(item.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <button
                className="btn"
                style={{ background: "transparent", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.35)" }}
                onClick={() => setSelected(item._id)}
              >
                View
              </button>
              <button
                className="btn btn-danger"
                style={{ marginLeft: 8 }}
                onClick={() => openDeleteModal(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <AnalysisDetail id={selected} onClose={() => setSelected(null)} />}

      <ConfirmationModal
        isOpen={Boolean(confirmingDeleteId)}
        title="Delete Analysis"
        message="Are you sure you want to permanently delete this analysis?"
        warning="This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        error={deleteError}
        danger
      />
    </div>
  );
}
