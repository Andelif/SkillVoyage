import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      // If there's no access token but there is a refresh token, attempt to refresh the token
      if (!accessToken && refreshToken) {
        try {
          // Make a request to refresh the access token
          const refreshResponse = await apiClient.post('/user/refresh-token', { refreshToken });
          const { accessToken: newAccessToken } = refreshResponse.data;

          // Store the new access token in localStorage
          localStorage.setItem('accessToken', newAccessToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to refresh token:', error);
          setIsAuthenticated(false);
        }
      } else if (accessToken) {
        // Access token is present, consider the user authenticated
        setIsAuthenticated(true);
      } else {
        // Neither access token nor refresh token exists, user is not authenticated
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Component {...rest} />;
  }

  // Redirect based on location
  if (location.pathname === '/courses' || location.pathname === '/instructors' || location.pathname === '/account' ) {
    return <Navigate to="/login-required" />;
  }

  return <Navigate to="/notfound" />;
};

export default ProtectedRoute;
