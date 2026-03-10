import axios from 'axios';

const API_URL = 'http://localhost:5000';

// ✅ פונקציה להוספת מילה
export const addWord = async (newWord) => {
    const formData = new FormData();
    formData.append('word', newWord.word);
    formData.append('translating', newWord.translating);
    formData.append('lesson', newWord.lesson);
    if (newWord.image) {
        formData.append('image', newWord.image);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/words`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data.word ? response.data : { word: response.data };
    } catch (error) {
        console.error("Error adding word:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ פונקציה למחיקת מילה
export const deleteWord = async (wordId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/words`, {
            data: { _id: wordId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting word:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ פונקציה לעדכון מילה
export const updateWord = async (wordId, updatedWord) => {
    const formData = new FormData();
    formData.append('_id', wordId);
    formData.append('word', updatedWord.word);
    formData.append('translating', updatedWord.translating);
    formData.append('lesson', updatedWord.lesson);

    // ✅ שלח תמונה רק אם יש חדשה
    if (updatedWord.image instanceof File) {
        formData.append('image', updatedWord.image);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/words/${wordId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating word:", error.response?.data || error.message);
        throw error;
    }
};