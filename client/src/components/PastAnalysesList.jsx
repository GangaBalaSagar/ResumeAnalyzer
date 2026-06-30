import { useEffect, useRef, useState } from "react";
import api from "../api";
import AnalysisDetail from "./AnalysisDetail";
import EmptyHistory from "./history/EmptyHistory";
import HistoryList from "./history/HistoryList";
import DeleteConfirmation from "./history/DeleteConfirmation";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

export default function PastAnalysesList({ setActiveTab }) {
  const { user } = useAuth();
  const { openLoginModal, openSignupModal } = useAuthModal();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [loadError, setLoadError] = useState("");
  const loadGuard = useRef(false);

  // Clear state on logout
  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoaded(false);
      setSelected(null);
      setConfirmingDeleteId(null);
      setDeleteLoading(false);
      setDeleteError("");
      setLoadError("");
      loadGuard.current = false;
    }
  }, [user]);

  async function load() {
    setLoadError("");

    try {
      const res = await api.get("/analyses", {
        params: {
          page: 1,
          limit: 10,
        },
      });

      setItems(res.data.items);
      setLoaded(true);
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
        setLoadError(
          error.response?.data?.message || "Unable to load analyses."
        );
      }
    }
  }

  // Load only for authenticated users
  useEffect(() => {
    if (!user) {
      loadGuard.current = false;
      return;
    }

    if (loadGuard.current) return;

    loadGuard.current = true;
    load();
  }, [user]);

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

      setItems((current) =>
        current.filter((item) => item._id !== confirmingDeleteId)
      );

      setSelected((current) =>
        current === confirmingDeleteId ? null : current
      );

      setConfirmingDeleteId(null);
    } catch (error) {
      setDeleteError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete analysis. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loadError) {
    return (
      <div className="card" style={{ borderColor: "var(--danger)" }}>
        <h3>Past Analyses</h3>
        <p style={{ color: "var(--danger)", marginTop: 12 }}>
          {loadError}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card">
        <h3>Login Required</h3>
        <p>Sign in to view your saved resume analyses.</p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button type="button" className="auth-button login-button" onClick={openLoginModal}>Login</button>
          <button type="button" className="auth-button signup-button" onClick={openSignupModal}>Sign Up</button>
        </div>
      </div>
    );
  }
  if (loaded && items.length === 0) {
    return (
      <EmptyHistory
        onAnalyzeClick={() => setActiveTab("analyze")}
      />
    );
  }

  return (
    <>
      <HistoryList
        items={items}
        loadError={loadError}
        onViewClick={(id) => setSelected(id)}
        onDeleteClick={(id) => openDeleteModal(id)}
      />

      {selected && (
        <AnalysisDetail
          id={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <DeleteConfirmation
        isOpen={Boolean(confirmingDeleteId)}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        error={deleteError}
      />
    </>
  );
}