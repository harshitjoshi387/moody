const ImageKit = require('imagekit');

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a file (image, song, etc.) to ImageKit storage
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The name for the file
 * @param {string} folder - The folder path in ImageKit (optional)
 * @returns {Promise<object>} - The uploaded file info
 */
async function uploadToImageKit(fileBuffer, fileName, folder = "/uploads") {
  try {
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder,
    });
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  uploadToImageKit,
};
