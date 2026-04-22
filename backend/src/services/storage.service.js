const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || undefined,
});

async function uploadfile(fileBuffer, fileName, folder = "/uploads") {
  if (!fileBuffer || !fileName) {
    throw new Error("fileBuffer and fileName are required");
  }

  return imagekit.upload({
    file: fileBuffer,
    fileName,
    folder,
  });
}

module.exports = {
  uploadfile,
};
