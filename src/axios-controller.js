import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://147.45.244.129:3000/api"
      : "http://localhost:3000/api",
  withCredentials: true,
  timeout: 15000,
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
  headers: {
    "Content-Type": "application/json",
  },
});
// Add response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      console.error("Resource not found:", error.config.url);
    }
    return Promise.reject(error);
  }
);
export default instance;
