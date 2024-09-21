import React, { useState, useEffect } from 'react';
import './Scoreboard.css';

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('scoreboard')) || [];
    setScores(savedScores);
  }, []);

  return (
    <div className="scoreboard-container">
      <h1>Scoreboard</h1>
      {scores.length === 0 ? (
        <p>No scores available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Correct Answers</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score.courseName}</td>
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
