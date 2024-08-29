import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Home page/Navbar';
import HomeContent from './Home page/HomeContent';
import Course from './courses/Course';
import CourseDetail from './courses/CourseDetail';
import LoginPopup from './LoginPopop/LoginPopup';
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
        <Route path="/home" element={<HomeContent theme={theme} />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        
      </Routes>
    </div>
  );
};

export default App;
