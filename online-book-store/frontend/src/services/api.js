import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    config.headers.Authorization = `Bearer ${JSON.parse(savedUser).token}`;
  }
  return config;
});

export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.request) {
    return 'Cannot reach the server. Please check that the backend is running.';
  }
  return 'Something went wrong. Please try again.';
};

export default api;
