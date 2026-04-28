const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const {
  uploadSong,
  getSongs,
  suggestSongs,
} = require("../controller/song.controller");

router.post("/upload", upload.single("file"), uploadSong); 

router.get("/", getSongs);
router.post("/suggest", suggestSongs);

module.exports = router;