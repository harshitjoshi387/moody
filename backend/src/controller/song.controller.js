
const Song = require('../model/song.model');
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
}

module.exports = {
  uploadSong
};