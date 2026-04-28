const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String },
  artist: { type: String, default: "Unknown Artist" }, 
  genre: { type: String, default: "unknown" },         
  type: { type: String, default: "audio" },           
  mood: { type: String, required: true },           
  poster: { type: String, default: "" },              
  url: { type: String, required: true },            
  file: { type: Object },                              
}, { timestamps: true });

module.exports = mongoose.model("Song", songSchema);