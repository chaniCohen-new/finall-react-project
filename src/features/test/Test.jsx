import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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

const QuizComponent = () => { // קבלת lessonId כפרמטר
    const [questionData, setQuestionData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);

    const { lessonId } = useParams(); // קבלת ה-lessonId מה-URL
    console.log("lessonId:", lessonId); // לוג לוודא שה-lessonId מוגדר

    // פונקציה לקבלת השאלות מהשרת
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/questions/lesson/${lessonId}`);
                setQuestions(response.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [lessonId]);


    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = () => {
        console.log("תשובת המשתמש:", selectedOption);
        // מעבר לשאלה הבאה
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setQuestionData(questions[currentQuestionIndex + 1]);
            setSelectedOption(''); // ריקון התשובה הנבחרת
        } else {
            console.log("זה היה השאלה האחרונה בשיעור.");
            // כאן תוכל להוסיף לוגיקה לניתוב או לסיום הבוחן
        }
    };

    // useEffect(() => {
    //     if (lessonId) { // בדוק אם lessonId קיים
    //         fetchQuestions();
    //     }
    // }, [lessonId]);

    return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                {questionData && (
                    <Card style={{ maxWidth: 400 }}>
                        <CardContent>
                            <Typography variant="h5">{questionData.question}</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                >
                                    {questionData.optional.slice(0, 3).map((option, index) => (
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
                                disabled={!selectedOption} // Disable button if no option is selected
                            >
                                הבא
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Container>
    );
};

export default QuizComponent;