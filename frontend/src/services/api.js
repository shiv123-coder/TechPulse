import axios from 'axios';

let apiBaseURL = import.meta.env.VITE_API_URL || '/api';
if (apiBaseURL.startsWith('http') && !apiBaseURL.endsWith('/api')) {
  apiBaseURL = `${apiBaseURL.replace(/\/+$/, '')}/api`;
}

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecommerce_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ecommerce_token');
      localStorage.removeItem('ecommerce_user');
    }
    return Promise.reject(error);
  }
);

export default api;

