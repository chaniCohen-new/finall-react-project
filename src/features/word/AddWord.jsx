import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    MenuItem,
    Typography,
} from '@mui/material';
import { addWord, updateWord } from './wordService';
import { object, string } from 'yup';

const AddWordDialog = ({ open, onClose, onWordAdded, editWord, onWordUpdated, lessons }) => {
    const [newWord, setNewWord] = useState({ word: '', translating: '', lesson: '', image: null });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editWord) {
            setNewWord(editWord);
        } else {
            setNewWord({ word: '', translating: '', lesson: '', image: null });
        }
    }, [editWord]);

    const validationSchema = object().shape({
        word: string().required("מילה היא שדה חובה"),
        translating: string().required("תרגום הוא שדה חובה"),
        lesson: string().required("שיעור הוא שדה חובה"),
    });

    const handleNewWordChange = (e) => {
        const { name, value } = e.target;
        setNewWord({ ...newWord, [name]: value });

        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: undefined
            }));
        }
    };

    const handleImageChange = (e) => {
        setNewWord({ ...newWord, image: e.target.files[0] });
    };

    const handleAddWord = async () => {
        try {
            await validationSchema.validate(newWord, { abortEarly: false });

            if (editWord) {
                const updatedWord = {
                    _id: editWord._id,
                    word: newWord.word,
                    translating: newWord.translating,
                    lesson: newWord.lesson,
                    image: newWord.image,
                };
                const updated = await updateWord(updatedWord._id, updatedWord);
                onWordUpdated(updated.word || updated);
            } else {
                const response = await addWord(newWord);
                onWordAdded(response.word || response);
            }
            onClose();
        } catch (error) {
            if (error.inner) {
                const formattedErrors = {};
                error.inner.forEach(err => {
                    formattedErrors[err.path] = err.message;
                });
                setErrors(formattedErrors);
            } else {
                console.error("Error adding word:", error);
                setErrors({ 
                    general: error.response?.data?.message || "שגיאה בשמירה. אנא נסה שוב." 
                });
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editWord ? 'ערוך מילה' : 'הוסף מילה חדשה'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    מלא את הפרטים להוספת מילה חדשה.
                </DialogContentText>

                {/* שדה למילה */}
                <TextField
                    autoFocus
                    margin="dense"
                    name="word"
                    label="מילה"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={handleNewWordChange}
                    error={!!errors.word}
                    helperText={errors.word}
                    value={newWord.word}
                />

                {/* שדה לתרגום */}
                <TextField
                    margin="dense"
                    name="translating"
                    label="תרגום"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={handleNewWordChange}
                    error={!!errors.translating}
                    helperText={errors.translating}
                    value={newWord.translating}
                />

                {/* ✅ שדה לשיעור עם רשימת שיעורים מותאמים */}
                <TextField
                    select
                    margin="dense"
                    name="lesson"
                    label="בחר שיעור"
                    fullWidth
                    variant="outlined"
                    onChange={handleNewWordChange}
                    error={!!errors.lesson}
                    helperText={errors.lesson}
                    value={newWord.lesson}
                >
                    <MenuItem value="">-- בחר שיעור --</MenuItem>
                    {(lessons || []).map((lesson) => (
                        <MenuItem key={lesson._id} value={lesson._id}>
                            {lesson.name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* העלאת תמונה */}
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-image"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="upload-image">
                    <Button variant="contained" component="span" style={{ marginTop: '10px' }}>
                        העלה תמונה
                    </Button>
                </label>

                {/* תצוגת תצוגה מקדימה של התמונה */}
                {newWord.image && (
                    <img
                        src={URL.createObjectURL(newWord.image)}
                        alt="Preview"
                        style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                    />
                )}

                {/* הצגת שגיאות כלליות */}
                {errors.general && <Typography color="error">{errors.general}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button onClick={handleAddWord} color="primary">{editWord ? 'שמור' : 'הוסף'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddWordDialog;