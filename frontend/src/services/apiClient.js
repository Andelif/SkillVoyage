import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiClient = axios.create({
  baseURL: "https://skill-voyage-api.vercel.app/api",
  withCredentials: true, // Ensures refreshToken cookie is sent
});

const setupInterceptors = (navigate) => {
  apiClient.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      console.log("AccessToken in request:", accessToken); // Log the token for debugging
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      console.error("Error in request interceptor:", error); // Log request errors
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => response, // Directly return the response if no error
    async (error) => {
      console.log("Error response:", error.response); // Log the error response for debugging
      const originalRequest = error.config;

      // Check if the error is due to an expired access token or forbidden error
      if (error.response &&(error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {


        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken"); // Fetch refresh token from localStorage
        if (!refreshToken) {
          console.error("No refresh token available. Redirecting to login.");
          navigate("/login");
          return Promise.reject(error);
        }

        try {
          // Request a new access token using the refresh token
          const refreshResponse = await apiClient.post("/user/refresh-token", {
            refreshToken, // Ensure the refreshToken is being passed correctly here
          });

          const { accessToken: newAccessToken } = refreshResponse.data;
          console.log("New accessToken generated:", newAccessToken);

          // Store the new access token in localStorage
          localStorage.setItem("accessToken", newAccessToken);

          // Update the Authorization header for the current and future requests
          apiClient.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new access token
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh access token. Logging out.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
          
        }
      }

      // Log any other errors
      console.error("Other error:", error);
      return Promise.reject(error);
    }
  );
};

export { apiClient, setupInterceptors };
