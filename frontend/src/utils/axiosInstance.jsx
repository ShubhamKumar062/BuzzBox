import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2030/api",
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (token?.startsWith('"') && token?.endsWith('"')) {
      token = token.slice(1, -1); 
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
