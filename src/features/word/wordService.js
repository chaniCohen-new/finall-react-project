import axios from 'axios';
const token = localStorage.getItem('token')

// פונקציה להוספת מילה
export const addWord = async (newWord) => {
    const formData = new FormData();
    formData.append('word', newWord.word);
    formData.append('translating', newWord.translating);
    formData.append('lesson', newWord.lesson);
    if (newWord.image) formData.append('image', newWord.image);

    try {
        const response = await axios.post('http://localhost:5000/words', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // החזרת המילה שנוספה
    } catch (error) {
        console.error("Error adding word:", error);
        throw error; // זרוק שגיאה אם נכשלה
    }
};

// פונקציה למחיקת מילה
export const deleteWord = async (wordId) => {
    try {
        const response = await axios.delete(`http://localhost:5000/words`, { data: { _id: wordId } });
        return response.data; // החזרת התגובה מהשרת
    } catch (error) {
        console.error("Error deleting word:", error);
        throw error; // זרוק שגיאה אם נכשלה
    }
};


// פונקציה לעדכון מילה
export const updateWord = async (wordId, updatedWord) => {
    const formData = new FormData();
    formData.append('_id', wordId); 
    formData.append('word', updatedWord.word);
    formData.append('translating', updatedWord.translating);
    formData.append('lesson', updatedWord.lesson);
    if (updatedWord.image) formData.append('image', updatedWord.image);

    try {
        const response = await axios.put(`http://localhost:5000/words/${wordId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` 
            },
        });
        return response.data; // החזרת המילה המעודכנת
    } catch (error) {
        console.error("Error updating word:", error);
        throw error; // זרוק שגיאה אם נכשלה
    }
};