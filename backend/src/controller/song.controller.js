const songModel = require("../model/song.model");
const { uploadFile } = require("../services/storage.service");

const NodeID3 = require("node-id3");

function normalizeMood(mood) {
  const requestedMood = String(mood || "").trim().toLowerCase();
  return ["sad", "happy", "surprised"].includes(requestedMood)
    ? requestedMood
    : "happy";
}

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Song file is required in form-data",
      });
    }

    const songBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Mood will be parsed and normalized (default to 'happy' if invalid/missing)
    const mood = normalizeMood(req.body.mood);

    // Extract ID3 Tags
    let title = originalName;
    let artist = "Unknown Artist";
    let posterBase64 = "";

    try {
      const tags = NodeID3.read(songBuffer);
      if (tags) {
        if (tags.title) title = tags.title;
        if (tags.artist) artist = tags.artist;
        if (tags.image && tags.image.imageBuffer) {
          const mime = tags.image.mime || "image/jpeg";
          posterBase64 = `data:${mime};base64,${tags.image.imageBuffer.toString("base64")}`;
        }
      }
    } catch (e) {
      console.error("Error reading ID3 tags:", e);
    }

    // Default poster if not present in buffer memory (ID3 tags)
    if (!posterBase64) {
      posterBase64 = "https://picsum.photos/300?random=1";
    }

    // Upload to the storage service
    const uploadedSong = await uploadFile(
      songBuffer,
      originalName,
      "/moodify/songs"
    );

    const song = await songModel.create({
      title: title,
      artist: artist,
      type: mimeType,
      mood: mood,
      poster: posterBase64,
      url: uploadedSong.url,
      file: {
        url: uploadedSong.url,
        fileId: uploadedSong.fileId,
        name: uploadedSong.name,
        fileType: uploadedSong.fileType
      }
    });

    return res.status(201).json({
      message: "Song uploaded successfully",
      song,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to upload song",
      detail: error.message,
    });
  }
}

async function getSongs(req, res) {
  try {
    const songs = await songModel.find().sort({ createdAt: -1 });
    return res.json(songs);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch songs",
      detail: error.message,
    });
  }
}

async function suggestSongs(req, res) {
  try {
    const mood = normalizeMood(req.body.mood);
    const songs = await songModel.find({ mood }).sort({ createdAt: -1 });
    return res.json(songs);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch suggested songs",
      detail: error.message,
    });
  }
}

module.exports = {
  uploadSong,
  getSongs,
  suggestSongs,
};