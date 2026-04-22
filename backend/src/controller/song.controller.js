const NodeID3 = require("node-id3");
const songModel = require("../model/song.model");

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tags = NodeID3.read(req.file.buffer) || {};
    const artist = tags.artist || req.body.artist;
    const title = tags.title || req.body.title || req.file.originalname;
    const genre = tags.genre || req.body.genre || "unknown";
    const requestedMood = String(req.body.mood || "").trim().toLowerCase();
    const mood = ["sad", "happy", "surprised"].includes(requestedMood)
      ? requestedMood
      : "happy";

    if (!artist || !title) {
      return res.status(400).json({
        error: "song title and artist are required",
      });
    }

    const song = await songModel.create({
      title,
      artist,
      genre,
      mood,
    });

    return res.status(201).json({
      message: "song uploaded successfully",
      song,
      id3: tags,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to upload song",
      detail: error.message,
    });
  }
}

module.exports = {
  uploadSong,
};
