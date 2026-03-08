import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddWordDialog from './AddWord';
import { addWord, deleteWord, updateWord } from './wordService';

const WordsTable = () => {
    const [words, setWords] = useState([]);
    const [lessons, setLessons] = useState([]); // ✅ הוסף state לשיעורים
    const { lessonId } = useParams();
    const [page, setPage] = useState(0);
    const itemsPerPage = 2;
    const [openDialog, setOpenDialog] = useState(false);
    const [editingWord, setEditingWord] = useState(null);

    // ✅ טען את השיעורים בעת טעינת הקומפוננטה
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get('http://localhost:5000/lessons');
                if (Array.isArray(response.data)) {
                    setLessons(response.data);
                } else {
                    setLessons([]);
                }
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        };

        fetchLessons();
    }, []);

    useEffect(() => {
        const fetchWords = async () => {
            if (!lessonId) {
                console.error("No lesson ID provided!");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/words/lesson/${lessonId}`);
                if (Array.isArray(response.data)) {
                    setWords(response.data);
                } else {
                    setWords([]);
                }
            } catch (error) {
                console.error("Error fetching words:", error);
            }
        };

        fetchWords();
    }, [lessonId]);

    const handleDelete = async (id) => {
        if (window.confirm("האם אתה בטוח שברצונך למחוק את המילה הזו?")) {
            try {
                await deleteWord(id);
                setWords(words.filter((word) => word._id !== id));
            } catch (error) {
                console.error("Error deleting word:", error);
            }
        }
    };

    const handleEdit = (word) => {
        setEditingWord(word);
        setOpenDialog(true);
    };

    const handleUpdateWord = async (updatedWord) => {
        try {
            const updated = await updateWord(updatedWord._id, updatedWord);
            const wordData = updated.word || updated;
            setWords(words.map((word) => (word._id === wordData._id ? wordData : word)));
            setOpenDialog(false);
            setEditingWord(null);
        } catch (error) {
            console.error("Error updating word:", error);
        }
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
        setEditingWord(null);
        setOpenDialog(true);
    };

    const handleAddWordClose = () => {
        setOpenDialog(false);
    };

    const handleWordAdded = (newWord) => {
        setWords([...words, newWord]);
        setOpenDialog(false);
    };

    return (
        <Paper style={{ padding: '20px', margin: '20px' }}>
            <Typography variant="h4" align="center" gutterBottom>
                טבלת מילים
            </Typography>
            <Box display="flex" justifyContent="space-between" marginBottom="20px">
                <Button onClick={prevPage} disabled={page === 0} startIcon={<ArrowBackIcon />}>
                    הקודם
                </Button>
                <Button onClick={nextPage} disabled={(page + 1) * itemsPerPage >= words.length} endIcon={<ArrowForwardIcon />}>
                    הבא
                </Button>
            </Box>
            <Box textAlign="center" marginBottom="20px">
                <Button
                    variant="contained"
                    onClick={handleAddWordOpen}
                    style={{ backgroundColor: '#E3F2FD', color: '#000' }}
                >
                    הוסף מילה לשיעור
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>מילה</TableCell>
                            <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>תרגום</TableCell>
                            <TableCell style={{ fontWeight: 'bold', textAlign: 'center', width: '200px' }}>תמונה</TableCell>
                            <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}></TableCell>
                            <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}></TableCell>
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

                                <TableCell style={{ textAlign: 'right', padding: '10px' }}>
                                    <IconButton onClick={() => handleEdit(word)} aria-label="edit" style={{ backgroundColor: '#E3F2FD', margin: '5px' }}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell style={{ textAlign: 'right', padding: '10px' }}>
                                    <IconButton onClick={() => handleDelete(word._id)} aria-label="delete" style={{ backgroundColor: '#E3F2FD', margin: '5px' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ✅ העבר את lessons prop */}
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