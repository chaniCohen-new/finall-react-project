import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLogin from '../auth/login'
import AuthRegister from '../auth/register'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserManagementComponent from '../user/ManagmentComponent';
import StudyWord from '../word/StudyWord';
import QuizComponent from '../test/test';
import CourseComponent from '../lesson/lessonLogin';
import MenuComponent from './Menu';
import LevelSelection from '../lesson/LevelSelection';
import MenuAdminComponent from './MenuAdmin';


function App() {
  return (
    <>
      <Router>
        <div className="App">
          <MenuComponent />
          <Routes>
            <Route path="/" element={<UserManagementComponent />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/words/:category" element={<StudyWord />} />
            <Route path="/lessons/level/:level" element={<CourseComponent />} />
            <Route path="/lessons" element={<LevelSelection />} />
            <Route path="/users" element={<UserManagementComponent />} /> {/* ניתוב לעמוד ניהול משתמשים */}
            <Route path="/quiz" element={<QuizComponent />} />
          </Routes>
        </div>
      </Router>

    </>
  );

}

export default App
