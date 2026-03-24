import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Paper,
    Button,
    Box,
    Alert,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import AddWordDialog from './AddWord';
import { addWord, deleteWord, updateWord } from './wordService';
import useAuth from '../auth/useAuth'; // ✅ Import ה-Hook

const WordsTable = () => {
    const [words, setWords] = useState([]);
    const [lessons, setLessons] = useState([]);
    const { lessonId } = useParams();
    const [page, setPage] = useState(0);
    const itemsPerPage = 2;
    const [openDialog, setOpenDialog] = useState(false);
    const [editingWord, setEditingWord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAdminMessage, setShowAdminMessage] = useState(false);

    // ✅ קבל את נתוני ההרשאה מ-Redux דרך useAuth
    const { isAdmin } = useAuth();

    // ✅ טען את השיעורים עם TOKEN
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.warn('No token found');
                    return;
                }

                const response = await axios.get('http://localhost:5000/lessons/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data)) {
                    setLessons(response.data);
                } else if (response.data && Array.isArray(response.data.lessons)) {
                    setLessons(response.data.lessons);
                } else {
                    setLessons([]);
                }
            } catch (error) {
                console.error("Error fetching lessons:", error.response?.data || error.message);
                setLessons([]);
            }
        };

        fetchLessons();
    }, []);

    // ✅ פונקציה להטעינה מחדש של המילים
    const fetchWords = useCallback(async () => {
        if (!lessonId) {
            setError("No lesson ID provided!");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `http://localhost:5000/words/lesson/${lessonId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (Array.isArray(response.data)) {
                setWords(response.data);
                setError(null);
            } else if (response.data && Array.isArray(response.data.words)) {
                setWords(response.data.words);
                setError(null);
            } else {
                setWords([]);
            }
        } catch (error) {
            console.error("Error fetching words:", error.response?.data || error.message);
            setError("שגיאה בטעינת המילים");
            setWords([]);
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    // ✅ טען את המילים של השיעור הנוכחי
    useEffect(() => {
        fetchWords();
    }, [lessonId, fetchWords]);

    // ✅ מחיקת מילה - עם בדיקת הרשאות מ-Redux
    const handleDelete = async (id) => {
        if (!isAdmin) {
            setShowAdminMessage(true);
            setTimeout(() => setShowAdminMessage(false), 3000);
            return;
        }

        if (window.confirm("האם אתה בטוח שברצונך למחוק את המילה הזו?")) {
            try {
                await deleteWord(id);
                setWords(words.filter((word) => word._id !== id));
            } catch (error) {
                setError("שגיאה במחיקת המילה");
                console.error("Error deleting word:", error);
            }
        }
    };

    // ✅ עריכת מילה - עם בדיקת הרשאות מ-Redux
    const handleEdit = (word) => {
        if (!isAdmin) {
            setShowAdminMessage(true);
            setTimeout(() => setShowAdminMessage(false), 3000);
            return;
        }

        setEditingWord(word);
        setOpenDialog(true);
    };

    const handleUpdateWord = (updatedWord) => {
        setWords(words.map((word) =>
            word._id === updatedWord._id ? updatedWord : word
        ));
        setOpenDialog(false);
        setEditingWord(null);
    };

    const nextPage = () => {
        if ((page + 1) * itemsPerPage < words.length) {
            setPage(page + 1);
        }
    };

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleAddWordOpen = () => {
        if (!isAdmin) {
            setShowAdminMessage(true);
            setTimeout(() => setShowAdminMessage(false), 3000);
            return;
        }

        setEditingWord(null);
        setOpenDialog(true);
    };

    const handleAddWordClose = () => {
        setOpenDialog(false);
        setEditingWord(null);
    };

    const handleWordAdded = (newWord) => {
        setWords([...words, newWord]);
    };

    const totalPages = Math.ceil(words.length / itemsPerPage);

    if (loading) {
        return (
            <Paper style={{ padding: '40px', textAlign: 'center', margin: '20px' }}>
                <CircularProgress />
                <Typography sx={{ marginTop: '15px' }}>טוען מילים...</Typography>
            </Paper>
        );
    }

    return (
        <Paper style={{ padding: '20px', margin: '20px' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: '20px' }}>
                📚 טבלת מילים
            </Typography>

            {error && (
                <Alert severity="error" sx={{ marginBottom: '15px' }}>
                    {error}
                </Alert>
            )}

            {showAdminMessage && (
                <Alert severity="warning" sx={{ marginBottom: '15px' }}>
                    ⚠️ פעולה זו דורשת הרשאות מנהל. אנא צור קשר עם המנהל.
                </Alert>
            )}

            <Box display="flex" justifyContent="space-between" marginBottom="20px">
                <Button
                    onClick={prevPage}
                    disabled={page === 0}
                    startIcon={<ArrowForwardIcon />}
                    variant="outlined"
                    sx={{
                        gap: '8px'
                    }}
                >
                    הקודם
                </Button>
                <Typography sx={{ alignSelf: 'center', fontWeight: 'bold' }}>
                    דף {page + 1} מתוך {totalPages || 1}
                </Typography>
                <Button
                    onClick={nextPage}
                    disabled={(page + 1) * itemsPerPage >= words.length}
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    sx={{
                        gap: '8px'
                    }}
                >
                    הבא
                </Button>
            </Box>
            <Box textAlign="center" marginBottom="20px">
                {isAdmin ? (
                    <Button
                        variant="contained"
                        onClick={handleAddWordOpen}
                        style={{ backgroundColor: '#E3F2FD', color: '#000' }}
                    >
                        ➕ הוסף מילה לשיעור
                    </Button>
                ) : (
                    <Tooltip title="דורשת הרשאות מנהל">
                        <span>
                            <Button
                                variant="contained"
                                disabled
                                style={{ backgroundColor: '#ccc', color: '#666' }}
                                startIcon={<LockIcon />}
                            >
                                הוסף מילה לשיעור
                            </Button>
                        </span>
                    </Tooltip>
                )}
            </Box>

            {words.length === 0 ? (
                <Typography align="center" color="textSecondary" sx={{ padding: '40px' }}>
                    אין מילים בשיעור זה עדיין
                </Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>מילה</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>תרגום</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center', width: '200px' }}>תמונה</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>עדכון</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>מחיקה</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {words.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((word) => (
                                <TableRow key={word._id}>
                                    <TableCell style={{ textAlign: 'center' }}>{word.word}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{word.translating}</TableCell>
                                    <TableCell style={{ textAlign: 'center', padding: '20px' }}>
                                        {word.Img ? (
                                            <img
                                                src={`http://localhost:5000/images/${word.Img}`}
                                                alt={word.word}
                                                style={{ width: '150px', height: 'auto', borderRadius: '5px' }}
                                            />
                                        ) : (
                                            <Typography>לא קיימת תמונה</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell style={{ textAlign: 'center', padding: '10px' }}>
                                        <Tooltip title={isAdmin ? "עדכן מילה" : "דורשת הרשאות מנהל"}>
                                            <span>
                                                <IconButton
                                                    onClick={() => handleEdit(word)}
                                                    aria-label="edit"
                                                    disabled={!isAdmin}
                                                    style={{
                                                        backgroundColor: isAdmin ? '#E3F2FD' : '#f0f0f0',
                                                        margin: '5px',
                                                        cursor: isAdmin ? 'pointer' : 'not-allowed',
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell style={{ textAlign: 'center', padding: '10px' }}>
                                        <Tooltip title={isAdmin ? "מחק מילה" : "דורשת הרשאות מנהל"}>
                                            <span>
                                                <IconButton
                                                    onClick={() => handleDelete(word._id)}
                                                    aria-label="delete"
                                                    disabled={!isAdmin}
                                                    style={{
                                                        backgroundColor: isAdmin ? '#E3F2FD' : '#f0f0f0',
                                                        margin: '5px',
                                                        cursor: isAdmin ? 'pointer' : 'not-allowed',
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <AddWordDialog
                open={openDialog}
                onClose={handleAddWordClose}
                onWordAdded={handleWordAdded}
                editWord={editingWord}
                onWordUpdated={handleUpdateWord}
                lessons={lessons}
            />
        </Paper>
    );
};

export default WordsTable;