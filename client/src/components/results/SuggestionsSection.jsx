export default function SuggestionsSection({ suggestions = [], onCopy }) {
  return (
    <>
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

      <div className="copy-btn-wrap">
        <button className="btn" onClick={onCopy}>
          Copy Suggestions
        </button>
      </div>
    </>
  );
}
