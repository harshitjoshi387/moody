const ImageKit = require("imagekit");

function hasImageKitConfig() {
  return Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
  );
}

let imagekit = null;

if (hasImageKitConfig()) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

// ✅ reusable upload function (IMPORTANT)
async function uploadFileToImageKit(fileBuffer, fileName, folder = "/moodify") {
  if (!imagekit) {
    throw new Error("ImageKit is not configured properly");
  }

  try {
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder,
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  imagekit,
  hasImageKitConfig,
  uploadFileToImageKit,
};