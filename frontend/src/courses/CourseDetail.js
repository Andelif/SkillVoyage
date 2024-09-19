import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import './CourseDetail.css';
import Loader from '../components/Loader'; 

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Added navigate for back button functionality
  const [course, setCourse] = useState(null);
  const [showVideo, setShowVideo] = useState(false); // State to control video visibility

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    fetch(`https://skill-voyage-api.vercel.app/api/course/list`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data) {
          const foundCourse = data.data.find(course => course._id === id);
          setCourse(foundCourse);
        } else {
          console.error('Unexpected data format or no courses available:', data);
        }
      })
      .catch(error => console.error('Error fetching courses list:', error));
  }, [id]);

  const handleBack = () => {
    setShowVideo(false); // Hide video if in fullscreen mode
    navigate('/courses'); // Navigate back to course list
  };

  if (!course) {
    return <Loader />;
  }

  if (showVideo && course.youtubeLink) {
    // Fullscreen video mode
    return (
      <>
        <div className="btn">
          <button className="back-button" onClick={handleBack}>←</button>
        </div>
        <div className="fullscreen-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${course.youtubeLink.split('v=')[1]}`}
            title={course.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </>
    );
  }
  
  return (
    <div className="course-detail">
      {/* Back button */}
      <button className="back-button" onClick={handleBack}>←</button>

      <h1>{course.name}</h1>
      <img src={course.image} alt={course.title} className="course-detail-image" />
      <div className="course-detail-info">
        <p>Rating: {course.rating} ⭐</p>
        <p>Teacher: {course.teacher}</p>
        <p>{course.description}</p>
        <p>Duration: {course.duration}</p>
      </div>

      {/* Conditionally render the "Play Video" button */}
      {course.youtubeLink && (
        <div className="course-video">
          <button className="play-video-button" onClick={() => setShowVideo(true)}>
            <i className="play-icon">▶</i> Play Video
          </button>
        </div>
      )}
      {!course.youtubeLink && <p>No YouTube video to show</p>}
    </div>
  );
};

export default CourseDetail;
