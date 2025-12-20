import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
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
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const QuizComponent = () => {
    const [questionData, setQuestionData] = useState(null);

    // פונקציה לקבלת השאלה מהשרת
    const fetchQuestion = async () => {
        try {
            const response = await axios.get('http://localhost:5000/questions/lesson/694137ccac16495d2693ad29'); // ודא שזה ה-URL הנכון
            setQuestionData(response.data);
            console.log(questionData)
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Box display="flex" flexGrow={1}>
                        <IconButton color="inherit">
                            <HomeIcon />
                        </IconButton>
                        <Button color="inherit">בית</Button>

                        <IconButton color="inherit">
                            <SchoolIcon />
                        </IconButton>
                        <Button color="inherit">קורסים</Button>

                        <IconButton color="inherit">
                            <PersonIcon />
                        </IconButton>
                        <Button color="inherit">איזור אישי</Button>
                    </Box>
                    
                    {/* כפתור היציאה בצד ימין */}
                    <Box marginLeft="auto">
                        <IconButton color="inherit">
                            <ExitToAppIcon />
                        </IconButton>
                        <Button color="inherit">יציאה</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                {questionData && (
                    <Card style={{ maxWidth: 400 }}>
                        <CardContent>
                            <Typography variant="h5">{questionData.question}</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup>
                                    {questionData.optional && questionData.optional.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={option}
                                            control={<Radio />}
                                            label={option}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
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