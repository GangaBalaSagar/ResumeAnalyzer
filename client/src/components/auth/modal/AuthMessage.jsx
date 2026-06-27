export default function AuthMessage({ authMessage }) {
  if (!authMessage) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffc107",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "1rem",
        color: "#856404",
        fontSize: "0.95rem",
      }}
    >
      {authMessage}
    </div>
  );
}
