import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Container,
    Box,
    Typography,
} from '@mui/material';

const QuizComponent = () => {
    const [questionData, setQuestionData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);

    const { lessonId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/questions/lesson/${lessonId}`);
                setQuestions(response.data);
                setQuestionData(response.data.length > 0 ? response.data[0] : null); // הגדרת השאלה הראשונה אם קיימות שאלות
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [lessonId]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        if (selectedOption === questionData.correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setQuestionData(questions[nextIndex]);
            setSelectedOption('');
        } else {
            await saveExam();
            navigate('/results');
        }
    };

    const saveExam = async () => {
        const examData = {
            mark: score,
            lesson: lessonId,
        };

        try {
            await axios.post('http://localhost:5000/exams/', examData);
            console.log('Exam saved successfully!');
        } catch (error) {
            console.error('Error saving exam:', error);
        }
    };

    return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                {questions.length === 0 ? (
                    <Card style={{ maxWidth: 400, textAlign: 'center' }}>
                        <CardContent>
                            <Typography variant="h5">לא נמצא אף בוחן לשיעור זה.</Typography>
                            <Typography variant="body1">אנא נסה שוב מאוחר יותר.</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    questionData && (
                        <Card style={{ maxWidth: 400 }}>
                            <CardContent>
                                <Typography variant="h5">{questionData.question}</Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                    >
                                        {questionData.optional.map((option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={option}
                                                control={<Radio />}
                                                label={option}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    style={{ marginTop: '20px' }} 
                                    onClick={handleSubmit}
                                    disabled={!selectedOption}
                                >
                                    הבא
                                </Button>
                            </CardContent>
                        </Card>
                    )
                )}
            </Box>
        </Container>
    );
};

export default QuizComponent;