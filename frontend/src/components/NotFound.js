import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Optional: create a CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
};

export default NotFound;