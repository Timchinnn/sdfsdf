import axios from "axios";
const instance = axios.create({
  baseURL: "https://zoomayor.io/api",
  timeout: 5000,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Обрабатываем все статусы кроме 5xx
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
      return Promise.resolve({ data: null }); // Возвращаем null вместо ошибки
    }
    return Promise.reject(error);
  }
);
export default instance;
