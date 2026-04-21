
const Song = require('../model/song.model');
const storageService= require("../services/storage.service")
const NodeID3 = require('node-id3');


async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read ID3 tags from the uploaded file buffer
    const tags = NodeID3.read(req.file.buffer);
    // Example: tags.title, tags.artist, tags.album, etc.
    console.log('ID3 Tags:', tags);

    res.status(200).json({
      message: 'Song uploaded',
      id3: tags
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read ID3 tags' });
  }
  const songFile =await storageService.uploadfile({
    buffer:songBuffer,
    filename:tags.title +"mp3",
    folder:'/moodify/songs'
  })
  const posterFile=await storageService.uploadfile({
    buffer:tags.image.imageBuffer,
    filename:tags.title+".jpeg",
    folder:"/moodify/poster"
  })
}

module.exports = {
  uploadSong
};