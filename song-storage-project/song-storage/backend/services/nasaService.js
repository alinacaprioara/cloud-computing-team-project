require('dotenv').config();
const axios = require('axios');

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = process.env.NASA_API_KEY;

function getRandomDate() {
    const start = new Date(1995, 5, 16);
    const end = new Date();
    const random = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return random.toISOString().split('T')[0];
}

exports.searchNasaImages = async () => {
    try {

        const date = getRandomDate();
        const res = await axios.get(NASA_APOD_URL, {
            params: {
                api_key: API_KEY,
                date: date,
            }
        });

        if (res.data.media_type !== 'image') return null;
        return res.data.url;
    } catch (error) {
        console.error('Error fetching NASA image:', error.message);
        return null;
    }
};