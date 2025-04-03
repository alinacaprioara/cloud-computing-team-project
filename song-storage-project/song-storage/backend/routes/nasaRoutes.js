const express = require('express');
const router = express.Router();
const nasaController = require('../controllers/nasaController');

router.get('/apod', nasaController.searchImage);

module.exports = router;
