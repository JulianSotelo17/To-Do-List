import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/users/login', { username, password });
  
  return response.data;
};

export const register = async (username, email, password) => {
  
  const response = await api.post('/users/register', { username, email, password });
  return response.data;
};

export const getTasks = async (userId) => {
  const response = await api.get(`/tasks`);
  return response.data;
};

export const createTask = async (title, description, userId) => {
  const response = await api.post('/tasks', { title, description, userId });
  return response.data;
};

export const updateTask = async (taskId, data) => {
  const response = await api.put(`/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export default api;