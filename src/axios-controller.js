import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "https://zoomayor.io/api" : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      console.error("Resource not found:", error.config.url);
      // Handle 404 errors specifically
      return Promise.reject({
        ...error,
        message: "Requested resource not found",
        isNotFound: true,
      });
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);
export default instance;
