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
import AdminPanel from './adminPanel/App'; // Your main admin panel component
import "./App.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient, setupInterceptors } from './services/apiClient';


const App = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const curr_theme = localStorage.getItem('curr_theme');
  const [theme, setTheme] = useState(curr_theme ? curr_theme : 'light');
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    localStorage.setItem('curr_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Function to check if access token is missing and refresh it
    const refreshAccessToken = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        try {
          // Attempt to refresh the token using the refresh token (stored in cookies)
          const response = await axios.post('https://skill-voyage-api.vercel.app/api/user/refresh-token', {}, { withCredentials: true });
          console.log(response.data);
          const newAccessToken = response.data.accessToken;

          // Store the new access token in localStorage
          localStorage.setItem('accessToken', newAccessToken);
        } catch (error) {
          console.error('Failed to refresh access tokenhgfhgf:', error);
          setIsAdmin(false)
          
          // Redirect to login if refresh failed
          navigate('/home');
          console.log(isAdmin);
        }
      }
    };

    refreshAccessToken(); // Run token refresh check on page load

    // Set up Axios interceptors for handling token refresh during API calls
    setupInterceptors(navigate);
  }, [navigate]);
  

  return (
    <div className={`container ${theme}`}>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} theme={theme} />}
      <Navbar theme={theme} setTheme={setTheme} setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<HomeContent theme={theme} />} />
        <Route path="/login-required" element={<LoginRequired />} />
        <Route path="/admin/*" element={<AdminPanel />} />

        <Route path="*" element={<NotFound />} /> 


        {/* Protected Routes */}
        <Route path="/courses" element={<ProtectedRoute element={Course} />} />
        <Route path="/courses/:id" element={<ProtectedRoute element={CourseDetail} />} />
        {/*<Route path="/instructors" element={<ProtectedRoute element={Instructors} />} />*/}
        
        
      </Routes>
    </div>
  );
};

export default App;
