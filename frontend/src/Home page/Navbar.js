import React, { useContext ,  useEffect, useState} from 'react';
import './Navbar.css';
import logo_dark from '../assets/logo-dark.png';
import search_icon_dark from '../assets/search-w.png';
import profile_icon from '../assets/profile_icon.jpg';
import logout_icon from '../assets/logout_icon.png';
import dark_profile_icon from '../assets/dark_profile_icon.png';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { accessToken, setAccessToken, setRefreshToken } = useContext(StoreContext);
  const [isAdmin, setIsAdmin] = useState(false);


  // Ensure the component re-renders when the token changes
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken") || "");
    const adminStatus = localStorage.getItem("isAdmin");
    console.log("Status:"+adminStatus);

    
    setIsAdmin(!!adminStatus); // Set true if isAdmin exists
  }, [setAccessToken]);

  const logout = () => {
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
    setAccessToken("");
    setRefreshToken("");
    setIsAdmin(false);
    navigate("/home");
  }

  return (
    <div className='navbar dark'>
      <img src={logo_dark} alt="Logo" className='logo' />
      <ul className='Navcontainer'>
        <li className='navbar_items' onClick={() => navigate('/home')}>Home</li>
        <li className='navbar_items' onClick={() => navigate('/courses')}>Courses</li>
        <li className='navbar_items' onClick={() => navigate('/instructors')}>Instructors</li>
        <li className='navbar_items' onClick={() => navigate('/account')}>Account</li>
        <li className='navbar_items' onClick={() => navigate('/about')}>About us</li>

        {/* Conditionally render the Admin button */}
        {isAdmin && (
          <li className='navbar_items' onClick={() => navigate('/admin')}>Admin Panel</li>
        )}

      </ul>
      {!accessToken ? (
        <button className='sign-button' onClick={() => setShowLogin(true)}>Sign In</button>
      ) : (
        <div className='navbar-profile'>
          <img className='profile_icon' src={dark_profile_icon} alt='Profile' />
          <ul className='nav-profile-dropdown'>
            <li onClick={logout}><img id='logout_icon' src={logout_icon} alt='Logout' /><p>Logout</p></li>
          </ul>
        </div>
      )}
      <div className='search-box'>
        <input type="text" placeholder='Search' />
        <img src={search_icon_dark} alt="Search" />
      </div>
    </div>
  );
}

export default Navbar;
