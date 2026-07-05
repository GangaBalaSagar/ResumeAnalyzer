import ChartsSection from "./results/ChartsSection";
import SkillsSection from "./results/SkillsSection";
import SuggestionsSection from "./results/SuggestionsSection";
import ScoreCard from "./results/ScoreCard";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightJD(jd, matchedSkills = []) {
  if (!jd) return [];

  const escapedSkills = matchedSkills
    .filter(Boolean)
    .map((skill) => skill.trim())
    .filter(Boolean)
    .map((skill) => escapeRegExp(skill))
    .sort((a, b) => b.length - a.length);

  if (escapedSkills.length === 0) return [jd];

  const pattern = new RegExp(`\\b(${escapedSkills.join("|")})\\b`, "gi");
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(jd)) !== null) {
    if (match.index > lastIndex) {
      parts.push(jd.slice(lastIndex, match.index));
    }

    parts.push(
      <span key={`${match.index}-${match[0]}`} className="jd-highlight">
        {match[0]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < jd.length) {
    parts.push(jd.slice(lastIndex));
  }

  return parts;
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

  const highlightedContent = highlightJD(jd || "", matchedSkills);

  return (
    <div className="results-panel-column">
      <h3>Analysis Result</h3>

      <ChartsSection pieData={pieData} barData={barData} />

      <SkillsSection matchedSkills={matchedSkills} missingSkills={missingSkills} />

      <SuggestionsSection suggestions={suggestions} onCopy={copySuggestions} />

      <ScoreCard highlightedContent={highlightedContent} />
    </div>
  );
}
