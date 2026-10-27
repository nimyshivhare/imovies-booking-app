import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach Authorization Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('imovies_user');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401 response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired user
      if (localStorage.getItem('imovies_user')) {
        localStorage.removeItem('imovies_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
