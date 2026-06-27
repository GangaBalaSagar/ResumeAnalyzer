import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AnalyzeForm from "./components/AnalyzeForm";
import PastAnalysesList from "./components/PastAnalysesList";
import useApiAuth from "./hooks/useApiAuth";
import { useAuthModal } from "./context/AuthModalContext";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const { openLoginModal } = useAuthModal();
  const { user } = useAuth();

  // Initialize API authentication with Supabase token
  useApiAuth();

  // Reset tab to analyze if user logs out
  useEffect(() => {
    if (!user) {
      setActiveTab("analyze");
    }
  }, [user]);

  // Open login modal if redirected from password reset
  useEffect(() => {
    if (sessionStorage.getItem("openLogin") === "true") {
      sessionStorage.removeItem("openLogin");
      openLoginModal();
    }
  }, [openLoginModal]);

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
