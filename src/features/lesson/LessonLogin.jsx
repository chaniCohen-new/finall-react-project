import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CourseComponent = () => {
  const [lessons, setLessons] = useState([]);
  const { level } = useParams(); // קבלת רמת השיעורים מה-URL

  useEffect(() => {
    console.log("Current level:", level); // לוג לרמת השיעורים
    axios.get(`http://localhost:5000/lessons/level/level ${level}`)
    .then(response => {
        console.log(response.data); // הוסף שורה זו
        setLessons(response.data); // הנח שהנתונים חוזרים כארראי של אובייקטים
      })
      .catch(error => {
        console.error("There was an error fetching the lessons!", error);
      });
  }, [level]); // הוסף את level כתלות

  const navigate = useNavigate();

  const handleLogout = () => {
      navigate(-1); // עובר אחורה בדפדפן
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">מערכת ניהול קורסים</a>
        <button className="btn btn-danger" onClick={handleLogout}>יציאה</button>
      </nav>

      <h2 className="mt-4">נושאים ללימוד</h2>
      <div className="list-group mt-3">
      {lessons.map((lesson, index) => (
                <div className="list-group-item" key={index}>
                    <h4>{lesson.category}</h4>
                    <h5>{lesson.level}</h5>
            <button className="btn btn-primary mr-2">בואו נתחיל</button>
            <button className="btn btn-secondary">בואו נתרגל</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseComponent;