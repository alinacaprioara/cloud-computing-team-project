const playlistService = require('../services/playlistService');

exports.getPlaylists = async (req, res) => {
    try {
        const playlists = await playlistService.getPlaylists(req.params.userId);
        res.json(playlists || []);
    } catch (err) {
        res.status(404).json({ error: 'User or playlists not found' });
    }
};

exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await playlistService.getPlaylistById(
            req.params.userId,
            req.params.playlistId
        );
        res.json(playlist);
    } catch (err) {
        res.status(404).json({ error: 'Playlist not found' });
    }
};

exports.createPlaylist = async (req, res) => {
    try {
        const newPlaylist = await playlistService.createPlaylist(req.params.userId, req.body);
        res.status(201).json(newPlaylist);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create playlist' });
    }
};

exports.updatePlaylist = async (req, res) => {
    try {
        const updated = await playlistService.updatePlaylist(
            req.params.userId,
            req.params.playlistId,
            req.body
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update playlist' });
    }
};

exports.deletePlaylist = async (req, res) => {
    try {
        const deleted = await playlistService.deletePlaylist(
            req.params.userId,
            req.params.playlistId
        );
        res.json(deleted);
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete playlist' });
    }
};
