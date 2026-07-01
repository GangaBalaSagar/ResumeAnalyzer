import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import EmptyHistory from "./history/EmptyHistory";
import HistoryList from "./history/HistoryList";
import DeleteConfirmation from "./history/DeleteConfirmation";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import { useReport } from "../context/ReportContext";

export default function PastAnalysesList({ setActiveTab }) {
  const { user } = useAuth();
  const { openLoginModal, openSignupModal } = useAuthModal();
  const { setCurrentReportId } = useReport();
  const navigate = useNavigate();
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

  if (!user) {
    return (
      <div className="card">
        <h3>📂 Analysis History</h3>
        <p style={{ marginTop: 12 }}>
          Your analysis history will appear here after you create an account and analyze your resume.
        </p>
        <ul style={{ paddingLeft: "1.25rem", marginTop: 12 }}>
          <li>View previous ATS reports</li>
          <li>Track resume improvements</li>
          <li>Compare ATS scores</li>
          <li>Delete old analyses</li>
        </ul>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: 16, flexWrap: "wrap" }}>
          <button type="button" onClick={() => openLoginModal()}>Login</button>
          <button type="button" onClick={() => openSignupModal()}>Sign Up</button>
        </div>
      </div>
    );
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
        onViewClick={(id) => {
          setCurrentReportId(id);
          navigate("/app/report");
        }}
        onDeleteClick={(id) => openDeleteModal(id)}
      />

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