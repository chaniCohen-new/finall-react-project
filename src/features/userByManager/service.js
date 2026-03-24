import axios from "axios";

const API_URL = 'http://localhost:5000/';

const getToken = () => localStorage.getItem('token');

export const fetchUsers = async () => {
    const token = getToken();
    if (!token) {
        console.error('No token available');
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.get(`${API_URL}users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const handleAddUser = async ({ username, password, email, phone, role }) => {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.post(
            `${API_URL}users`,
            { username, password, email, phone, role },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        console.log('Response:', response.data);
        return response.data; // ✅ חזור את הנתונים!
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'שגיאה בהוספת משתמש');
        } else {
            throw new Error('שגיאה לא צפויה');
        }
    }
};

export const deleteUser = async (userId) => {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        // ✅ תקן את ה-endpoint - "user" singular, לא "users"
        const response = await axios.delete(`${API_URL}users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error(error.response?.data?.message || 'מחיקה נכשלה');
    }
};

export const updateUser = async (userId, userData) => {
    const token = getToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    const { username, password, email, phone, role } = userData;

    try {
        const response = await axios.put(
            `${API_URL}users/${userId}`,
            { username, password, email, phone, role },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log('Update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'עדכון נכשל');
        } else {
            throw new Error('שגיאה לא צפויה');
        }
    }
};

export const fetchUserById = async (userId) => {
    const token = getToken();
    if (!token) {
        console.error('No token available');
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.get(`${API_URL}users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};