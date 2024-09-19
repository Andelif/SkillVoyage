import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Navbar from './Home page/Navbar';
import HomeContent from './Home page/HomeContent';
import Course from './courses/Course';
import CourseDetail from './courses/CourseDetail';
import Instructor from './instructors/Instructor';
import InstructorDetail from './instructors/InstructorDetail';
import LoginPopup from './LoginPopop/LoginPopup';
import NotFound from './components/NotFound';
import LoginRequired from './LoginRequired/LoginRequired';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import AdminPanel from './adminPanel/App'; // Your main admin panel component
import "./App.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient, setupInterceptors } from './services/apiClient';
import AboutUs from './about us/aboutUs'; 
import Account from './Account/Account';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const curr_theme = localStorage.getItem('curr_theme');
  const [theme, setTheme] = useState(curr_theme ? curr_theme : 'light');
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    localStorage.setItem('curr_theme', theme);
  }, [theme]);

  // Call setupInterceptors once when the app is initialized
  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]); // Ensures interceptors are initialized with navigate
  

  return (
    <div>
      <ToastContainer/>
      <div className={`container ${theme}`}>
      
      {showLogin && <LoginPopup setShowLogin={setShowLogin} theme={theme} />}
      <Navbar theme={theme} setTheme={setTheme} setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<HomeContent theme={theme} />} />
        <Route path="/about" element={<AboutUs />} /> 
        
        <Route path="/login-required" element={<LoginRequired />} />
        <Route path="/admin/*" element={<AdminPanel />} />

        <Route path="*" element={<NotFound />} /> 


        {/* Protected Routes */}
        <Route path="/courses" element={<ProtectedRoute element={Course} />} />
        <Route path="/courses/:id" element={<ProtectedRoute element={CourseDetail} />} />
        <Route path="/instructors" element={<ProtectedRoute element={Instructor} />} />
        <Route path="/instructors/:id" element={<ProtectedRoute element={InstructorDetail} />} />
        <Route path="/account" element={<ProtectedRoute element={Account} />} />
      
      </Routes>
    </div>
    </div>

    
  );
};

export default App;
