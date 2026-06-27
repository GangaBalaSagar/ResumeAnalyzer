import ConfirmationModal from "../ConfirmationModal";

export default function DeleteConfirmation({
  isOpen,
  onCancel,
  onConfirm,
  loading,
  error,
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Delete Analysis"
      message="Are you sure you want to permanently delete this analysis?"
      warning="This action cannot be undone."
      cancelText="Cancel"
      confirmText="Delete"
      onCancel={onCancel}
      onConfirm={onConfirm}
      loading={loading}
      error={error}
      danger
    />
  );
}
