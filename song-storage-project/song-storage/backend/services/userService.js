const axios = require('axios');
const API_URL = 'http://localhost:8000';

const getAllUsers = async () => {
    const res = await axios.get(`${API_URL}/users`);
    return res.data;
};

const getUserById = async (id) => {
    const res = await axios.get(`${API_URL}/users/${id}`);
    return res.data;
};

const createUser = async (userData) => {
    const res = await axios.post(`${API_URL}/users`, userData);
    return res.data;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
};
