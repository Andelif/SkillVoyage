import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'https://skill-voyage-api.vercel.app/api',
  withCredentials: true, // this will send HTTP-only cookies for refresh token
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
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If access token expired, attempt refresh
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshTokenResponse = await axios.post(
            'https://skill-voyage-api.vercel.app/api/user/refresh-token',
            {}, // or whatever is required
            { withCredentials: true }
          );

          const newAccessToken = refreshTokenResponse.data.accessToken;

          // Store the new access token in localStorage
          localStorage.setItem('accessToken', newAccessToken);

          // Update the authorization header with new token
          apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Retry the original request with new token
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refresh token is also expired, log the user out
          console.error('Refresh token expired. Logging out.');
          localStorage.removeItem('accessToken');
          navigate('/login'); // redirect to login page
        }
      }
      return Promise.reject(error);
    }
  );
};

export { apiClient, setupInterceptors };
