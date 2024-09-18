import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InstructorDetail.css';
import Loader from '../components/Loader'; // Import the Loader component

const InstructorDetail = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
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
        }
      })
      .catch(error => console.error('Error fetching instructor list:', error));
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment) {
      const newEntry = { text: newComment, rating };
      setComments([...comments, newEntry]); // Add comment and rating
      setNewComment(''); // Clear comment input
      setRating(0); // Reset rating
    }
  };

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

      <div className="comment-section">
        <h3>Leave a Comment and Rating:</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            rows="4"
          />
          <div className="rating">
            <label>Rate this instructor:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="0">Select rating</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="5">5 ⭐</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>

        <h3>Comments:</h3>
        <ul>
          {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
          {comments.map((comment, index) => (
            <li key={index}>
              <p>{comment.text}</p>
              <p>Rating: {comment.rating} ⭐</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstructorDetail;
