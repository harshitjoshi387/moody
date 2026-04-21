const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, required: true },
  mood: { type: String, required: true,enum:{["sad,"happy",'surprised']} },
  url: { type: String, required: true },
  posterUrl:{
    type:String,
    required:true
  }
});
const songModel= mongoose.model('Song', songSchema);
module.exports = songModel
