import axios from "axios";

const API_URL = 'http://localhost:5000/';

export const loginUser = async (username, password) => {
    try {
        console.log('📥 Login Request:', { username });
        const response = await axios.post(`${API_URL}login`, { username, password });
        console.log('✅ Login Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Login Error:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            data: error.response?.data,
        });
        throw error.response?.data || new Error('Network error');
    }
};

export const registerUser = async (username, password, email, phone, role) => {
    try {
        console.log('📥 Register Request:', { username, email, phone, role });
        const response = await axios.post(`${API_URL}register`, { 
            username, 
            password, 
            email, 
            phone, 
            role 
        });
        console.log('✅ Register Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Register Error:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            passwordErrors: error.response?.data?.passwordErrors,
            data: error.response?.data,
        });
        throw error.response?.data || new Error('Network error');
    }
};