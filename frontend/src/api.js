import axios from "axios";

// Change baseURL to your backend URL
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default api;
