import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'https://skill-voyage-api.vercel.app/api',
  withCredentials: true, // Ensures refreshToken cookie is sent
});

const setupInterceptors = (navigate) => {
  apiClient.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      console.log('AccessToken in request:', accessToken); // Log the token for debugging
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      console.error('Error in request interceptor:', error); // Log request errors
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => response, // Directly return the response if no error
    async (error) => {
      console.log('Error response:', error.response); // Log the error response for debugging
      const originalRequest = error.config;

      // Check if the error is due to an expired access token or forbidden error
      if ((error.response && (error.response.status === 401 || error.response.status === 403)) && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent multiple retries

        console.log('401 or 403 error detected, attempting refresh token...');

        try {
          // Send the refresh token to the API to get a new access token
          const refreshResponse = await apiClient.post('/user/refresh-token', {}, { withCredentials: true });

          // Log the refresh response
          console.log('Refresh token response:', refreshResponse.data);

          const { accessToken: newAccessToken } = refreshResponse.data;

          // Store the new access token
          localStorage.setItem('accessToken', newAccessToken);

          // Update the Authorization header for the current request and retry
          apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      }

      // Log any other errors
      console.error('Other error:', error);
      return Promise.reject(error);
    }
  );
};

export { apiClient, setupInterceptors };
