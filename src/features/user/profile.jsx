import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Alert,
    Card,
    CardContent
} from '@mui/material';

const UserExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { username, userId } = useAuth();

    useEffect(() => {
        const fetchExams = async () => {
            if (!userId) {
                setError('משתמש לא מזוהה');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                const response = await axios.get(
                    `http://localhost:5000/exams/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setExams(Array.isArray(response.data) ? response.data : []);
                setError('');
            } catch (error) {
                console.error('Error fetching exams:', error);
                setError(error.response?.data?.msg || 'שגיאה בטעינת הציונים');
                setExams([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [userId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // ✅ הוסף סטטיסטיקה
    const averageMark = exams.length > 0
        ? (exams.reduce((sum, exam) => sum + exam.mark, 0) / exams.length).toFixed(2)
        : 0;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom>
                ברוכים הבאים, {username}! 👋
            </Typography>

            {/* ✅ סטטיסטיקה */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            ממוצע ציונים
                        </Typography>
                        <Typography variant="h5">{averageMark}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            מספר בחנים
                        </Typography>
                        <Typography variant="h5">{exams.length}</Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* ✅ טבלה */}
            {exams.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>קטגוריה</strong></TableCell>
                                <TableCell><strong>שלב</strong></TableCell>
                                <TableCell align="center"><strong>ציון</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exams.map((exam) => (
                                <TableRow key={exam._id} hover>
                                    <TableCell>{exam.lesson?.category || '-'}</TableCell>
                                    <TableCell>{exam.lesson?.level || '-'}</TableCell>
                                    <TableCell align="center">
                                        <strong>{exam.mark}</strong>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Alert severity="info">אין ציונים להצגה</Alert>
            )}
        </Container>
    );
};

export default UserExams;