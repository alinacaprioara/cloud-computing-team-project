const lastfmService = require('../services/lastfmServices');

exports.getTopTracks = async (req, res) => {
    const artist = req.query.artist;
    if (!artist) return res.status(400).json({ error: 'Artist name is required' });

    try {
        const tracks = await lastfmService.getTopTracksByArtist(artist);
        res.json(tracks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
