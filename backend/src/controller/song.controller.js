const Song = require('../model/song.model');

async function uploadSong(req, res) {
  console.log(req.file);
  res.status(200).json({ message: 'Song uploaded (dummy response)' });
}

module.exports = {
  uploadSong
};