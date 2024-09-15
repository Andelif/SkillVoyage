import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Instructor.css';
import Loader from '../components/Loader'

const Instructor = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {


    const accessToken = localStorage.getItem('accessToken');

    // Fetch Instructor from API
    fetch('https://skill-voyage-api.vercel.app/api/instructor/list', {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Attach token here
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setInstructors(data.data);
        } else {
          console.error('Unexpected data format:', data);
          
        }
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(error => {
        console.error('Error fetching Instructor:', error);
        
        setLoading(false); // Stop loading on error
      });
  }, []);

  
  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  const handleCourseClick = (id) => {
    navigate(`/instructors/${id}`);
  };

  const handleRatingChange = (e) => {
    setSelectedRating(Number(e.target.value));
  };

  const filteredInstructors = instructors
    .filter(instructor => Number(instructor.rating) >= selectedRating)
    .sort((a, b) => b.rating - a.rating); // Sort by rating in descending order


  


  return (
    <div className="instructor-list">
      <div className="header-container">
        <h1>Instructor</h1>
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
        {filteredInstructors.map((instructor) => (
          <li key={instructor._id} className="instructor-item" onClick={() => handleCourseClick(instructor._id)}>
            <img src={instructor.image} alt={instructor.name} className="instructor-image" />
            <div className="instructor-info">
              <h2>{instructor.name}</h2>
              <p>Rating: {instructor.rating} ⭐</p>
              <p>Course Name: {instructor.courseName}</p>
              <p>{instructor.qualification}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Instructor;
