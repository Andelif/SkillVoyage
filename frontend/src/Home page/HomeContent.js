// import React from 'react';
// import './HomeContent.css';
// import './Navbar';
// import Homebg from '../assets/Homebg_dark.png';

// const HomeContent = () => {
//   return (
//     <div className='Homepage'>
//       <img src={Homebg} className='Homebg' alt="Background" />
//     </div>
//   );
// }

// export default HomeContent;
import React from 'react';
import './HomeContent.css';
import './Navbar';

const HomeContent = () => {
  return (
    <div className='Homepage'>
      <div className="banner-container">
        <div className="text-container">
          <div className="text-content">
            <h1>
              Taking <span className="highlight highlight-student">student</span> experience to the <span className="highlight highlight-next">next level</span>
            </h1>
            <p className="subtext">Transform your immigrant career journey into a guided, skill-building adventure</p>
            <button className="progress-button">Check your progress</button>
          </div>
          <div className="vertical-line"></div> {/* Moved to the middle */}
        </div>
        <div className="graphic-container">
          <div className="arches">
            <div className="arch arch1"></div>
            <div className="arch arch2"></div>
            <div className="arch arch3"></div>
          </div>
          <div className="dots">
            {/* Randomly placed dots */}
            <div className="dot dot1"></div>
            <div className="dot dot2"></div>
            <div className="dot dot3"></div>
            <div className="dot dot4"></div>
            <div className="dot dot5"></div>
            <div className="dot dot6"></div>
            {/* Add more dots */}
            <div className="dot dot7"></div>
            <div className="dot dot8"></div>
            <div className="dot dot9"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
