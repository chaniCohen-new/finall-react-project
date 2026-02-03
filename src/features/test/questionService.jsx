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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AdminAddQuestion from './addQuestion.jsx';

const AdminQuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

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

    // ✅ Handle add question success
    const handleQuestionAdded = (newQuestion) => {
        setQuestions([...questions, newQuestion]);
        setOpenAddDialog(false);
    };

    // ✅ Handle delete question
    const handleDeleteQuestion = async () => {
        try {
            await axios.delete(`${API_BASE}/questions/delete`, {
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

    // ✅ Open edit dialog
    const handleEditQuestion = (question) => {
        setSelectedQuestion(question);
        setOpenEditDialog(true);
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
                </CardContent>
            </Card>

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