const express = require('express');
const router = express.Router();
const { suggestSong } = require('../controller/song.controller');

// POST /api/suggest-song
router.post('/suggest-song', suggestSong);

module.exports = router;
