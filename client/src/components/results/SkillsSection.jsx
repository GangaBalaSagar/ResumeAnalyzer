function Chip({ children, type }) {
  return <div className={`chip ${type === "match" ? "match" : "miss"}`}>{children}</div>;
}

export default function SkillsSection({ matchedSkills = [], missingSkills = [] }) {
  return (
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
    </div>
  );
}
