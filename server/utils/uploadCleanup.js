const fs = require("fs");
const logger = require("./logger");

async function cleanupUploadedFile(filePath, context = "upload cleanup") {
  if (!filePath) return;

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    logger.error(`Failed to clean up temporary file during ${context}:`, error);
  }
}

module.exports = {
  cleanupUploadedFile,
};
