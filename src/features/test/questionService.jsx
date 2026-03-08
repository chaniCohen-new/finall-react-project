import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Chip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AdminAddQuestion from './addQuestion.jsx';

const AdminQuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState('');
    const [selectedLessonData, setSelectedLessonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [editLoading, setEditLoading] = useState(false); // ✅ חדש
    const [editError, setEditError] = useState(''); // ✅ חדש

    const API_BASE = 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    // ✅ Fetch lessons
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get(`${API_BASE}/lessons/`, { headers });
                setLessons(response.data);
            } catch (err) {
                console.error('Error fetching lessons:', err);
            }
        };

        fetchLessons();
    }, []);

    // ✅ Fetch questions by lesson
    useEffect(() => {
        if (!selectedLesson) {
            setQuestions([]);
            setSelectedLessonData(null);
            return;
        }

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_BASE}/questions/lesson/${selectedLesson}`,
                    { headers }
                );
                setQuestions(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError(err.response?.data?.error || 'שגיאה בטעינת השאלות');
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [selectedLesson]);

    // ✅ עדכן את הנתונים כשבחירה משתנה
    const handleLessonChange = (e) => {
        const lessonId = e.target.value;
        setSelectedLesson(lessonId);

        const lesson = lessons.find(l => l._id === lessonId);
        setSelectedLessonData(lesson);
    };

    // ✅ Handle add question success
    const handleQuestionAdded = (newQuestion) => {
        setQuestions([...questions, newQuestion]);
        setOpenAddDialog(false);
    };

    // ✅ Open edit dialog
    const handleEditQuestion = (question) => {
        setSelectedQuestion({ ...question }); // ✅ עותק של השאלה
        setEditError('');
        setOpenEditDialog(true);
    };

    // ✅ Handle edit changes
    const handleEditChange = (field, value) => {
        setSelectedQuestion(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // ✅ Handle option change in edit
    const handleEditOptionChange = (index, value) => {
        const newOptions = [...selectedQuestion.optional];
        newOptions[index] = value.trim();
        setSelectedQuestion(prev => ({
            ...prev,
            optional: newOptions
        }));
    };

    // ✅ Handle save edit
    const handleSaveEdit = async () => {
        // Validate
        if (!selectedQuestion.question.trim()) {
            setEditError('השאלה היא חובה');
            return;
        }

        if (selectedQuestion.optional.filter(o => o.trim()).length < 2) {
            setEditError('נדרשות לפחות 2 תשובות');
            return;
        }

        if (!selectedQuestion.answer.trim()) {
            setEditError('בחר תשובה נכונה');
            return;
        }

        try {
            setEditLoading(true);
            setEditError('');

            const cleanedOptions = selectedQuestion.optional
                .filter(opt => opt.trim().length > 0)
                .map(opt => opt.trim());

            const payload = {
                _id: selectedQuestion._id,
                question: selectedQuestion.question.trim(),
                optional: cleanedOptions,
                answer: selectedQuestion.answer.trim(),
                lesson: selectedQuestion.lesson || selectedLesson,
            };

            const response = await axios.put(
                `${API_BASE}/questions`,
                payload,
                { headers }
            );

            // ✅ עדכן את הטבלה
            setQuestions(questions.map(q => 
                q._id === selectedQuestion._id ? response.data : q
            ));

            setOpenEditDialog(false);
            setSelectedQuestion(null);
        } catch (err) {
            console.error('Error updating question:', err);
            setEditError(
                err.response?.data?.error || 
                'שגיאה בעדכון השאלה. אנא נסה שוב.'
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ✅ Handle delete question
    const handleDeleteQuestion = async () => {
        try {
            await axios.delete(`${API_BASE}/questions`, {
                data: { _id: questionToDelete._id },
                headers,
            });

            setQuestions(
                questions.filter(q => q._id !== questionToDelete._id)
            );
            setDeleteConfirmDialog(false);
            setQuestionToDelete(null);
        } catch (err) {
            console.error('Error deleting question:', err);
            setError('שגיאה במחיקת השאלה');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* ✅ Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    📚 ניהול שאלות
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddDialog(true)}
                    disabled={!selectedLesson}
                >
                    הוסף שאלה חדשה
                </Button>
            </Box>

            {/* ✅ Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* ✅ Lesson Selector */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <FormControl fullWidth>
                        <InputLabel>בחר שיעור</InputLabel>
                        <Select
                            value={selectedLesson}
                            onChange={handleLessonChange}
                            label="בחר שיעור"
                        >
                            <MenuItem value="">
                                <em>בחר שיעור</em>
                            </MenuItem>
                            {lessons.map((lesson) => (
                                <MenuItem key={lesson._id} value={lesson._id}>
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
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* ✅ הצגת שיעור נבחר */}
            {selectedLessonData && (
                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        backgroundColor: '#e3f2fd',
                        border: '2px solid #1976d2',
                        borderRadius: 2,
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold', color: '#1565c0', mb: 0.5 }}
                            >
                                📚 שיעור נבחר:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                                {selectedLessonData.name || selectedLessonData.title}
                            </Typography>
                            {selectedLessonData.category && (
                                <Typography variant="caption" sx={{ color: '#1565c0', display: 'block', mt: 0.5 }}>
                                    📂 קטגוריה: {selectedLessonData.category}
                                </Typography>
                            )}
                        </Box>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#1976d2', fontWeight: 'bold' }}
                        >
                            {questions.length} שאלות
                        </Typography>
                    </Box>
                </Paper>
            )}

            {/* ✅ Loading state */}
            {loading && (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            )}

            {/* ✅ Questions table */}
            {selectedLesson && !loading && questions.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>שאלה</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                                    תשובה נכונה
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                                    מספר תשובות
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                                    פעולות
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question._id} hover>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                            {question.question}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={question.answer}
                                            color="success"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {question.optional?.length || 0}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditQuestion(question)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                                setQuestionToDelete(question);
                                                setDeleteConfirmDialog(true);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ✅ Empty state */}
            {selectedLesson && !loading && questions.length === 0 && (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="textSecondary" sx={{ mb: 2 }}>
                            אין שאלות לשיעור זה
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAddDialog(true)}
                        >
                            הוסף שאלה ראשונה
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* ✅ Add Question Dialog */}
            <AdminAddQuestion
                lessonId={selectedLesson}
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onQuestionAdded={handleQuestionAdded}
            />

            {/* ✅ Edit Question Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    ✏️ עדכן שאלה
                </DialogTitle>

                <DialogContent sx={{ pt: 2 }}>
                    {editError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setEditError('')}>
                            {editError}
                        </Alert>
                    )}

                    {selectedQuestion && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* ✅ Question field */}
                            <TextField
                                label="השאלה"
                                multiline
                                rows={3}
                                value={selectedQuestion.question}
                                onChange={(e) => handleEditChange('question', e.target.value)}
                                fullWidth
                                variant="outlined"
                            />

                            {/* ✅ Options */}
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    תשובות:
                                </Typography>
                                {selectedQuestion.optional?.map((option, index) => (
                                    <TextField
                                        key={index}
                                        label={`תשובה ${index + 1}`}
                                        value={option}
                                        onChange={(e) => handleEditOptionChange(index, e.target.value)}
                                        fullWidth
                                        size="small"
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Box>

                            {/* ✅ Correct answer selector */}
                            <FormControl fullWidth>
                                <InputLabel>תשובה נכונה</InputLabel>
                                <Select
                                    value={selectedQuestion.answer}
                                    onChange={(e) => handleEditChange('answer', e.target.value)}
                                    label="תשובה נכונה"
                                >
                                    {selectedQuestion.optional
                                        ?.filter(opt => opt.trim())
                                        .map((option, index) => (
                                            <MenuItem key={index} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setOpenEditDialog(false)} variant="outlined">
                        ביטול
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        color="primary"
                        disabled={editLoading}
                    >
                        {editLoading ? <CircularProgress size={24} /> : 'שמור שינויים'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ✅ Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmDialog} onClose={() => setDeleteConfirmDialog(false)}>
                <DialogTitle>⚠️ מחיקת שאלה</DialogTitle>
                <DialogContent>
                    <Typography>
                        האם אתה בטוח שברצונך למחוק את השאלה הזו?
                    </Typography>
                    {questionToDelete && (
                        <Typography sx={{ mt: 2, fontStyle: 'italic', color: '#666' }}>
                            "{questionToDelete.question}"
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmDialog(false)}>ביטול</Button>
                    <Button
                        onClick={handleDeleteQuestion}
                        variant="contained"
                        color="error"
                    >
                        מחק
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminQuestionsPage;