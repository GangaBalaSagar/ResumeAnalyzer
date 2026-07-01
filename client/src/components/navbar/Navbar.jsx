import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "1rem 1.5rem",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#fff",
};

const linkStyle = {
  textDecoration: "none",
  color: "#374151",
  fontWeight: 500,
};

const activeLinkStyle = {
  ...linkStyle,
  color: "#2563eb",
  fontWeight: 700,
};

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(user);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <NavLink to="/" style={{ textDecoration: "none", color: "#111827", fontWeight: 700 }}>
          Resume Analyzer
        </NavLink>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Home
          </NavLink>
          <NavLink to="/features" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Features
          </NavLink>
          <NavLink to="/app/analyze" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Analyze
          </NavLink>
          <NavLink to="/app/history" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            History
          </NavLink>
          <NavLink to="/app/report" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            Report
          </NavLink>
          <NavLink to="/faq" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
            FAQ
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/app/dashboard" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
              Dashboard
            </NavLink>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {isAuthenticated ? (
          <>
            <NavLink to="/app/account" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
              Account
            </NavLink>
            <button type="button" onClick={handleLogout} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#374151", fontWeight: 500 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
              Login
            </NavLink>
            <NavLink to="/signup" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
