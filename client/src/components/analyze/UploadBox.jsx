export default function UploadBox({
  file,
  fileInputRef,
  onDropFile,
  onPickFile,
  filePreview,
}) {
  return (
    <div
      className="upload-box"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropFile}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={onPickFile}
        style={{ display: "none" }}
      />

      {file ? (
        <div className="upload-file-info small">{filePreview()}</div>
      ) : (
        <>
          <div className="upload-icon">📄</div>
          <div className="upload-title">Upload Resume</div>
          <div className="upload-sub">Drag &amp; Drop or Click to Browse</div>
          <div className="upload-helper">PDF or DOCX • Max 5 MB</div>
        </>
      )}
    </div>
  );
}
