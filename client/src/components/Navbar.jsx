import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, signOut } = useAuth();
  const { openLoginModal, openSignupModal } = useAuthModal();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="topbar">

      {/* LEFT SPACER (keeps title centered) */}
      <div className="nav-left"></div>

      {/* CENTER TITLE */}
      <div className="app-title">
        Resume Analyzer ⚡
      </div>

      {/* RIGHT SECTION - TABS + AUTH */}
      <div className="nav-right">
        <div
          className={`pill ${activeTab === "analyze" ? "active" : ""}`}
          onClick={() => setActiveTab("analyze")}
        >
          Analyze
        </div>

        <div
          className={`pill ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Past Analyses
        </div>

        {/* AUTH CONTROLS */}
        <div className="auth-controls">
          {user ? (
            // Authenticated: Show email and logout
            <>
              <span className="user-email">{user.email}</span>
              <button
                type="button"
                className="auth-button logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            // Not authenticated: Show login and signup
            <>
              <button
                type="button"
                className="auth-button login-button"
                onClick={openLoginModal}
              >
                Login
              </button>
              <button
                type="button"
                className="auth-button signup-button"
                onClick={openSignupModal}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
