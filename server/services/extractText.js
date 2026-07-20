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

const EXTRACTION_TIMEOUT_MS = 30000;
const MAX_PDF_PAGES = 50;
const MAX_TEXT_LENGTH = 500000;

class ExtractionError extends Error {
  constructor(message, code, status, details = {}) {
    super(message);
    this.name = 'ExtractionError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function isExtractionError(error) {
  return error instanceof ExtractionError;
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new ExtractionError(`${label} timed out after ${ms}ms`, 'EXTRACTION_TIMEOUT', 408, { timeoutMs: ms })), ms)
    ),
  ]);
}

function validateExtractedText(text, fileType) {
  if (text === null || text === undefined) {
    throw new ExtractionError('Extractor returned null/undefined', 'EXTRACTION_EMPTY', 400, { fileType });
  }
  const trimmed = String(text).trim();
  if (trimmed.length === 0) {
    throw new ExtractionError('Document contains no extractable text', 'EMPTY_DOCUMENT', 400, { fileType });
  }
  if (trimmed.length > MAX_TEXT_LENGTH) {
    return trimmed.slice(0, MAX_TEXT_LENGTH);
  }
  return trimmed;
}

async function extractFromPDF(filePath) {
  let buffer;
  try {
    buffer = await fs.promises.readFile(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new ExtractionError('File not found during extraction', 'FILE_NOT_FOUND', 400, { filePath });
    }
    throw new ExtractionError('Failed to read file from disk', 'FILE_READ_ERROR', 500, { originalError: err.message });
  }

  if (!buffer || buffer.length === 0) {
    throw new ExtractionError('Uploaded file is empty', 'EMPTY_FILE', 400);
  }

  let data;
  try {
    data = await withTimeout(pdfParse(buffer, { max: MAX_PDF_PAGES }), EXTRACTION_TIMEOUT_MS, 'PDF extraction');
  } catch (err) {
    if (isExtractionError(err)) throw err;

    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('password') || msg.includes('encrypted') || msg.includes('decrypt')) {
      throw new ExtractionError('Password-protected PDFs are not supported', 'PASSWORD_PROTECTED', 400);
    }
    if (msg.includes('invalid') || msg.includes('corrupt') || msg.includes('malformed')) {
      throw new ExtractionError('Corrupted or invalid PDF file', 'CORRUPTED_PDF', 400);
    }
    if (msg.includes('eof') || msg.includes('unexpected end')) {
      throw new ExtractionError('Incomplete or truncated PDF file', 'TRUNCATED_PDF', 400);
    }
    throw new ExtractionError('PDF parsing failed', 'PDF_PARSE_ERROR', 500, { originalError: err?.message });
  }

  if (!data || typeof data.numpages !== 'number') {
    throw new ExtractionError('PDF parser returned unexpected result', 'INVALID_PDF_RESULT', 500);
  }

  if (data.numpages > MAX_PDF_PAGES) {
    throw new ExtractionError(`PDF exceeds maximum page limit (${MAX_PDF_PAGES})`, 'TOO_MANY_PAGES', 400, { pageCount: data.numpages });
  }

  return validateExtractedText(data.text, 'pdf');
}

async function extractFromDOCX(filePath) {
  let result;
  try {
    result = await withTimeout(mammoth.extractRawText({ path: filePath }), EXTRACTION_TIMEOUT_MS, 'DOCX extraction');
  } catch (err) {
    if (isExtractionError(err)) throw err;

    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('password') || msg.includes('encrypted')) {
      throw new ExtractionError('Password-protected DOCX files are not supported', 'PASSWORD_PROTECTED', 400);
    }
    if (msg.includes('zip') || msg.includes('corrupt') || msg.includes('invalid')) {
      throw new ExtractionError('Corrupted or invalid DOCX file', 'CORRUPTED_DOCX', 400);
    }
    if (msg.includes('enoent') || err.code === 'ENOENT') {
      throw new ExtractionError('File not found during extraction', 'FILE_NOT_FOUND', 400, { filePath });
    }
    throw new ExtractionError('DOCX parsing failed', 'DOCX_PARSE_ERROR', 500, { originalError: err?.message });
  }

  if (!result || typeof result.value !== 'string') {
    throw new ExtractionError('DOCX parser returned unexpected result', 'INVALID_DOCX_RESULT', 500);
  }

  return validateExtractedText(result.value, 'docx');
}

async function extractResumeText(filePath, mimetype) {
  if (!filePath) {
    throw new ExtractionError('filePath required', 'MISSING_FILEPATH', 400);
  }

  const lower = mimetype ? mimetype.toLowerCase() : '';
  const pathLower = filePath.toLowerCase();

  if (lower.includes('pdf') || pathLower.endsWith('.pdf')) {
    return await extractFromPDF(filePath);
  }
  if (lower.includes('word') || lower.includes('msword') || pathLower.endsWith('.docx')) {
    return await extractFromDOCX(filePath);
  }
  throw new ExtractionError('Unsupported file type for text extraction', 'UNSUPPORTED_TYPE', 400);
}

module.exports = {
  extractResumeText,
  extractFromPDF,
  extractFromDOCX,
  ExtractionError,
  isExtractionError,
};