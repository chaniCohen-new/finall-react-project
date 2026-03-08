import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLogin from '../auth/login';
import AuthRegister from '../auth/register';
import useAuth from '../auth/useAuth';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserManagementComponent from '../userByManager/ManagmentComponent';
import StudyWord from '../word/StudyWord';
import QuizComponent from '../test/test';
import CourseComponent from '../lesson/lessonLogin';
import LevelSelection from '../lesson/LevelSelection';
import MenuAdminComponent from './MenuAdmin';
import MenuComponent from './Menu';
import UserExams from '../user/profile';
import AdminQuestionsPage from '../test/questionService';
import Home from '../home/Home';

// ✅ Layout עם תפריט
const ProtectedLayout = ({ children, admin = false }) => {
  const { isAdmin, isUser } = useAuth();

  // ✅ בדיקת הרשאות
  if (admin && !isAdmin) {
    return <Navigate to="/home" />;
  }

  if (!isAdmin && !isUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {admin ? <MenuAdminComponent /> : <MenuComponent />}
      <div className="content-wrapper">
        {children}
      </div>
    </>
  );
};

function App() {
  const { isAdmin, isUser, isTokenValid } = useAuth();

  // ✅ אם המשתמש כבר מחובר, הפנה אותו לדף הבית
  const ProtectedAuthRoute = ({ element }) => {
    if (isTokenValid) {
      return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />;
    }
    return element;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ✅ Public - אבל מוגן אם יש token */}
          <Route 
            path="/" 
            element={<ProtectedAuthRoute element={<AuthLogin />} />} 
          />
          <Route 
            path="/register" 
            element={<ProtectedAuthRoute element={<AuthRegister />} />} 
          />

          {/* ✅ Admin only */}
          <Route
            path="/admin"
            element={
              <ProtectedLayout admin={true}>
                <Home />
              </ProtectedLayout>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedLayout admin={true}>
                <UserManagementComponent />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedLayout admin={true}>
                <AdminQuestionsPage />
              </ProtectedLayout>
            }
          />

          {/* ✅ Students & Admins */}
          <Route
            path="/home"
            element={
              <ProtectedLayout>
                <Home />
              </ProtectedLayout>
            }
          />
          <Route
            path="/lessons"
            element={
              <ProtectedLayout>
                <LevelSelection />
              </ProtectedLayout>
            }
          />
          <Route
            path="/lessons/level/:level"
            element={
              <ProtectedLayout>
                <CourseComponent />
              </ProtectedLayout>
            }
          />
          <Route
            path="/words/:lessonId"
            element={
              <ProtectedLayout>
                <StudyWord />
              </ProtectedLayout>
            }
          />
          <Route
            path="/quiz/:lessonId"
            element={
              <ProtectedLayout>
                <QuizComponent />
              </ProtectedLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedLayout>
                <UserExams />
              </ProtectedLayout>
            }
          />

          {/* ✅ Catch All */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;