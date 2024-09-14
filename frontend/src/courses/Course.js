import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Course.css';
import Loader from '../components/Loader'

const Course = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    // Fetch courses from API
    fetch('https://skill-voyage-api.vercel.app/api/course/list')
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          console.error('Unexpected data format:', data);
          
        }
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        
        setLoading(false); // Stop loading on error
      });
  }, []);

  
  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  const handleCourseClick = (id) => {
    navigate(`/courses/${id}`);
  };

  const handleRatingChange = (e) => {
    setSelectedRating(Number(e.target.value));
  };

  const filteredCourses = courses
    .filter(course => Number(course.rating) >= selectedRating)
    .sort((a, b) => b.rating - a.rating); // Sort by rating in descending order


  


  return (
    <div className="course-list">
      <div className="header-container">
        <h1>Courses</h1>
        <div className="filter-container">
          <label htmlFor="ratingFilter">Filter by Rating:</label>
          <select id="ratingFilter" onChange={handleRatingChange} value={selectedRating}>
            <option value="0">All Ratings</option>
            <option value="4">4 Stars & Up</option>
            <option value="4.5">4.5 Stars & Up</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>

      <ul>
        {filteredCourses.map((course) => (
          <li key={course._id} className="course-item" onClick={() => handleCourseClick(course._id)}>
            <img src={course.image} alt={course.title} className="course-image" />
            <div className="course-info">
              <h2>{course.title}</h2>
              <p>Rating: {course.rating} ⭐</p>
              <p>Teacher: {course.teacher}</p>
              <p>{course.description}</p>
              <p>Duration: {course.duration} hours</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Course;
