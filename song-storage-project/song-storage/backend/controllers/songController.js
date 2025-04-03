const songService = require('../services/songService');

exports.getAllSongs = async (req, res) => {
    try {
        const songs = await songService.getAllSongs();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};

exports.getSongById = async (req, res) => {
    try {
        const song = await songService.getSongById(req.params.id);
        res.json(song);
    } catch (error) {
        res.status(404).json({ error: 'Song not found' });
    }
};

exports.createSong = async (req, res) => {
    try {
        const newSong = await songService.addSong(req.body);
        res.status(201).json(newSong);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create song' });
    }
};

exports.updateSong = async (req, res) => {
    try {
        const updated = await songService.updateSong(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update song' });
    }
};

exports.deleteSong = async (req, res) => {
    try {
        const deleted = await songService.deleteSong(req.params.id);
        res.json(deleted);
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete song' });
    }
};
