import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetail.css';
import Loader from '../components/Loader'; 

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);


  
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || "Anonymous";

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    fetch(`https://skill-voyage-api.vercel.app/api/course/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data) {
          
          setCourse(data.data);
        } else {
          console.error('Unexpected data format or no courses available:', data);
        }
      })
      .catch(error => console.error('Error fetching courses list:', error));
  }, [id]);


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    const accessToken = localStorage.getItem('accessToken');
  
    if (newComment && rating > 0) {
      try {
        const response = await fetch(`https://skill-voyage-api.vercel.app/api/course/${course._id}/comments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: course._id,
            text: newComment,
            rating: rating,
            name: userName
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          setComments([...comments, { text: newComment, rating, name: userName }]);
          setNewComment('');
          setRating(0);
        } else {
          console.error('Failed to add comment:', data.message);
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    } else {
      alert('Please enter a comment and select a rating.');
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://skill-voyage-api.vercel.app/api/course/${course._id}/comments`);
        const data = await response.json();
        if (data.success) {
          setComments(data.data);
        } else {
          console.error('Failed to fetch comments:', data.message);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    if (course?._id) {
      fetchComments();
    }
  }, [course?._id]);

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
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
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
          {comments.length === 0 && (
            <p>No comments yet. Be the first to comment!</p>
          )}
          {comments.map((comment, index) => (
            <li key={index}>
              <p><strong>{comment.name}</strong>: {comment.text}</p>
              <p>Rating: {comment.rating} ⭐</p>
            </li>
          ))}
        </ul>
      </div>



    </div>
  );
};

export default CourseDetail;
