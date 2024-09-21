import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import logo_dark from '../assets/logo-dark.png';
import profile_icon from '../assets/profile_icon.jpg';
import logout_icon from '../assets/logout_icon.png';
import dark_profile_icon from '../assets/dark_profile_icon.png';
import { StoreContext } from '../context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../services/apiClient'; // Import the apiClient


const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { accessToken, setAccessToken, setRefreshToken } = useContext(StoreContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessStatus = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessStatus) {
        
        if (refreshToken) {
          try {
            const response = await apiClient.post('/user/refresh-token', { refreshToken });
            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            setAccessToken(newAccessToken);
          } catch (error) {
            
            console.error('Failed to refresh access token:', error);
            logout();
            return;
          }
        } else {
          
          logout();
          return;
        }
      } else {
        
        setAccessToken(accessStatus);
      }

      
      const adminStatus = localStorage.getItem("isAdmin");
      setIsAdmin(!!adminStatus);

      
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.image) {
          setUserProfileImage(`data:image/jpeg;base64,${parsedUser.image}`);
        } else {
          setUserProfileImage('');
        }
      } else {
        setUserProfileImage('');
      }
    };

    checkAuthStatus();
  }, [setAccessToken]);

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    setAccessToken("");
    setRefreshToken("");
    navigate("/home");
  };

  const goHome = () => {
    navigate("/home");
  };

  // Function to check if the current path is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className='navbar dark'>
      <img src={logo_dark} alt="Logo" className='logo' onClick={goHome} />
      <ul className='Navcontainer'>
        <li className={`navbar_items ${isActive('/home')}`} onClick={() => navigate('/home')}>Home</li>
        <li className={`navbar_items ${isActive('/courses')}`} onClick={() => navigate('/courses')}>Courses</li>
        <li className={`navbar_items ${isActive('/instructors')}`} onClick={() => navigate('/instructors')}>Instructors</li>
        <li className={`navbar_items ${isActive('/account')}`} onClick={() => navigate('/account')}>Account</li>
        <li className={`navbar_items ${isActive('/about')}`} onClick={() => navigate('/about')}>About us</li>

        {isAdmin && (
          <li className={`navbar_items ${isActive('/admin')}`} onClick={() => navigate('/admin')}>Admin Panel</li>
        )}
      </ul>

      {!accessToken ? (
        <button className='sign-button' onClick={() => setShowLogin(true)}>Sign In</button>
      ) : (
        <div className='navbar-profile'>
          <img
            className='profile_icon'
            src={userProfileImage || dark_profile_icon}
            alt='Profile'
          />
          <ul className='nav-profile-dropdown'>
            <li onClick={logout}><img id='logout_icon' src={logout_icon} alt='Logout' /><p>Logout</p></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
