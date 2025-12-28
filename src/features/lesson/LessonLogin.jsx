import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CourseComponent = () => {
  const [lessons, setLessons] = useState([]);
  const { level } = useParams(); // קבלת רמת השיעורים מה-URL
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current level:", level); // לוג לרמת השיעורים
    axios.get(`http://localhost:5000/lessons/level/level ${level}`)
      .then(response => {
        console.log(response.data); // לוג כדי לבדוק את הנתונים
        setLessons(response.data); // הנח שהנתונים חוזרים כארראי של אובייקטים
      })
      .catch(error => {
        console.error("There was an error fetching the lessons!", error);
      });
  }, [level]); // הוסף את level כתלות

  const handleStartClick = (lessonId) => {
    // נווט לדף השיעור עם ה-ID של השיעור
    navigate(`/words/${lessonId}`); 
  };

  const handlePracticeClick = (lessonId) => {
    // נווט לדף המבחן עם ID של השיעור
    navigate(`/quiz/${lessonId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mt-4">נושאים ללימוד</h2>
      <div className="list-group mt-3">
        {lessons.map((lesson) => (
          <div className="list-group-item" key={lesson._id}>
            {/* השתמש ב-ID הייחודי של השיעור */}
            <h4>{lesson.category}</h4>
            <h5>{lesson.level}</h5>
            <button 
              className="btn btn-primary mr-2" 
              onClick={() => handleStartClick(lesson._id)} // העבר את ה-ID של השיעור
            >
              בואו נתחיל
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => handlePracticeClick(lesson._id)} // העבר את ה-ID של השיעור
            >
              בואו נתרגל
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseComponent;