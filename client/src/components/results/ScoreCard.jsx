export default function ScoreCard({ highlightedContent }) {
  return (
    <div className="jd-preview-box">
      <div className="small" style={{ marginBottom: 6 }}>
        Job Description preview (keywords highlighted)
      </div>
      <div className="jd-preview">{highlightedContent}</div>
    </div>
  );
}
