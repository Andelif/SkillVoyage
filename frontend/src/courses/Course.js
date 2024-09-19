import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Course.css';
import Loader from '../components/Loader'
import { apiClient } from '../services/apiClient';


const Course = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true); 

  
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await apiClient.post('/user/refresh-token', { refreshToken });
        const  newAccessToken  = refreshResponse.data.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          return newAccessToken;
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/home'); // Redirect to login page
      }
    }
    navigate('/home'); // Redirect to login page if no refresh token
  };

  const fetchCourses = async () => {
    let accessToken = localStorage.getItem('accessToken');

    const fetchWithToken = async (token) => {
      try {
        const response = await apiClient.get('/course/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = response.data;

        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        if (error.response?.status === 401) {
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            await fetchWithToken(newAccessToken); // Retry fetching with the new token
          }
        }
      } finally {
        setLoading(false); // Stop loading after data is fetched or error is handled
      }
    };

    if (accessToken) {
      await fetchWithToken(accessToken);
    } else {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        await fetchWithToken(newAccessToken); // Retry fetching with the new token
      }
    }
  };

  useEffect(() => {
    fetchCourses();
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
              <h2>{course.name}</h2>
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
