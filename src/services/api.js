// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.200.57:8080/api', 
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  // ESSA VALIDAÇÃO É A CHAVE:
  // Só adiciona o header se houver um token e se ele não for as strings de erro do JS
  if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;