import React from 'react';
import './HomeContent.css';
import './Navbar';
import Homebg_dark from '../assets/Homebg_dark.png';

const HomeContent = () => {
  return (
    <div className='Homepage'>
      <img src={Homebg_dark} className='Homebg' alt="Background" />
      <button className="overlay-button">
        Get Started
      </button>
    </div>
  );
}

export default HomeContent;
