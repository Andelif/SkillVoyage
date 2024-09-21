import React, { useState, useEffect } from 'react';
import './Quiz.css';
import { questionsData } from './questions'; // Assuming this is where questions are stored

let finalResult = {}; // Store result globally, accessible in other files

const Quiz = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [score, setScore] = useState(null); // To show score after quiz ends
  const [results, setResults] = useState([]); // To show correct/incorrect answers

  useEffect(() => {
    let intervalId;
    if (quizStarted && timer > 0) {
      intervalId = setInterval(() => setTimer(prevTimer => prevTimer - 1), 1000);
    } 
    return () => clearInterval(intervalId);
  }, [quizStarted, timer]);

  const handleCourseChange = (event) => {
    const selectedCourse = event.target.value;
    if (selectedCourse && selectedCourses.length < 5) {
      setSelectedCourses([...selectedCourses, selectedCourse]);
    }
  };

  const removeCourse = (course) => {
    setSelectedCourses(selectedCourses.filter(c => c !== course));
  };

  const suggestRandomCourse = () => {
    const unselectedCourses = Object.keys(questionsData).filter(course => !selectedCourses.includes(course));
    if (unselectedCourses.length > 0 && selectedCourses.length < 5) {
      const randomCourse = unselectedCourses[Math.floor(Math.random() * unselectedCourses.length)];
      setSelectedCourses([...selectedCourses, randomCourse]);
    }
  };

  const handleStartQuiz = () => {
    if (selectedCourses.length > 0) {
      const allQuestions = selectedCourses.flatMap(course => {
        const courseQuestions = questionsData[course];
        return courseQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
      });

      setCurrentQuestions(allQuestions);
      setQuizStarted(true);
      setTimer(selectedCourses.length * 3 * 40);
    }
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = selectedOption;
    setUserAnswers(newAnswers);
  };

  const calculateResult = () => {
    let correctCount = 0;
    const resultDetails = currentQuestions.map((question, index) => {
      const isCorrect = question.answer === userAnswers[index];
      if (isCorrect) correctCount++;
      return {
        question: question.question,
        userAnswer: userAnswers[index],
        correctAnswer: question.answer,
        isCorrect,
      };
    });

    const calculatedScore = (correctCount / currentQuestions.length) * 100;
    setScore(calculatedScore);
    setResults(resultDetails);

    finalResult = {
      selectedCourses,
      totalQuestions: currentQuestions.length,
      correctAnswers: correctCount,
      score: calculatedScore,
    };
  };

  const handleDone = () => {
    setTimer(0);
    calculateResult();
  };

  const handleTryAgain = () => {
    setSelectedCourses([]);
    setQuizStarted(false);
    setCurrentQuestions([]);
    setUserAnswers([]);
    setTimer(0);
    setScore(null);
    setResults([]);
  };

  const isQuizEnded = timer === 0;

  return (
    <div>
      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => window.history.back()}>
          <svg width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6v12z"/>
          </svg>
          Back
        </button>
      </div>

      {!quizStarted ? (
        <div className="quiz-container">
          <h2>Select Courses for Your Quiz</h2>
          <select onChange={handleCourseChange} disabled={selectedCourses.length >= 5}>
            <option value="">Select a Course</option>
            {Object.keys(questionsData).map((course, index) => (
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

          <button className="check-button" onClick={handleStartQuiz} disabled={selectedCourses.length < 1}>
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-start-container">
          <h2>Quiz</h2>
          <div className="timer">Time Left: {timer} seconds</div>

          {currentQuestions.map((question, index) => (
            <div key={index} className="question-block">
              <p>Q{index + 1}: {question.question}</p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswerChange(index, option)}
                    disabled={isQuizEnded}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}

          <button className="done-button" onClick={handleDone}>Done</button>

          {score !== null && (
            <div className="result-container">
              <h3>Your Result</h3>
              <p>Score: {score}%</p>
              <h4>Results:</h4>
              {results.map((result, index) => (
                <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <p>Q{index + 1}: {result.question}</p>
                  <p>Your Answer: {result.userAnswer}</p>
                  <p>Correct Answer: {result.correctAnswer}</p>
                  <p className={result.isCorrect ? 'correct' : 'incorrect'}>
                    {result.isCorrect ? '✔️ Correct' : '❌ Incorrect'}
                  </p>
                </div>
              ))}
              <button className="try-again-button" onClick={handleTryAgain}>Try Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { finalResult };
export default Quiz;
