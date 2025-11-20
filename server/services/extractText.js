/**
 * extractText.js
 *
 * Utilities to extract text from uploaded resume files (PDF and DOCX)
 * - pdf-parse for PDFs
 * - mammoth for DOCX
 *
 * Exported function: extractResumeText(filePath, mimetype)
 *
 * NOTE: multer stores files on disk; we pass file.path and file.mimetype here.
 */

const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractFromPDF(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text || '';
}

async function extractFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || '';
}

async function extractResumeText(filePath, mimetype) {
  if (!filePath) throw new Error('filePath required');

  // Some systems may not set mimetype reliably; fallback by extension
  const lower = mimetype ? mimetype.toLowerCase() : '';
  if (lower.includes('pdf') || filePath.toLowerCase().endsWith('.pdf')) {
    return await extractFromPDF(filePath);
  } else if (lower.includes('word') || lower.includes('msword') || filePath.toLowerCase().endsWith('.docx')) {
    return await extractFromDOCX(filePath);
  } else {
    // Attempt to parse by extension:
    if (filePath.toLowerCase().endsWith('.pdf')) return await extractFromPDF(filePath);
    if (filePath.toLowerCase().endsWith('.docx')) return await extractFromDOCX(filePath);
    throw new Error('Unsupported file type for text extraction');
  }
}

module.exports = {
  extractResumeText,
  extractFromPDF,
  extractFromDOCX
};
