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


function App() {
  return (
    <>
      {/* <UserManagementComponent /> */}

      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<AuthLogin />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/" element={<AuthLogin />} /> {/* ניתוב ברירת מחדל לעמוד הקורסים */}
            <Route path="/users" element={<UserManagementComponent />} /> {/* ניתוב לעמוד ניהול משתמשים */}
          </Routes>
        </div>
      </Router>

    </>
  );

}

export default App
