/**
 * upload.js
 *
 * Multer configuration: stores uploads in ./uploads (create if not exists),
 * validates file type (pdf, docx), and file size limit (e.g., 5 MB).
 *
 * Security:
 * - Filenames are sanitised to prevent path traversal
 * - Magic-bytes validation ensures uploaded content matches claimed type
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/**
 * Strip directory components and unsafe characters from the original filename
 * to prevent path-traversal attacks (e.g. "../../etc/passwd").
 */
function sanitizeFilename(originalname) {
  // Extract only the basename — removes any directory separators
  const base = path.basename(originalname);
  // Replace anything that isn't alphanumeric, dot, hyphen, or underscore
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safeName = `${Date.now()}-${sanitizeFilename(file.originalname)}`;
    cb(null, safeName);
  }
});

// File filter
function fileFilter(req, file, cb) {
  const allowedMime = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = ['.pdf', '.docx'];
  if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    const err = new Error('Only PDF (.pdf) and Word (.docx) files are supported.');
    err.status = 400;
    cb(err);
  }
}

// PDF magic bytes: %PDF (hex 25 50 44 46)
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]);
// DOCX (ZIP) magic bytes: PK\x03\x04 (hex 50 4B 03 04)
const ZIP_MAGIC = Buffer.from([0x50, 0x4B, 0x03, 0x04]);

/**
 * Validate that the first bytes of an uploaded file match the expected
 * file signature for the claimed MIME type. Call AFTER multer has written
 * the file to disk.
 *
 * @param {string} filePath  Absolute path to the uploaded file
 * @param {string} mimetype  MIME type reported by multer
 * @returns {Promise<boolean>} true if signature matches, false otherwise
 */
async function validateFileSignature(filePath, mimetype) {
  const BYTES_TO_READ = 4;
  let fd;
  try {
    fd = await fs.promises.open(filePath, 'r');
    const buf = Buffer.alloc(BYTES_TO_READ);
    const { bytesRead } = await fd.read(buf, 0, BYTES_TO_READ, 0);
    if (bytesRead < BYTES_TO_READ) return false;

    if (mimetype === 'application/pdf') {
      return buf.slice(0, 4).equals(PDF_MAGIC);
    }
    if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return buf.slice(0, 4).equals(ZIP_MAGIC);
    }
    return false;
  } catch {
    return false;
  } finally {
    if (fd) await fd.close();
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1                    // only one file per request
  },
  fileFilter
});

module.exports = upload;
module.exports.validateFileSignature = validateFileSignature;
