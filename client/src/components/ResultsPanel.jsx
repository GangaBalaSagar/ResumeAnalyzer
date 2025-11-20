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

// small chip component inline to avoid extra imports
function Chip({ children, type }) {
  return <div className={`chip ${type === "match" ? "match" : "miss"}`}>{children}</div>;
}

function highlightJD(jd, matchedSkills = []) {
  if (!jd) return jd;

  let escaped = matchedSkills
    .filter(Boolean)
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);

  if (escaped.length === 0) return jd;

  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  return jd.replace(pattern, (m) => `<span class="jd-highlight">${m}</span>`);
}

export default function ResultsPanel({ result, jd }) {
  const { matchPercent = 0, matchedSkills = [], missingSkills = [], suggestions = [] } =
    result || {};

  const pieData = {
    labels: ["Match %", "Gap %"],
    datasets: [
      {
        data: [matchPercent, 100 - matchPercent],
        backgroundColor: ["rgba(76,110,245,0.95)", "rgba(206,212,218,0.9)"],
      },
    ],
  };

  const barData = {
    labels: ["Matched Skills", "Missing Skills"],
    datasets: [
      {
        label: "Skills Count",
        data: [matchedSkills.length, missingSkills.length],
        backgroundColor: ["rgba(81,207,102,0.9)", "rgba(255,107,107,0.9)"],
      },
    ],
  };

  function copySuggestions() {
    const text = Array.isArray(suggestions) ? suggestions.join("\n") : suggestions;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  }

  const highlightedHtml = { __html: highlightJD(jd || "", matchedSkills) };

  return (
    <div className="results-panel-column">
      <h3>Analysis Result</h3>

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

      {/* MATCHED / MISSING SKILLS */}
      <div style={{ marginTop: 10 }}>
        <h4 className="small">Matched Skills</h4>
        <div className="chips">
          {matchedSkills.map((s, i) => (
            <Chip key={i} type="match">
              {s}
            </Chip>
          ))}
        </div>

        <h4 className="small" style={{ marginTop: 12 }}>
          Missing Skills
        </h4>
        <div className="chips">
          {missingSkills.map((s, i) => (
            <Chip key={i} type="miss">
              {s}
            </Chip>
          ))}
        </div>

        {/* AI SUGGESTIONS */}
        <h4 className="small" style={{ marginTop: 12 }}>
          AI Suggestions
        </h4>

        <div className="suggestions-area">
          <textarea
            rows={6}
            value={Array.isArray(suggestions) ? suggestions.join("\n") : suggestions}
            readOnly
          />
        </div>

        {/* COPY BUTTON BELOW SUGGESTIONS */}
        <div className="copy-btn-wrap">
          <button className="btn" onClick={copySuggestions}>
            Copy Suggestions
          </button>
        </div>

        {/* JD PREVIEW BELOW COPY BUTTON */}
        <div className="jd-preview-box">
          <div className="small" style={{ marginBottom: 6 }}>
            Job Description preview (keywords highlighted)
          </div>
          <div className="jd-preview" dangerouslySetInnerHTML={highlightedHtml} />
        </div>
      </div>
    </div>
  );
}
