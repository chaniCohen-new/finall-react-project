import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLogin from '../auth/login'
import AuthRegister from '../auth/register'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserManagementComponent from '../userByManager/ManagmentComponent';
import StudyWord from '../word/StudyWord';
import QuizComponent from '../test/test';
import CourseComponent from '../lesson/lessonLogin';
import MenuComponent from './Menu';
import LevelSelection from '../lesson/LevelSelection';
import MenuAdminComponent from './MenuAdmin';
import UserExams from '../user/profile';


function App() {
  return (
    <>
      <Router>
        <div className="App">
          <MenuComponent />
          <Routes>
            <Route path="/" element={<AuthLogin />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/words/:lessonId" element={<StudyWord />} />
            <Route path="/lessons/level/:level" element={<CourseComponent />} />
            <Route path="/lessons" element={<LevelSelection />} />
            <Route path="/users" element={<UserManagementComponent />} /> {/* ניתוב לעמוד ניהול משתמשים */}
            <Route path="/quiz/:lessonId" element={<QuizComponent />} /> {/* הנתיב המיועד למבחן */}
            <Route path="/profile" element={<UserExams />} />
            </Routes>
        </div>
      </Router>

    </>
  );

}

export default App
