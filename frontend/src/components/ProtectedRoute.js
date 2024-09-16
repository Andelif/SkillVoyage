import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const location = useLocation();

  if (isAuthenticated) {
    return <Component {...rest} />;
  }

  if (location.pathname === '/courses' || location.pathname === '/instructors' || location.pathname === '/account' ) {
    return <Navigate to="/login-required" />;
  }

  return <Navigate to="/notfound" />;
};

export default ProtectedRoute;