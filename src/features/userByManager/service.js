import axios from "axios";
const API_URL = 'http://localhost:5000/';
const token = localStorage.getItem('token')

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}users`, {
            headers: {
                'Authorization':`Bearer ${token}`
            }
        }); return response.data; // החזרת הנתונים
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // לזרוק שגיאה במקרה של כישלון
    }
};


export const deleteUser = async (userId, token) => {
    try {
        const response = await axios.delete(`${API_URL}users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'מחיקה נכשלה');
    }
};

