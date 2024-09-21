import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './HomeContent.css';

const HomeContent = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to handle navigation to the Quiz page
  const handleCheckProgress = () => {
    navigate('/quiz');
  };

  return (
    <div className='Homepage'>
      <div className='banner-container'>
        <div className='text-container'>
          <div className='text-content'>
            <h1>
              Taking <span className="highlight-student">student</span> experience to the <span className="highlight-next">next level</span>
            </h1>
            <p className='subtext'>
              Transform your immigrant career journey into a guided, skill-building adventure
            </p>
            <button className='progress-button' onClick={handleCheckProgress}>
              Check your progress
            </button> {/* Added onClick handler to navigate to the Quiz page */}
          </div>
          <div className='vertical-line'></div>
        </div>

        <div className='graphic-container'>
          <div className='arches'>
            <div className='arch arch1'></div>
            <div className='arch arch2'></div>
            <div className='arch arch3'></div>
          </div>
          <div className='dots'>
            <div className='dot dot1'></div>
            <div className='dot dot2'></div>
            <div className='dot dot3'></div>
            <div className='dot dot4'></div>
            <div className='dot dot5'></div>
            <div className='dot dot6'></div>
            <div className='dot dot7'></div>
            <div className='dot dot8'></div>
            <div className='dot dot9'></div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <p>Credits: Created by Dash</p>
        <p>Connect with us: 
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>, 
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>, 
          <a href="mailto:contact@company.com"> Email</a>
        </p>
      </div>
    </div>
  );
};

export default HomeContent;
