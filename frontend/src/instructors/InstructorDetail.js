import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InstructorDetail.css';
import Loader from '../components/Loader'; // Import the Loader component


const InstructorDetail = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    // Fetch all instructor from the API
    const accessToken = localStorage.getItem('accessToken');

    // Fetch the instructor details from the API by ID
    fetch(`https://skill-voyage-api.vercel.app/api/instructor/list`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Attach token here
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data) {
          const foundInstructor = data.data.find(instructor => instructor._id === id);
          setInstructor(foundInstructor);
        } else {
          console.error('Unexpected data format or no instructor available:', data);
          //setLoading(false);
        }
        //setLoading(false);
      })
      .catch(error => console.error('Error fetching instructor list:', error));
  }, [id]);

  if (!instructor) {
    return <Loader />;
  }

  return (
    <div className="instructor-detail">
      <h1>{instructor.name}</h1>
      <img src={instructor.image} alt={instructor.name} className="instructor-detail-image" />
      <div className="instructor-detail-info">
        <p>Rating: {instructor.rating} ⭐</p>
        <p>Course Name: {instructor.courseName}</p>
        <p>{instructor.qualification}</p>
      </div>
    </div>
  );
};

export default InstructorDetail;
