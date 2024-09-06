import React from 'react';
import './HomeContent.css';
import './Navbar';
import Homebg from '../assets/bg1.png';
import Homebg_dark from '../assets/Homebg_dark.png';

const HomeContent = ({theme,setTheme}) => {
        const toggle_mode = () => {
          theme === 'light' ? setTheme('dark') : setTheme('light');
        }
      
  return (
    <div className='Homepage'>
        <img src={theme === 'light' ? Homebg_dark: Homebg_dark} className='Homebg'/>
        <button className="overlay-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Get Started
      </button>
    </div>
  )
}

export default HomeContent;