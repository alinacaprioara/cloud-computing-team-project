const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_URL = 'https://ws.audioscrobbler.com/2.0/';

exports.getTopTracksByArtist = async (artistName) => {
    try {
        const response = await axios.get(LASTFM_URL, {
            params: {
                method: 'artist.gettoptracks',
                artist: artistName,
                api_key: API_KEY,
                format: 'json',
                limit: 3,
            }
        });

        const tracks = response.data.toptracks.track;

        return tracks.map(track => ({
            name: track.name,
        }));
    } catch (error) {
        console.error('Last.fm error:', error.message);
        throw new Error('Failed to fetch top tracks');
    }
};
