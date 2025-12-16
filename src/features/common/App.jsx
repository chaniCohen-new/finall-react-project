import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLogin from '../auth/login'
import AuthRegister from '../auth/register'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserManagementComponent from '../user/ManagmentComponent';
// import CourseComponent from '../lesson/LessonLogin';
import StudyWord from '../word/StudyWord';
import QuizCard from '../test/test';
import Home from './home';
import CourseComponent from '../lesson/lessonLogin';


function App() {
  return (
    <>
      {/* <UserManagementComponent /> */}

      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<AuthLogin />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/" element={<CourseComponent />} /> {/* ניתוב ברירת מחדל לעמוד הקורסים */}
            <Route path="/users" element={<CourseComponent />} /> {/* ניתוב לעמוד ניהול משתמשים */}
          </Routes>
        </div>
      </Router>

    </>
  );

}

export default App
