export default function ScoreCard({ highlightedHtml }) {
  return (
    <div className="jd-preview-box">
      <div className="small" style={{ marginBottom: 6 }}>
        Job Description preview (keywords highlighted)
      </div>
      <div className="jd-preview" dangerouslySetInnerHTML={highlightedHtml} />
    </div>
  );
}
