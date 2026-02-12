import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.200.180:8080', 
});

export default api;