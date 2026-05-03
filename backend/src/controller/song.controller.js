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
    let songBuffer = null;
    let originalName = "unknown.mp3";
    let mimeType = "audio/mpeg";
    let songUrl = null;

    if (req.file) {
      songBuffer = req.file.buffer;
      originalName = req.file.originalname;
      mimeType = req.file.mimetype;
    } else if (req.body.url) {
      const response = await fetch(req.body.url);
      if (!response.ok) throw new Error("Failed to fetch song from provided URL");
      const arrayBuffer = await response.arrayBuffer();
      songBuffer = Buffer.from(arrayBuffer);
      originalName = req.body.url.split('/').pop() || "unknown.mp3";
      mimeType = response.headers.get("content-type") || "audio/mpeg";
      songUrl = req.body.url;
    } else {
      return res.status(400).json({
        error: "Song file or URL is required",
      });
    }

    const mood = normalizeMood(req.body.mood);

    // Extract ID3 Tags
    let title = originalName;
    let artist = "Unknown Artist";
    let posterBase64 = "https://picsum.photos/300?random=1";

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

    let finalUrl = songUrl;
    let finalFileObj = {};

    if (!finalUrl) {
      // If it was a file upload, upload it to the storage service
      const uploadedSong = await uploadFile(
        songBuffer,
        originalName,
        "/moodify/songs"
      );
      finalUrl = uploadedSong.url;
      finalFileObj = {
        url: uploadedSong.url,
        fileId: uploadedSong.fileId,
        name: uploadedSong.name,
        fileType: uploadedSong.fileType
      };
    } else {
      finalFileObj = {
        url: finalUrl,
        name: originalName,
        fileType: mimeType
      };
    }

    const song = await songModel.create({
      title: title,
      artist: artist,
      type: mimeType,
      mood: mood,
      poster: posterBase64,
      url: finalUrl,
      file: finalFileObj
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