import axios from 'axios';
import {useHistory}  from 'react-router-dom';

const api = axios.create({
    baseURL: 'https://skill-voyage-api.vercel.app', // Replace with your API base URL
});

// Request Interceptor to add access token to headers
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response Interceptor to handle token expiration
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            try {
                const response = await api.post('/api/user/refresh-token', { refreshToken });
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token error', refreshError);
                console.log("Problem in api");
                // Handle refresh token error, e.g., redirect to login

                window.location.href = '/login';
            }

            

        }
        return Promise.reject(error);
    }
);

export default api;
