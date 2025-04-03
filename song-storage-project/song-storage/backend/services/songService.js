const axios = require('axios');
const API_URL = 'http://localhost:8000';

const getAllSongs = async () => {
    const res = await axios.get(`${API_URL}/songs`);
    return res.data;
};

const getSongById = async (id) => {
    const res = await axios.get(`${API_URL}/songs/${id}`);
    return res.data;
};

const addSong = async (songData) => {
    const res = await axios.post(`${API_URL}/songs`, songData);
    return res.data;
};

const updateSong = async (id, songData) => {
    const res = await axios.put(`${API_URL}/songs/${id}`, songData);
    return res.data;
};

const deleteSong = async (id) => {
    const res = await axios.delete(`${API_URL}/songs/${id}`);
    return res.data;
};

module.exports = {
    getAllSongs,
    getSongById,
    addSong,
    updateSong,
    deleteSong,
};
