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
import AddWordDialog from './AddWord'; // ייבוא קומפוננטת ההוספה
import { addWord, deleteWord, updateWord } from './wordService'; // ייבוא פונקציות ה-API

const WordsTable = () => {
    const [words, setWords] = useState([]);
    const { lessonId } = useParams(); // קבלת ה-ID של השיעור מה-URL
    const [page, setPage] = useState(0);
    const itemsPerPage = 2;
    const [openDialog, setOpenDialog] = useState(false);
    const [editingWord, setEditingWord] = useState(null);

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
            setWords(words.map((word) => (word._id === updated._id ? updated : word)));
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
                                            src={`http://localhost:5000/images/${word.Img}`} // הוספת התחילית
                                            alt={word.word}
                                            style={{ width: '150px', height: 'auto', borderRadius: '5px' }}
                                        />
                                    ) : (
                                        <Typography>לא קיימת תמונה</Typography> // הוסף הודעה במקרה ואין תמונה
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

            <AddWordDialog
                open={openDialog}
                onClose={handleAddWordClose}
                onWordAdded={handleWordAdded}
                editWord={editingWord}
                onWordUpdated={handleUpdateWord}
            />
        </Paper>
    );
};

export default WordsTable;