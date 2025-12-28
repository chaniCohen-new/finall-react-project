import axios from "axios";
const API_URL = 'http://localhost:5000/';

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}users`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }); return response.data; // החזרת הנתונים
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // לזרוק שגיאה במקרה של כישלון
    }
};

export const handleAddUser = async ({ username, password, email, phone, role }) => {
    try {
        const response = await axios.post(
            `${API_URL}users`,
            { username, password, email, phone, role },
            {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }
        );


        console.log('Response:', response.data); // הדפסת התגובה
        alert(response.data.message);  // מראה הודעה להצלחה
    } catch (error) {
        console.error('Error:', error); // פרטי השגיאה
        if (error.response) {
            alert(error.response.data.message);
        } else {
            alert('An unexpected error occurred.');
        }
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}users/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'מחיקה נכשלה');
    }
};

