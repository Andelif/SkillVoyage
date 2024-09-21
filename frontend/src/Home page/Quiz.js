import React, { useState } from 'react';
import './Quiz.css';

const courses = [
  'Data Structures',
  'Algorithms',
  'Database Systems',
  'Web Development',
  'Machine Learning',
  'Mobile App Development',
  'Software Engineering',
  'Cybersecurity',
  'Cloud Computing',
  'Artificial Intelligence'
];

const Quiz = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCourseChange = (event) => {
    const selectedCourse = event.target.value;
    if (selectedCourse && selectedCourses.length < 5) {
      setSelectedCourses([...selectedCourses, selectedCourse]);
    }
  };

  const removeCourse = (course) => {
    setSelectedCourses(selectedCourses.filter(c => c !== course));
    setShowCelebration(false); // Hide celebration if courses are removed
  };

  const suggestRandomCourse = () => {
    const unselectedCourses = courses.filter(course => !selectedCourses.includes(course));
    if (unselectedCourses.length > 0 && selectedCourses.length < 5) {
      const randomCourse = unselectedCourses[Math.floor(Math.random() * unselectedCourses.length)];
      setSelectedCourses([...selectedCourses, randomCourse]);
    }
  };

  const handleCheck = () => {
    if (selectedCourses.length >= 1 && selectedCourses.length <= 5) {
      if (selectedCourses.length === 5) {
        setShowCelebration(true); // Show celebration pop-up
      } else {
        setShowCelebration(false); // No celebration for less than 5 courses
      }
    }
  };

  return (
    <div className="quiz-container">
      <h2>Select Courses for Your Quiz</h2>
      
      <select onChange={handleCourseChange} disabled={selectedCourses.length >= 5}>
        <option value="">Select a Course</option>
        {courses.map((course, index) => (
          <option key={index} value={course} disabled={selectedCourses.includes(course)}>
            {course}
          </option>
        ))}
      </select>

      <button className="surprise-button" onClick={suggestRandomCourse} disabled={selectedCourses.length >= 5}>
        Surprise Me!
      </button>

      <div className="selected-courses">
        {selectedCourses.map((course, index) => (
          <div key={index} className="selected-course-item">
            {course}
            <button className="remove-button" onClick={() => removeCourse(course)}>X</button>
          </div>
        ))}
      </div>

      <button className="check-button" onClick={handleCheck} disabled={selectedCourses.length < 1}>
        Check
      </button>

      {showCelebration && (
        <div className="celebration-popup">
          🎉 Congratulations! You've selected 5 courses. Get ready for your quiz! 🎉
        </div>
      )}
    </div>
  );
};

export default Quiz;
