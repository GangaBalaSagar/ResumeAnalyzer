import { useState } from "react";
import Navbar from "./components/Navbar";
import AnalyzeForm from "./components/AnalyzeForm";
import PastAnalysesList from "./components/PastAnalysesList";
import useApiAuth from "./hooks/useApiAuth";

export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");

  // Initialize API authentication with Supabase token
  useApiAuth();

  return (
    <div className="container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content">
        {activeTab === "analyze" && <AnalyzeForm />}
        {activeTab === "history" && <PastAnalysesList setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
}
