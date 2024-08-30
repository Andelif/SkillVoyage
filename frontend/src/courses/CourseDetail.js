import React from 'react';
import { useParams } from 'react-router-dom';
import courses from './coursesData';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find(course => course.id === parseInt(id));

  if (!course) {
    return <div>Course not found</div>;
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
