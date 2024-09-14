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
import AdminRoute from './adminPanel/AdminRoute'; // Adjust the path as needed
import AdminPanel from './adminPanel/App'; // Your main admin panel component
import "./App.css";
import ListProduct from './adminPanel/pages/ListProduct/ListProduct';
import AddProduct from './adminPanel/pages/AddProduct/AddProduct'
import { useNavigate } from 'react-router-dom';
import { setupInterceptors } from './services/apiClient';

const App = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const curr_theme = localStorage.getItem('curr_theme');
  const [theme, setTheme] = useState(curr_theme ? curr_theme : 'light');

  useEffect(() => {
    localStorage.setItem('curr_theme', theme);
  }, [theme]);

  useEffect(() => {
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
