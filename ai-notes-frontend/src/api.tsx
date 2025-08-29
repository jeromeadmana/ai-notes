import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "https://ai-notes-api.vercel.app/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
