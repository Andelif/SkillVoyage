import React, { useState, useEffect } from 'react';
import './Scoreboard.css';

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('https://skill-voyage-api.vercel.app/api/scoreboard'); // Adjust the URL if needed
        if (!response.ok) {
          throw new Error('Failed to fetch scores');
        }
        const data = await response.json();
        setScores(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="scoreboard-container">
      <h1>Scoreboard</h1>
      {loading ? (
        <p>Loading scores...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : scores.length === 0 ? (
        <p>No scores available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Correct Answers</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score.quizName}</td>
                <td>{score.correctAnswers}</td>
                <td>{score.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Scoreboard;