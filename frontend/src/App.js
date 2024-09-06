import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Navbar from './Home page/Navbar';
import HomeContent from './Home page/HomeContent';
import Course from './courses/Course';
import CourseDetail from './courses/CourseDetail';
import LoginPopup from './LoginPopop/LoginPopup';
import NotFound from './components/NotFound';
import LoginRequired from './LoginRequired/LoginRequired';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import "./App.css";

const App = () => {
  
  const [showLogin, setShowLogin] = useState(false);
  const curr_theme = localStorage.getItem('curr_theme');
  const [theme, setTheme] = useState(curr_theme ? curr_theme : 'light');

  useEffect(() => {
    localStorage.setItem('curr_theme', theme);
  }, [theme]);

  

  return (
    <div className={`container ${theme}`}>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} theme={theme} />}
      <Navbar theme={theme} setTheme={setTheme} setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<HomeContent theme={theme} />} />
        <Route path="/login-required" element={<LoginRequired />} />
        <Route path="*" element={<NotFound />} /> {/* Fallback route */}


        {/* Protected Routes */}
        <Route path="/courses" element={<ProtectedRoute element={Course} />} />
        <Route path="/courses/:id" element={<ProtectedRoute element={CourseDetail} />} />
        {/*<Route path="/instructors" element={<ProtectedRoute element={Instructors} />} />*/}
        
        
      </Routes>
    </div>
  );
};

export default App;
