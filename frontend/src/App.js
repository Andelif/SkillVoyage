import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Home page/Navbar';
import HomeContent from './Home page/HomeContent';
import Course from './courses/Course';
import CourseDetail from './courses/CourseDetail';
import Vid from './courses/vid'; 
import Instructor from './instructors/Instructor';
import InstructorDetail from './instructors/InstructorDetail';
import LoginPopup from './LoginPopop/LoginPopup';
import NotFound from './components/NotFound';
import LoginRequired from './LoginRequired/LoginRequired';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './adminPanel/App';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { setupInterceptors } from './services/apiClient';
import AboutUs from './about us/aboutUs';
import Account from './Account/Account';
import Quiz from './Home page/Quiz'; 
import Scoreboard from './Home page/Scoreboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [showLogin, setShowLogin] = useState(false);
  const curr_theme = localStorage.getItem('curr_theme');
  const [theme, setTheme] = useState(curr_theme ? curr_theme : 'light');

  useEffect(() => {
    localStorage.setItem('curr_theme', theme);
  }, [theme]);

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  // Check if the current route is a course detail, video, instructor detail, or quiz page
  const isCourseDetail = location.pathname.startsWith('/courses/');
  const isInstructorDetail = location.pathname.startsWith('/instructors/');
  const isVideoPage = location.pathname === '/courses/vid';
  const isQuizPage = location.pathname === '/quiz'; // Check for Quiz page

  return (
    <div>
      <ToastContainer />
      <div className={`container ${theme}`}>
        
        {showLogin && <LoginPopup setShowLogin={setShowLogin} theme={theme} />}

        {/* Conditionally show Navbar unless on a detail, video, or quiz page */}
        {!isCourseDetail && !isInstructorDetail && !isVideoPage && !isQuizPage && (
          <Navbar theme={theme} setTheme={setTheme} setShowLogin={setShowLogin} />
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomeContent theme={theme} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login-required" element={<LoginRequired />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          


          {/* Protected Routes */}
          <Route path="/courses" element={<ProtectedRoute element={Course} />} />
          <Route path="/courses/:id" element={<ProtectedRoute element={CourseDetail} />} />
          <Route path="/courses/vid" element={<ProtectedRoute element={Vid} />} />
          <Route path="/instructors" element={<ProtectedRoute element={Instructor} />} />
          <Route path="/instructors/:id" element={<ProtectedRoute element={InstructorDetail} />} />
          <Route path="/account" element={<ProtectedRoute element={Account} />} />

          {/* Add Quiz Route */}
          <Route path="/quiz" element={<ProtectedRoute element={Quiz} />} /> {/* Wrapped in ProtectedRoute */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
