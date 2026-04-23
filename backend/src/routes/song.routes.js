const express = require("express");
const router = express.Router();

const multer = require("multer");
const { uploadSong } = require("../controller/song.controller");
const songModel = require("../model/song.model");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


router.post("/upload", upload.single("song"), uploadSong);

router.get("/", async (req, res) => {
  const songs = await songModel.find();
  res.json(songs);
});


router.post("/suggest", async (req, res) => {
  const { mood } = req.body;

  const songs = await songModel.find({ mood });

  res.json(songs);
});

module.exports = router;