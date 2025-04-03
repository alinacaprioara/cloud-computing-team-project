const express = require('express');
const router = express.Router();
const lastfmController = require('../controllers/lastfmController');

router.get('/lastfm/toptracks', lastfmController.getTopTracks);

module.exports = router;
