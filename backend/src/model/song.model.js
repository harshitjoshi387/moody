const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, required: true },
  mood: {
    type: String,
    required: true,
    enum: {
      values: ["sad", "happy", "surprised"],
      message: "Mood must be either sad, happy, or surprised"
    }
  },
  file: {
    type: String,
    required: true
  }
});

// ✅ MODEL CREATE KARO
const songModel = mongoose.model('Song', songSchema);

// ✅ EXPORT KARO
module.exports = songModel;