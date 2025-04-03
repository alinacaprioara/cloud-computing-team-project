const axios = require('axios');
const API_URL = 'http://localhost:8000';

const getPlaylists = async (userId) => {
    const res = await axios.get(`${API_URL}/users/${userId}/playlists`);
    return res.data;
};

const getPlaylistById = async (userId, playlistId) => {
    const res = await axios.get(`${API_URL}/users/${userId}/playlists/${playlistId}`);
    return res.data;
};

const createPlaylist = async (userId, playlistData) => {
    const res = await axios.post(`${API_URL}/users/${userId}/playlists`, playlistData);
    return res.data;
};

const updatePlaylist = async (userId, playlistId, playlistData) => {
    const res = await axios.put(`${API_URL}/users/${userId}/playlists/${playlistId}`, playlistData);
    return res.data;
};

const deletePlaylist = async (userId, playlistId) => {
    const res = await axios.delete(`${API_URL}/users/${userId}/playlists/${playlistId}`);
    return res.data;
};

module.exports = {
    getPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
};
