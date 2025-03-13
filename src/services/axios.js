import axios from "axios";

const API_URL = "http://localhost:8081"; // Backend URL

const api = axios.create({
  baseURL: API_URL, // Set the base URL for all requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;