const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const playlistController = require("../controllers/playlistController");


router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.post('/', userController.createUser);


router.get('/:userId/playlists', playlistController.getPlaylists);
router.get('/:userId/playlists/:playlistId', playlistController.getPlaylistById);
router.post('/:userId/playlists', playlistController.createPlaylist);
router.put('/:userId/playlists/:playlistId', playlistController.updatePlaylist);
router.delete('/:userId/playlists/:playlistId', playlistController.deletePlaylist);


module.exports = router;
