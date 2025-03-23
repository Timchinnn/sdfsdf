import axios from "axios";
const instance = axios.create({
  baseURL: "https://zoomayor.io/api",
  timeout: 5000,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
  headers: {
    "Content-Type": "application/json",
  },
});
// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      console.warn("Resource not found:", error.config.url);
      // Возвращаем пустой объект вместо null
      return Promise.resolve({
        data: {},
        status: 404,
        statusText: "Not Found",
      });
    }
    return Promise.reject(error);
  }
);
export default instance;
