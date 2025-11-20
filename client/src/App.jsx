import { useState } from "react";
import Navbar from "./components/Navbar";
import AnalyzeForm from "./components/AnalyzeForm";
import PastAnalysesList from "./components/PastAnalysesList";

export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");

  return (
    <div className="container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content">
        {activeTab === "analyze" && <AnalyzeForm />}
        {activeTab === "history" && <PastAnalysesList />}
      </div>
    </div>
  );
}
