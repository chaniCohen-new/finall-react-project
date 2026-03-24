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
    Box,
    CircularProgress,
} from '@mui/material';
import { addWord, updateWord } from './wordService';
import { object, string } from 'yup';

const AddWordDialog = ({ open, onClose, onWordAdded, editWord, onWordUpdated, lessons }) => {
    const [newWord, setNewWord] = useState({ word: '', translating: '', lesson: '', image: null });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // ✅ אתחול נתונים בעת פתיחת הדיאלוג
    useEffect(() => {
        if (editWord) {
            setNewWord({
                word: editWord.word || '',
                translating: editWord.translating || '',
                lesson: editWord.lesson || '',
                image: null,
            });
            // אם יש תמונה קיימת, הצג אותה
            if (editWord.Img) {
                setImagePreview(`http://localhost:5000/images/${editWord.Img}`);
            }
        } else {
            setNewWord({ word: '', translating: '', lesson: '', image: null });
            setImagePreview(null);
        }
        setErrors({});
    }, [editWord, open]);

    const validationSchema = object().shape({
        word: string().required("מילה היא שדה חובה").min(1, "מילה חייבת להכיל לפחות תו אחד"),
        translating: string().required("תרגום הוא שדה חובה").min(1, "תרגום חייב להכיל לפחות תו אחד"),
        lesson: string().required("שיעור הוא שדה חובה"),
    });

    const handleNewWordChange = (e) => {
        const { name, value } = e.target;
        setNewWord((prev) => ({ ...prev, [name]: value }));

        // ✅ נקה שגיאות בזמן הקלדה
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // ✅ בדוק גודל תמונה (עד 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    image: "גודל התמונה חייב להיות עד 5MB"
                }));
                return;
            }

            setNewWord((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));

            // ✅ נקה שגיאות של תמונה
            if (errors.image) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.image;
                    return newErrors;
                });
            }
        }
    };

    const handleAddWord = async () => {
        try {
            setLoading(true);
            await validationSchema.validate(newWord, { abortEarly: false });

            if (editWord) {
                // ✅ עדכון מילה קיימת
                const updatedWord = {
                    _id: editWord._id,
                    word: newWord.word.trim(),
                    translating: newWord.translating.trim(),
                    lesson: newWord.lesson,
                    image: newWord.image,
                };
                const response = await updateWord(editWord._id, updatedWord);
                onWordUpdated(response.word || response);
            } else {
                // ✅ הוספת מילה חדשה
                const dataToSend = {
                    word: newWord.word.trim(),
                    translating: newWord.translating.trim(),
                    lesson: newWord.lesson,
                    image: newWord.image,
                };
                const response = await addWord(dataToSend);
                onWordAdded(response.word || response);
            }

            setLoading(false);
            onClose();
        } catch (error) {
            setLoading(false);

            if (error.inner) {
                const formattedErrors = {};
                error.inner.forEach((err) => {
                    formattedErrors[err.path] = err.message;
                });
                setErrors(formattedErrors);
            } else {
                console.error("Error:", error);
                setErrors({
                    general: error.response?.data?.message || "שגיאה בשמירה. אנא נסה שוב."
                });
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'right', direction: 'rtl' }}>
                {editWord ? '✏️ ערוך מילה' : '➕ הוסף מילה חדשה'}
            </DialogTitle>
            <DialogContent sx={{ direction: 'rtl' }}>
                <DialogContentText sx={{ marginBottom: '20px', color: '#666' }}>
                    {editWord ? 'עדכן את פרטי המילה' : 'מלא את הפרטים להוספת מילה חדשה'}
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
                    disabled={loading}
                    inputProps={{ dir: 'rtl' }}
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
                    disabled={loading}
                    inputProps={{ dir: 'rtl' }}
                />

                {/* ✅ שדה לשיעור - עם Box ו-Typography בתוך MenuItem */}
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
                    disabled={loading || (lessons && lessons.length === 0)}
                >
                    <MenuItem value="">
                        <em>-- בחר שיעור --</em>
                    </MenuItem>
                    {(lessons || []).map((lesson) => (
                        <MenuItem key={lesson._id} value={lesson._id}>
                            {/* ✅ אותו פורמט כמו ב-AdminAddQuestion */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {lesson.name || lesson.title}
                                </Typography>
                                {lesson.category && (
                                    <Typography 
                                        variant="caption" 
                                        sx={{ color: '#666', fontSize: '0.75rem' }}
                                    >
                                        📂 {lesson.category}
                                    </Typography>
                                )}
                            </Box>
                        </MenuItem>
                    ))}
                </TextField>

                {/* בדיקה אם אין שיעורים */}
                {(!lessons || lessons.length === 0) && (
                    <Typography color="warning" variant="body2" sx={{ marginTop: '10px' }}>
                        ⚠️ אין שיעורים זמינים. אנא צור שיעור תחילה.
                    </Typography>
                )}

                {/* העלאת תמונה */}
                <Box sx={{ marginTop: '15px' }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-image"
                        type="file"
                        onChange={handleImageChange}
                        disabled={loading}
                    />
                    <label htmlFor="upload-image">
                        <Button
                            variant="contained"
                            component="span"
                            disabled={loading}
                            sx={{ backgroundColor: '#1976d2' }}
                        >
                            {newWord.image ? '🖼️ החלף תמונה' : '📷 העלה תמונה'}
                        </Button>
                    </label>
                    {errors.image && (
                        <Typography color="error" variant="body2" sx={{ marginTop: '5px' }}>
                            {errors.image}
                        </Typography>
                    )}
                </Box>

                {/* תצוגה מקדימה של התמונה */}
                {imagePreview && (
                    <Box sx={{ marginTop: '15px', textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                            תצוגה מקדימה:
                        </Typography>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '2px solid #1976d2'
                            }}
                        />
                    </Box>
                )}

                {/* הצגת שגיאות כלליות */}
                {errors.general && (
                    <Typography color="error" sx={{ marginTop: '15px', fontWeight: 'bold' }}>
                        ❌ {errors.general}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ direction: 'rtl', padding: '15px' }}>
                <Button onClick={onClose} disabled={loading}>
                    ❌ ביטול
                </Button>
                <Button
                    onClick={handleAddWord}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        backgroundColor: editWord ? '#4caf50' : '#1976d2',
                        '&:disabled': { opacity: 0.7 }
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ marginRight: '8px' }} />
                            שמירה...
                        </>
                    ) : editWord ? (
                        '✅ שמור'
                    ) : (
                        '➕ הוסף'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddWordDialog;