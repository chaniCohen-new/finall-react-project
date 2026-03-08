import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Container,
    Box,
    Typography,
    LinearProgress,
    Alert,
    CircularProgress,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const QuizComponent = () => {
    const { userId, isTokenValid } = useAuth(); // ✅ השתמש בזה
    const [questionData, setQuestionData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingExam, setSavingExam] = useState(false);

    const { lessonId } = useParams();
    const navigate = useNavigate();

    // ✅ Base API URL
    const API_URL ='http://localhost:5000';

    // ✅ Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('לא נמצא token. אנא התחבר מחדש.');
                    return;
                }

                if (!lessonId) {
                    setError('לא נמצאה מזהה שיעור.');
                    return;
                }

                const response = await axios.get(
                    `${API_URL}/questions/lesson/${lessonId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.length === 0) {
                    setError('לא נמצאו שאלות לשיעור זה.');
                    return;
                }

                setQuestions(response.data);
                setQuestionData(response.data[0]);
            } catch (err) {
                setError(err.response?.data?.error || 'שגיאה בטעינת השאלות.');
                console.error('Error fetching questions:', err);
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchQuestions();
        }
    }, [lessonId]);

    // ✅ Handle option selection
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // ✅ Save exam
    const saveExam = async (finalScore) => {
        try {
            setSavingExam(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No token found');
                return;
            }

            await axios.post(
                `${API_URL}/exams`,
                { mark: finalScore, lesson: lessonId, user: userId 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate('/profile');
        } catch (error) {
            setError('שגיאה בשמירת הבחינה.');
            console.error('Error saving exam:', error.response?.data || error.message);
        } finally {
            setSavingExam(false);
        }
    };

    // ✅ Handle submit answer
    const handleSubmit = async () => {
        if (!selectedOption) return;

        const isCorrect = selectedOption === questionData.answer;
        const newScore = score + (isCorrect ? 1 : 0);
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < questions.length) {
            setScore(newScore);
            setCurrentQuestionIndex(nextIndex);
            setQuestionData(questions[nextIndex]);
            setSelectedOption('');
        } else {
            await saveExam(newScore);
        }
    };

    // ✅ Loading state
    if (loading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // ✅ Error state
    if (error) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <Card style={{ maxWidth: 500, textAlign: 'center' }}>
                        <CardContent>
                            <ErrorIcon style={{ fontSize: 50, color: '#ff9800', marginBottom: 16 }} />
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/lessons')}
                            >
                                חזור לשיעורים
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        );
    }

    // ✅ Main quiz render
    return (
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" py={2}>
                <Card style={{ width: '100%', maxWidth: 600 }}>
                    <CardHeader
                        title={`שאלה ${currentQuestionIndex + 1} מתוך ${questions.length}`}
                        subheader={`ניקוד: ${score} / ${questions.length}`}
                        style={{ backgroundColor: '#f5f5f5', textAlign: 'center' }}
                    />

                    <Box px={2} pt={2}>
                        <LinearProgress
                            variant="determinate"
                            value={((currentQuestionIndex + 1) / questions.length) * 100}
                        />
                    </Box>

                    <CardContent>
                        {questionData && (
                            <Box>
                                <Typography variant="h6" gutterBottom style={{ marginBottom: 24, fontWeight: 600 }}>
                                    {questionData.question}
                                </Typography>

                                <FormControl component="fieldset" fullWidth>
                                    <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                                        {questionData.optional.map((option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={option}
                                                control={<Radio />}
                                                label={<Typography variant="body1">{option}</Typography>}
                                                style={{
                                                    marginBottom: 12,
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: selectedOption === option ? '#e3f2fd' : 'transparent',
                                                }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        )}
                    </CardContent>

                    <Box p={2} display="flex" gap={1} justifyContent="space-between">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate('/lessons')}
                            disabled={savingExam}
                        >
                            ביטול
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!selectedOption || savingExam}
                        >
                            {savingExam ? <CircularProgress size={24} /> : 
                             currentQuestionIndex === questions.length - 1 ? 'סיום' : 'הבא'}
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Container>
    );
};

export default QuizComponent;