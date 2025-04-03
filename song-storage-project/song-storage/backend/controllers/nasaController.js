const nasaService = require('../services/nasaService');

exports.searchImage = async (req, res) => {

    try {

        const imageUrl = await nasaService.searchNasaImages();
        if (!imageUrl) return res.status(404).json({ error: 'No image found' });

        res.json({ imageUrl });
    } catch (err) {
        console.error('NASA Search Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch NASA image' });
    }
};
