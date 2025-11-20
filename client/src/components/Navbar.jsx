export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="topbar">

      {/* LEFT SPACER (keeps title centered) */}
      <div className="nav-left"></div>

      {/* CENTER TITLE */}
      <div className="app-title">
        Resume Analyzer ⚡
      </div>

      {/* RIGHT TABS */}
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
      </div>

    </div>
  );
}
