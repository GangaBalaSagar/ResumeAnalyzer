import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ChartsSection({ pieData, barData }) {
  return (
    <>
      {/* PIE CHART */}
      <div className="chart-wrap">
        <h4 className="small">Match Percentage</h4>
        <Pie data={pieData} />
      </div>

      {/* BAR CHART */}
      <div className="chart-wrap">
        <h4 className="small">Skills Overview</h4>
        <Bar data={barData} />
      </div>
    </>
  );
}
