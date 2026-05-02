const songModel = require("../model/song.model");
const { uploadFile } = require("../services/storage.service");

function normalizeMood(mood) {
  const requestedMood = String(mood || "").trim().toLowerCase();
  return ["sad", "happy", "surprised"].includes(requestedMood)
   ? requestedMood
    : "happy";
}

async function uploadSong(req, res) {
  try {
    const songFile = req.file;

    if (!songFile) {
      return res.status(400).json({
        error: "Song file is required",
      });
    }

    const mood = normalizeMood(req.body.mood);

    const uploadedSong = await uploadFile(
      songFile.buffer,
      songFile.originalname,
      "/moodify/songs"
    );

    
    const song = await songModel.create({
      title: songFile.originalname,
      artist: "Unknown Artist", 
      //   genre: "unknown",         
      type: songFile.mimetype,  
      mood: mood,               
      poster: "https://via.placeholder.com/300", 
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