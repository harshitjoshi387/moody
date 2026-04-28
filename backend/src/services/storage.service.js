const { imagekit, hasImageKitConfig } = require("../config/imageKit");

function sanitizeFileName(fileName = "file") {
  return fileName.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
}

async function uploadFile(fileBuffer, fileName, folder = "/uploads") {
  if (!hasImageKitConfig()) {
    throw new Error(
      "ImageKit is not configured. Add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in backend/.env"
    );
  }

  if (!fileBuffer || !fileName) {
    throw new Error("fileBuffer and fileName are required");
  }

  return imagekit.upload({
    file: fileBuffer,
    fileName: sanitizeFileName(fileName),
    folder,
    useUniqueFileName: true,
  });
}

module.exports = {
  uploadFile,
};
