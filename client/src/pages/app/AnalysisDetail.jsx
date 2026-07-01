import { useNavigate, useParams } from "react-router-dom";
import AnalysisDetail from "../../components/AnalysisDetail";

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return <AnalysisDetail id={id} onClose={() => navigate("/app/history")} />;
}
