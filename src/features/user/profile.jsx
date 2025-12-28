import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserExams = ({ userId }) => {
    const [exams, setExams] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/${userId}`);
                setExams(response.data.exams || []); // ודא שיש מערך, אחרת הגדר כ пустое מערך
                setUserName(response.data.userName || ''); // הנח כאן את השם כפי שהוחזר
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, [userId]);

    return (
        <Container>
            <Typography variant="h4" color="primary" gutterBottom>
                Hi {userName}!
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>קטגוריה</TableCell>
                            <TableCell>שלב</TableCell>
                            <TableCell>ציון</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(exams) && exams.map((exam) => (
                            <TableRow key={exam._id}>
                                <TableCell>{exam.lesson.category}</TableCell>
                                <TableCell>{exam.lesson.level}</TableCell>
                                <TableCell>{exam.mark}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UserExams;