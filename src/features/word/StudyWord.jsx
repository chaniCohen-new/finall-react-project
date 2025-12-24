import React, { useEffect, useState } from 'react';
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
    const [page, setPage] = useState(0);
    const itemsPerPage = 2;
    const [openDialog, setOpenDialog] = useState(false);
    const [editingWord, setEditingWord] = useState(null);

    const fetchWords = async () => {
        try {
            const response = await axios.get('http://localhost:5000/words');
            setWords(response.data);
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    };

    useEffect(() => {
        fetchWords();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("האם אתה בטוח שברצונך למחוק את המילה הזו?")) {
            try {
                await deleteWord(id); // קריאה לפונקציית המחיקה
                setWords(words.filter((word) => word._id !== id)); // עדכון הרשימה
            } catch (error) {
                console.error("Error deleting word:", error);
            }
        }
    };

    const handleEdit = (word) => {
        setEditingWord(word); // הגדרת המילה לעריכה
        setOpenDialog(true); // פתח את הדיאלוג
    };

    const handleUpdateWord = async (updatedWord) => {
        try {
            const updated = await updateWord(updatedWord._id, updatedWord); // קריאה לפונקציית העדכון
            setWords(words.map((word) => (word._id === updated._id ? updated : word))); // עדכון הרשימה
            setOpenDialog(false); // סגירת דיאלוג העריכה
            setEditingWord(null); // איפוס המילה לעריכה
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
        setEditingWord(null); // איפוס המילה לעריכה
        setOpenDialog(true); // פתח את הדיאלוג
    };

    const handleAddWordClose = () => {
        setOpenDialog(false);
    };

    const handleWordAdded = (newWord) => {
        setWords([...words, newWord]);
        setOpenDialog(false); // סגירת דיאלוג הוספת מילה
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
                    style={{ backgroundColor: '#E3F2FD', color: '#000' }} // צבע תכלת
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
                                    <img
                                        src={word.imageUrl}
                                        alt={word.word}
                                        style={{ width: '150px', height: 'auto', borderRadius: '5px' }} // הגדלת רוחב התמונה
                                    />
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

            {/* דיאלוג להוספת מילה */}
            <AddWordDialog
                open={openDialog}
                onClose={handleAddWordClose}
                onWordAdded={handleWordAdded}
                editWord={editingWord} // העברת המילה לעריכה אם קיימת
                onWordUpdated={handleUpdateWord} // מעביר פונקציה לעדכון מילה
            />
        </Paper>
    );
};

export default WordsTable;