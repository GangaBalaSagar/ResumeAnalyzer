export default function ModalActions({
  mode,
  openSignupModal,
  openLoginModal,
  closeAuthModal,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginTop: "1rem",
      }}
    >
      {mode === "login" ? (
        <button
          type="button"
          onClick={openSignupModal}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Don't have an account? Sign Up
        </button>
      ) : mode === "signup" ? (
        <button
          type="button"
          onClick={openLoginModal}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Already have an account? Login
        </button>
      ) : (
        <button
          type="button"
          onClick={openLoginModal}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Back to Login
        </button>
      )}

      <button
        type="button"
        onClick={closeAuthModal}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: "#f5f5f5",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}
