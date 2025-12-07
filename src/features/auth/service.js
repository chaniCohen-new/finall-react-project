import axios from "axios";
const API_URL = 'http://localhost:5000/'; 

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}login`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};

export const registerUser = async (username, password, email, phone, role) => {
    try {
        const response = await axios.post(`${API_URL}register`, { username, password, email, phone, role }).then(res=> console.log("okay")).catch(err=> console.log("error", err))
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network error');
    }
};