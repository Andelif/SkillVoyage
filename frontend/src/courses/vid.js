import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './vid.css';

const Vid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { youtubeLink, courseName } = location.state || {}; // Get data passed from CourseDetail.js

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (!youtubeLink) {
    return <p>No video available</p>;
  }

  return (
    <>
      <button className="back-button" onClick={handleBack}>←</button>
      <div className="fullscreen-video">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeLink.split('v=')[1]}`}
          title={courseName}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};

export default Vid;
