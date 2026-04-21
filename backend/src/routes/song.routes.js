const express = require('express');
const upload = require("../middleware/upload.middleware")
const songController =require("../controller/song.controller")
const router = express.Router();


// POST /api/suggest-song
router.post('/', upload.single("song"),songController.uploadSong);

module.exports = router;
