import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminAddQuestion = ({ lessonId, onQuestionAdded, open, onClose }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(lessonId || '');

    // ✅ Fetch lessons on mount
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    'http://localhost:5000/lessons/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setLessons(response.data);
            } catch (err) {
                console.error('Error fetching lessons:', err);
            }
        };

        fetchLessons();
    }, []);

    // ✅ Reset form
    const resetForm = () => {
        setQuestion('');
        setOptions(['', '', '']);
        setCorrectAnswer('');
        setError('');
        setSuccess('');
    };

    // ✅ Handle option change
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value.trim();
        setOptions(newOptions);
    };

    // ✅ Add new option field
    const addOptionField = () => {
        setOptions([...options, '']);
    };

    // ✅ Remove option field
    const removeOptionField = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    // ✅ Validate form
    const validateForm = () => {
        if (!question.trim()) {
            setError('השאלה היא חובה');
            return false;
        }

        if (!selectedLesson) {
            setError('בחר שיעור');
            return false;
        }

        const validOptions = options.filter(opt => opt.trim().length > 0);
        if (validOptions.length < 2) {
            setError('נדרשות לפחות 2 תשובות');
            return false;
        }

        if (!correctAnswer) {
            setError('בחר תשובה נכונה');
            return false;
        }

        if (!validOptions.includes(correctAnswer)) {
            setError('התשובה הנכונה חייבת להיות אחת מהתשובות');
            return false;
        }

        return true;
    };

    // ✅ Handle submit
    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const cleanedOptions = options
                .filter(opt => opt.trim().length > 0)
                .map(opt => opt.trim());

            const payload = {
                lesson: selectedLesson,
                question: question.trim(),
                optional: cleanedOptions,
                answer: correctAnswer.trim(),
            };

            const response = await axios.post(
                'http://localhost:5000/questions/',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess('שאלה נוספה בהצלחה!');
            resetForm();

            // ✅ Callback to parent component
            if (onQuestionAdded) {
                onQuestionAdded(response.data);
            }

            // ✅ Close dialog after success
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error adding question:', err);
            setError(
                err.response?.data?.error || 
                'שגיאה בהוספת השאלה. אנא נסה שוב.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ➕ הוספת שאלה חדשה
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {/* ✅ Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {/* ✅ Success Alert */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* ✅ Lesson selector */}
                    {!lessonId && (
                        <FormControl fullWidth>
                            <InputLabel>בחר שיעור</InputLabel>
                            <Select
                                value={selectedLesson}
                                onChange={(e) => setSelectedLesson(e.target.value)}
                                label="בחר שיעור"
                            >
                                <MenuItem value="">
                                    <em>בחר שיעור</em>
                                </MenuItem>
                                {lessons.map((lesson) => (
                                    <MenuItem key={lesson._id} value={lesson._id}>
                                        {lesson.name || lesson.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {/* ✅ Question input */}
                    <TextField
                        label="השאלה"
                        multiline
                        rows={3}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        fullWidth
                        placeholder="כתוב את השאלה כאן..."
                        variant="outlined"
                    />

                    {/* ✅ Options section */}
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                            תשובות אפשריות:
                        </Typography>

                        {options.map((option, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    mb: 1.5,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <TextField
                                    label={`תשובה ${index + 1}`}
                                    value={option}
                                    onChange={(e) =>
                                        handleOptionChange(index, e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                    placeholder={`כתוב תשובה ${index + 1}...`}
                                />

                                {/* ✅ Remove button */}
                                {options.length > 2 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeOptionField(index)}
                                        sx={{ minWidth: 'auto', mt: 0.5 }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                )}

                                {/* ✅ Correct answer indicator */}
                                {option.trim() && correctAnswer === option.trim() && (
                                    <Chip
                                        label="✓ נכון"
                                        color="success"
                                        variant="outlined"
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                )}
                            </Box>
                        ))}

                        {/* ✅ Add option button */}
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={addOptionField}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            הוסף תשובה
                        </Button>
                    </Box>

                    {/* ✅ Correct answer selector */}
                    <FormControl fullWidth>
                        <InputLabel>בחר תשובה נכונה</InputLabel>
                        <Select
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            label="בחר תשובה נכונה"
                        >
                            <MenuItem value="">
                                <em>בחר תשובה נכונה</em>
                            </MenuItem>
                            {options
                                .filter(opt => opt.trim().length > 0)
                                .map((option, index) => (
                                    <MenuItem key={index} value={option.trim()}>
                                        {option.trim()}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    {/* ✅ Preview */}
                    {question.trim() && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #ddd',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                📋 תצוגה מקדימה:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {question}
                            </Typography>
                            {options
                                .filter(opt => opt.trim().length > 0)
                                .map((option, index) => (
                                    <Typography
                                        key={index}
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mb: 0.5,
                                            color:
                                                correctAnswer === option.trim()
                                                    ? '#4caf50'
                                                    : '#666',
                                            fontWeight:
                                                correctAnswer === option.trim()
                                                    ? 'bold'
                                                    : 'normal',
                                        }}
                                    >
                                        ○ {option.trim()}
                                        {correctAnswer === option.trim() && ' ✓'}
                                    </Typography>
                                ))}
                        </Paper>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    ביטול
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'הוסף שאלה'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminAddQuestion;