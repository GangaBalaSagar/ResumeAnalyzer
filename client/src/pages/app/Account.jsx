import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function formatMemberSince(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function getInitials(firstName, lastName, fullName, email) {
  if (firstName || lastName) {
    return `${firstName || ""}${lastName ? ` ${lastName}` : ""}`
      .trim()
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  }

  if (fullName) {
    const parts = fullName.trim().split(" ").filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  return email?.[0]?.toUpperCase() || "?";
}

export default function Account() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  console.log("ACCOUNT USER", user);
  console.log("USER METADATA", user?.user_metadata);

  const metadata = user?.user_metadata || {};
  const firstName = metadata.first_name || metadata.firstName || null;
  const lastName = metadata.last_name || metadata.lastName || null;
  const email = user?.email || null;
  const initials = getInitials(firstName, lastName, null, email);

  const profileItems = [
    { label: "First Name", value: firstName },
    { label: "Last Name", value: lastName },
    { label: "Email Address", value: email },
  ];

  const handleResetPassword = () => {
    navigate("/forgot-password");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const profileRows = useMemo(
    () =>
      profileItems.map((item) => (
        <div
          key={item.label}
          style={{
            display: "grid",
            gap: "0.25rem",
          }}
        >
          <span className="profile-label">{item.label}</span>
          <span className="profile-value">
            {item.value || "Not Available"}
          </span>
        </div>
      )),
    [profileItems]
  );

  if (loading) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1rem" }}>
        <div className="card">
          <p style={{ margin: 0 }}>Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "1rem", display: "grid", gap: "1rem" }}>
      <div className="card" style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ marginBottom: "0.25rem" }}>Profile</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#1d4ed8",
            }}
          >
            {initials}
          </div>
          <div style={{ display: "grid", gap: "1rem", minWidth: 0, flex: 1 }}>
            <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              {profileRows}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="card" style={{ display: "grid", gap: "1rem" }}>
          <h2 style={{ marginBottom: "0.25rem" }}>Security</h2>
          <button
            type="button"
            onClick={handleResetPassword}
            style={{
              width: "100%",
              padding: "0.85rem",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "0.75rem",
              background: "#eff6ff",
              color: "#1d4ed8",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.85rem",
              border: "1px solid rgba(107, 114, 128, 0.25)",
              borderRadius: "0.75rem",
              background: "#ffffff",
              color: "#374151",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div className="card" style={{ display: "grid", gap: "1rem" }}>
          <h2 style={{ marginBottom: "0.25rem" }}>Application</h2>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "grid", gap: "0.25rem" }}>
              <span className="profile-label">Version</span>
              <span className="profile-value">v1.0.0</span>
            </div>
            <div style={{ display: "grid", gap: "0.25rem" }}>
              <span className="profile-label">Platform</span>
              <span className="profile-value">Web Application</span>
            </div>
            <div style={{ display: "grid", gap: "0.25rem" }}>
              <span className="profile-label">Authentication</span>
              <span className="profile-value">Supabase</span>
            </div>
            <div style={{ display: "grid", gap: "0.25rem" }}>
              <span className="profile-label">AI Engine</span>
              <span className="profile-value">Google Gemini</span>
            </div>
            <div style={{ display: "grid", gap: "0.25rem" }}>
              <span className="profile-label">Theme</span>
              <span className="profile-value">Dark Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
