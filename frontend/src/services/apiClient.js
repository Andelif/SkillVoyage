import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'https://skill-voyage-api.vercel.app/api',
  withCredentials: true, // This will send HTTP-only cookies for refresh token
});

const setupInterceptors = (navigate) => {
  apiClient.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response, // Directly return the response if no error
    async (error) => {
      const originalRequest = error.config;

      // Check if access token expired and request was not retried
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent multiple retries in case of token failure

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token in localStorage, log out the user
          navigate('/login');
          return Promise.reject(error);
        }

        try {
          // Request a new access token using the refresh token
          const refreshResponse = await apiClient.post('/user/refresh-token', {
            refreshToken, // send refreshToken from localStorage
          });

          const { accessToken: newAccessToken } = refreshResponse.data;

          // Store the new access token in localStorage
          localStorage.setItem('accessToken', newAccessToken);

          // Update the Authorization header for the current and future requests
          apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Failed to refresh access token. Logging out.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken'); // Clear refreshToken as well
          navigate('/login');
        }
      }

      // If another error occurs, reject the promise
      return Promise.reject(error);
    }
  );



};

export { apiClient, setupInterceptors };
