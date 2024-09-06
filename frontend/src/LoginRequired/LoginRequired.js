import React from 'react';
import { Link } from 'react-router-dom';
import './LoginRequired.css'

const LoginRequired = () => {
  return (
    <div className='login-required-container'>
      <h2>Login Required</h2>
      <p>You need to log in in order to view the contents of this page.</p>
      <Link to="/home" className='HomeLink'>Go Back Home</Link>
    </div>
  );
};

export default LoginRequired;
