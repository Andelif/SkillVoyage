import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courses from './coursesData';
import './Course.css';

const Course = () => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0);

  const handleCourseClick = (id) => {
    navigate(`/courses/${id}`);
  };

  const handleRatingChange = (e) => {
    setSelectedRating(Number(e.target.value));
  };

  const filteredCourses = courses.filter(course => course.rating >= selectedRating);

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
          <li key={course.id} className="course-item" onClick={() => handleCourseClick(course.id)}>
            <img src={course.image} alt={course.title} className="course-image" />
            <div className="course-info">
              <h2>{course.title}</h2>
              <p>Rating: {course.rating} ⭐</p>
              <p>Teacher: {course.teacher}</p>
              <p>{course.description}</p>
              <p>Duration: {course.duration}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Course;
