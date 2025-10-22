import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Automatically attach token from localStorage.userInfo (where app saves user data)
API.interceptors.request.use((config) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore JSON parse errors and continue without token
  }
  return config;
});

export default API;
