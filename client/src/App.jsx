import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AnalyzeForm from "./components/AnalyzeForm";
import PastAnalysesList from "./components/PastAnalysesList";
import useApiAuth from "./hooks/useApiAuth";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const { user } = useAuth();

  // Initialize API authentication with Supabase token
  useApiAuth();

  // Reset tab to analyze if user logs out
  useEffect(() => {
    if (!user) {
      setActiveTab("analyze");
    }
  }, [user]);

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
