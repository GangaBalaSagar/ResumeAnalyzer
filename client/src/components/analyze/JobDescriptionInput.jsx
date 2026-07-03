export default function JobDescriptionInput({ jd, setJd }) {
  return (
    <div style={{ marginTop: 16 }}>
      <label className="small">Job Description</label>
      <textarea
        className="job-description-textarea"
        placeholder="Paste job description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
      />
    </div>
  );
}
