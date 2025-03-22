import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "https://zoomayor.io/api" : "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Добавляем перехватчик запросов
instance.interceptors.request.use(
  (config) => {
    // Можно добавить токены или другие заголовки
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Добавляем перехватчик ответов
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      // Обработка таймаута
      console.error("Request timeout");
    } else if (!error.response) {
      // Обработка ошибки сети
      console.error("Network error");
    } else {
      // Обработка ошибок сервера
      console.error(`Server error: ${error.response.status}`);
    }

    return Promise.reject(error);
  }
);
export default instance;
