import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getLawnPlans = () => api.get('/lawn-plans');
export const createLawnPlan = (data) => api.post('/lawn-plans', data);
export const updateLawnPlan = (id, data) => api.put(`/lawn-plans/${id}`, data);
export const deleteLawnPlan = (id) => api.delete(`/lawn-plans/${id}`);

// Add more API functions as needed

export default api;
