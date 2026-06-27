import { useEffect, useRef, useState } from "react";
import api from "../api";
import AnalysisDetail from "./AnalysisDetail";
import EmptyHistory from "./history/EmptyHistory";
import HistoryList from "./history/HistoryList";
import DeleteConfirmation from "./history/DeleteConfirmation";

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
    return <EmptyHistory onAnalyzeClick={() => setActiveTab("analyze")} />;
  }

  return (
    <>
      <HistoryList
        items={items}
        loadError={loadError}
        onViewClick={(id) => setSelected(id)}
        onDeleteClick={(id) => openDeleteModal(id)}
      />

      {selected && <AnalysisDetail id={selected} onClose={() => setSelected(null)} />}

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
