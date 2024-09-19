import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetail.css';
import Loader from '../components/Loader'; 

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

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

  if (!course) {
    return <Loader />;
  }

  const handlePlayVideo = () => {
    navigate('/courses/vid', {
      state: { youtubeLink: course.youtubeLink, courseName: course.name }, // Pass video data
    });
  };

  return (
    <div className="course-detail">
      <button className="back-button" onClick={() => navigate('/courses')}>←</button>

      <h1>{course.name}</h1>
      <img src={course.image} alt={course.title} className="course-detail-image" />
      <div className="course-detail-info">
        <p>Rating: {course.rating} ⭐</p>
        <p>Teacher: {course.teacher}</p>
        <p>{course.description}</p>
        <p>Duration: {course.duration}</p>
      </div>

      {course.youtubeLink && (
        <div className="course-video">
          <button className="play-video-button" onClick={handlePlayVideo}>
            <i className="play-icon">▶</i> Play Video
          </button>
        </div>
      )}
      {!course.youtubeLink && <p>No YouTube video to show</p>}
    </div>
  );
};

export default CourseDetail;
