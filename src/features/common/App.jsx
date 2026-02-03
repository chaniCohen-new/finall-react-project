import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLogin from '../auth/Login';
import AuthRegister from '../auth/Register';
import useAuth from '../auth/useAuth';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserManagementComponent from '../userByManager/ManagmentComponent';
import StudyWord from '../word/StudyWord';
import QuizComponent from '../test/test';
import CourseComponent from '../lesson/lessonLogin';
import LevelSelection from '../lesson/LevelSelection';
import MenuAdminComponent from './MenuAdmin';
import MenuComponent from './Menu'; // ✅ הוסף
import UserExams from '../user/profile';
import AdminQuestionsPage from '../test/questionService';
import Home from '../home/Home';

// ✅ Layout עם תפריט
const ProtectedLayout = ({ children, admin = false }) => {
  const { isAdmin, isUser } = useAuth();

  if (admin && !isAdmin) {
    return <Navigate to="/lessons" />;
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

// ✅ Protected Route
const ProtectedRoute = ({ children, admin = false }) => {
  const { isAdmin, isUser } = useAuth();

  if (admin && !isAdmin) {
    return <Navigate to="/lessons" />;
  }

  if (!isAdmin && !isUser) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { isAdmin } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ✅ Public */}
          <Route path="/" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;