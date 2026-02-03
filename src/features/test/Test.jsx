import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const QuizComponent = () => {
    const [questionData, setQuestionData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { lessonId } = useParams();
    const navigate = useNavigate();

    // ✅ Fetch questions on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError('');

                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError('Token not found. Please login again.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                const response = await axios.get(
                    `http://localhost:5000/questions/lesson/${lessonId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setQuestions(response.data);
                if (response.data.length > 0) {
                    setQuestionData(response.data[0]);
                }
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError(
                    err.response?.data?.error || 
                    'Failed to load questions. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchQuestions();
        }
    }, [lessonId, navigate]);

    // ✅ Handle option selection
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // ✅ Handle submit answer
    const handleSubmit = async () => {
        if (!selectedOption) return;

        // ✅ Check if answer is correct
        const isCorrect = selectedOption === questionData.answer;
        
        if (isCorrect) {
            setScore(score + 1);
        }

        // ✅ Move to next question or finish quiz
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setQuestionData(questions[currentQuestionIndex + 1]);
            setSelectedOption('');
        } else {
            // ✅ Save exam and navigate to results
            await saveExam(score + (isCorrect ? 1 : 0));
        }
    };

    // ✅ Save exam to database
    const saveExam = async (finalScore) => {
        try {
            const token = localStorage.getItem('token');
            const examData = {
                mark: finalScore,
                lesson: lessonId,
            };

            await axios.post('http://localhost:5000/exams/', examData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // ✅ Pass score to results page
            navigate('/results', { state: { score: finalScore, total: questions.length } });
        } catch (err) {
            console.error('Error saving exam:', err);
            setError('Failed to save exam. Please try again.');
        }
    };

    // ✅ Loading state
    if (loading) {
        return (
            <Container>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="80vh"
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // ✅ Error state
    if (error) {
        return (
            <Container>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="80vh"
                >
                    <Card style={{ maxWidth: 500, textAlign: 'center' }}>
                        <CardContent>
                            <Alert severity="error">{error}</Alert>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        );
    }

    // ✅ No questions state
    if (questions.length === 0) {
        return (
            <Container>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="80vh"
                >
                    <Card style={{ maxWidth: 500, textAlign: 'center' }}>
                        <CardContent>
                            <ErrorIcon style={{ fontSize: 50, color: '#ff9800', marginBottom: 16 }} />
                            <Typography variant="h5" gutterBottom>
                                לא נמצאו שאלות לשיעור זה
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                אנא נסה שוב מאוחר יותר
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: 16 }}
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
                    {/* ✅ Header with progress */}
                    <CardHeader
                        title={`שאלה ${currentQuestionIndex + 1} מתוך ${questions.length}`}
                        subheader={`ניקוד: ${score} / ${questions.length}`}
                        style={{
                            backgroundColor: '#f5f5f5',
                            textAlign: 'center',
                        }}
                    />

                    {/* ✅ Progress bar */}
                    <Box px={2} pt={2}>
                        <LinearProgress
                            variant="determinate"
                            value={((currentQuestionIndex + 1) / questions.length) * 100}
                        />
                    </Box>

                    {/* ✅ Question content */}
                    <CardContent>
                        {questionData && (
                            <Box>
                                {/* Question title */}
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    style={{
                                        marginBottom: 24,
                                        fontWeight: 600,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {questionData.question}
                                </Typography>

                                {/* Radio group for answers */}
                                <FormControl component="fieldset" fullWidth>
                                    <RadioGroup
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                    >
                                        {questionData.optional.map((option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={option}
                                                control={<Radio />}
                                                label={
                                                    <Typography variant="body1">
                                                        {option}
                                                    </Typography>
                                                }
                                                style={{
                                                    marginBottom: 12,
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: selectedOption === option ? '#e3f2fd' : 'transparent',
                                                    transition: 'background-color 0.2s',
                                                }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        )}
                    </CardContent>

                    {/* ✅ Action buttons */}
                    <Box p={2} display="flex" gap={1} justifyContent="space-between">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate('/lessons')}
                        >
                            ביטול
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            style={{ minWidth: 100 }}
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'סיום' : 'הבא'}
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Container>
    );
};

export default QuizComponent;