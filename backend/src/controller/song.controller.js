const Song = require('../model/song.model');

// Suggest song(s) based on mood
exports.suggestSong = async (req, res) => {
  try {
    const { mood } = req.body;
    if (!mood) return res.status(400).json({ message: 'Mood is required' });
    // Find songs matching the mood
    const songs = await Song.find({ mood });
    if (!songs.length) return res.status(404).json({ message: 'No songs found for this mood' });
    // Return a random song from the list
    const song = songs[Math.floor(Math.random() * songs.length)];
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
