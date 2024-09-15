import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import courses from './coursesData';
import './CourseDetail.css';
import Loader from '../components/Loader'; // Import the Loader component
import { apiClient } from '../../../services/apiClient';

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
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(error => console.error('Error fetching courses list:', error));
  }, [id]);

  if (!course) {
    return <Loader />;
  }

  return (
    <div className="course-detail">
      <h1>{course.title}</h1>
      <img src={course.image} alt={course.title} className="course-detail-image" />
      <div className="course-detail-info">
        <p>Rating: {course.rating} ⭐</p>
        <p>Teacher: {course.teacher}</p>
        <p>{course.description}</p>
        <p>Duration: {course.duration}</p>
      </div>
    </div>
  );
};

export default CourseDetail;
