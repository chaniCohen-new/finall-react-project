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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const WordsTable = () => {
    const [words, setWords] = useState([]);

    // פונקציה לקבלת המילים מהשרת
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

    const handleDelete = (id) => {
        // הוספת הלוגיקה למחיקת המילה
        console.log("Delete word with ID:", id);
    };

    const handleEdit = (id) => {
        // הוספת הלוגיקה לעריכת המילה
        console.log("Edit word with ID:", id);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 'bold', paddingLeft: '60px' }}>מילה</TableCell> {/* הזזה ימינה */}
                        <TableCell style={{ fontWeight: 'bold', paddingLeft: '10px' }}>תרגום</TableCell>
                        <TableCell style={{ fontWeight: 'bold', paddingLeft: '10px' }}>תמונה</TableCell>
                        <TableCell style={{ fontWeight: 'bold', paddingLeft: '10px' }}>עריכה</TableCell>
                        <TableCell style={{ fontWeight: 'bold', paddingLeft: '10px' }}>מחיקה</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {words.map((word) => (
                        <TableRow key={word._id}>
                            <TableCell style={{ paddingLeft: '60px' }}>{word.word}</TableCell> {/* גם כאן לזוז ימינה */}
                            <TableCell style={{ paddingLeft: '10px' }}>{word.translating}</TableCell>
                            <TableCell style={{ paddingLeft: '10px' }}>
                                <img src={word.Img} alt={word.word} style={{ width: '50px', height: 'auto' }} />
                            </TableCell>
                            <TableCell style={{ paddingLeft: '10px' }}>
                                <IconButton onClick={() => handleEdit(word._id)} aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell style={{ paddingLeft: '10px' }}>
                                <IconButton onClick={() => handleDelete(word._id)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WordsTable;