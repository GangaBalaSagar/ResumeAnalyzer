/**
 * upload.js
 *
 * Multer configuration: stores uploads in ./uploads (create if not exists),
 * validates file type (pdf, docx), and file size limit (e.g., 5 MB).
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safeName);
  }
});

// File filter
function fileFilter(req, file, cb) {
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  const ext = path.extname(file.originalname).toLowerCase();
  const okExt = ['.pdf', '.docx', '.doc'];
  if (allowed.includes(file.mimetype) || okExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload PDF or DOCX.'));
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter
});

module.exports = upload;
