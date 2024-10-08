import React, { useState, useEffect } from 'react';
import './Quiz.css';
import { questionsData } from './questions'; // Assuming this is where questions are stored
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

let finalResult = {}; // Store result globally, accessible in other files

const Quiz = () => {
  const [quizName, setQuizName] = useState(''); 
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState([]); // State for chart data

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
    if (selectedCourses.length > 0 && quizName) {
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
    const resultDetails = selectedCourses.map(course => {
      const courseQuestions = currentQuestions.filter(q => questionsData[course].some(cq => cq.question === q.question));
      const correctAnswers = courseQuestions.reduce((count, question) => {
        return count + (question.answer === userAnswers[currentQuestions.indexOf(question)] ? 1 : 0);
      }, 0);
      correctCount += correctAnswers;
      const percentage = (correctAnswers / courseQuestions.length) * 100 || 0;
      return {
        course,
        correctAnswers,
        percentage: percentage.toFixed(2),
      };
    });

    const calculatedScore = (correctCount / currentQuestions.length) * 100;
    setScore(calculatedScore);
    setResults(resultDetails);
    
    // Prepare data for the bar chart
    const chartData = resultDetails.map(result => ({
      course: result.course,
      percentage: result.percentage,
    }));
    setChartData(chartData);

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
    setQuizName('');
    setSelectedCourses([]);
    setQuizStarted(false);
    setCurrentQuestions([]);
    setUserAnswers([]);
    setTimer(0);
    setScore(null);
    setResults([]);
    setChartData([]); // Reset chart data
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
          <h2>Enter Quiz Name</h2>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Enter quiz name"
            className="quiz-name-input"
          />
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

          <button className="check-button" onClick={handleStartQuiz} disabled={selectedCourses.length < 1 || !quizName}>
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-start-container">
          <h2>{quizName}</h2>
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
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Correct Answers</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td>{result.course}</td>
                      <td>{result.correctAnswers}</td>
                      <td>{result.percentage}%</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>{results.reduce((acc, curr) => acc + curr.correctAnswers, 0)}</strong></td>
                    <td><strong>{(results.reduce((acc, curr) => acc + curr.correctAnswers, 0) / currentQuestions.length * 100).toFixed(2)}%</strong></td>
                  </tr>
                </tbody>
              </table>
              <h4>Correct/Incorrect Answers:</h4>
              {currentQuestions.map((question, index) => (
                <div key={index}>
                  <p>Q{index + 1}: {question.question}</p>
                  <p>Your answer: {userAnswers[index]} - {userAnswers[index] === question.answer ? "Correct" : "Incorrect"}</p>
                </div>
              ))}
              <button className="try-again-button" onClick={handleTryAgain}>Try Again</button>

              {/* Bar Chart */}
              <h3>Performance by Topic</h3>
              <div className="chart-container">
  <BarChart
    width={600}
    height={400}
    data={chartData}
    margin={{
      top: 0, right: 30, left: 10, bottom: 80, // Increase the top margin for space
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="course" 
      angle={-20} 
      textAnchor="end" 
      interval={0}
    />
    <YAxis />
    <Tooltip />
    <div className="chart-container">
  <BarChart
    width={600}
    height={450}  
    data={chartData}
    margin={{
      top: 0, right: 30, left: 10, bottom: 120,  
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="course" 
      angle={-45} 
      textAnchor="end" 
      interval={0} 
      tick={{ dy: 20 }} 
    />
    <YAxis />
    <Tooltip />
    {/* Legend aligned horizontally above the chart */}
    <Legend 
      layout="horizontal" 
      align="center" 
      verticalAlign="top" 
    />
    <Bar 
      dataKey="percentage" 
      fill="#8884d8" 
      label={{ position: 'top' }} 
    />
  </BarChart>
</div>

      layout="horizontal" // Horizontal layout for legend items
      align="center" // Center the legend horizontally
      verticalAlign="top" // Position the legend at the top
    />
    <Bar 
      dataKey="percentage" 
      fill="#8884d8" 
      label={{ position: 'top' }} 
    />
  </BarChart>
</div>



            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { finalResult };
export default Quiz;