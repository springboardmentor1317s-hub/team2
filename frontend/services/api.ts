import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add interceptor to include JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    college: string;
    role: string;
  }) => api.post('/register', data),

  login: (data: {
    email: string;
    password: string;
  }) => api.post('/login', data),
};

export default api;