import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import courses from './coursesData';
import './CourseDetail.css';
import Loader from '../components/Loader'; // Import the Loader component
import { apiClient } from '../services/apiClient';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Fetch all courses from the API
    const accessToken = localStorage.getItem('accessToken');

    // Fetch the course details from the API by ID
    fetch(`https://skill-voyage-api.vercel.app/api/course/list`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Attach token here
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
          //setLoading(false);
        }
        //setLoading(false);
      })
      .catch(error => console.error('Error fetching courses list:', error));
  }, [id]);

  if (!course) {
    return <Loader />;
  }

  return (
    <div className="course-detail">
      <h1>{course.name}</h1>
      <img src={course.image} alt={course.title} className="course-detail-image" />
      <div className="course-detail-info">
        <p>Rating: {course.rating} ⭐</p>
        <p>Teacher: {course.teacher}</p>
        <p>{course.description}</p>
        <p>Duration: {course.duration}</p>
      </div>

      {/* Conditionally render the YouTube video if the YouTube link exists */}
      {course.youtubeLink && (
        <div className="course-video">
          <h2>Course Video</h2>
          <iframe
            width="600"
            height="315"
            src={`https://www.youtube.com/embed/${course.youtubeLink.split('v=')[1]}`}
            title={course.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {!course.youtubeLink && (
        <p>No YT video to show</p>
      )}
    </div>
  );
};

export default CourseDetail;
