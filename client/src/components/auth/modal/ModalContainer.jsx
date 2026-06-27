export default function ModalContainer({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 360,
          padding: "1.5rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
