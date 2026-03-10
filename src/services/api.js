import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.0.243:8080', 
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  // 🟢 LINHAS DESCOMENTADAS! Agora o token vai junto com a requisição
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;