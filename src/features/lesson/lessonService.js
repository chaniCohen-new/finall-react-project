import axios from 'axios';

export const handleStart = async (selectedLevel) => { // קבלת selectedLevel כפרמטר
    if (selectedLevel) {
        try {
            // עדכון ה-URL כך שיתאים לנתיב החדש
            const response = await axios.get(`http://localhost:5000/lessons/level/${selectedLevel}`);
            setLessons(response.data);
            console.log(response.data); // הוסף שורה זו
            navigate(`/lessons/level/${selectedLevel}`);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    }
};