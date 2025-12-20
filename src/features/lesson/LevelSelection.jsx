import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // ייבוא useNavigate

const Container = styled.div`
    background-color: #e0f7fa;
    font-family: Arial, sans-serif;
    padding: 20px;
    text-align: center;
`;

const Title = styled.h1`
    color: #00796b;
    margin-bottom: 20px;
`;

const Levels = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
`;

const LevelCard = styled.div`
    background-color: #ffffff;
    border: 2px solid #00838f;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    flex: 1;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;

    &:hover {
        transform: translateY(-5px);
        background-color: #b2ebf2;
    }

    h2 {
        margin: 0;
    }
`;

const StartButton = styled.button`
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #0097a7;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #00796b;
    }
`;

const LessonList = styled.ul`
    list-style: none;
    padding: 0;
`;

const LessonItem = styled.li`
    background-color: #b2ebf2;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
`;

const LevelSelection = () => {
    const [lessons, setLessons] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const navigate = useNavigate(); 
    
    const handleStart = async () => {
        if (selectedLevel) {
            try {
                // עדכון ה-URL כך שיתאים לנתיב החדש
                const response = await axios.get(`http://localhost:5000/lessons/level/${selectedLevel}`);
                setLessons(response.data);
                console.log(response.data); // הוסף שורה זו
                navigate(`/lessons/level/${selectedLevel}`); 
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }
    };

    return (
        <Container>
            <Title>בחר רמה לשיעורים</Title>
            <Levels>
                <LevelCard onClick={() => setSelectedLevel(1)}>
                    <h2>רמה 1</h2>
                    <p>בחר רמה זו אם אתה מתחיל.</p>
                </LevelCard>
                <LevelCard onClick={() => setSelectedLevel(2)}>
                    <h2>רמה 2</h2>
                    <p>בחר רמה זו אם יש לך ניסיון בסיסי.</p>
                </LevelCard>
                <LevelCard onClick={() => setSelectedLevel(3)}>
                    <h2>רמה 3</h2>
                    <p>בחר רמה זו אם אתה מתקדם.</p>
                </LevelCard>
            </Levels>
            <StartButton onClick={handleStart}>בואו נתחיל</StartButton>
            {lessons.length > 0 && (
                <div>
                    <h2>שיעורים ברמה {selectedLevel}</h2>
                    <LessonList>
                        {lessons.map(lesson => (
                            <LessonItem key={lesson._id}>{lesson.title}</LessonItem>
                        ))}
                    </LessonList>
                </div>
            )}
        </Container>
    );
};

export default LevelSelection;