import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://147.45.244.129:3000/api"
      : "http://localhost:3000/api",
  withCredentials: true,
  timeout: 15000, // Увеличиваем timeout
  validateStatus: (status) => {
    return status >= 200 && status < 500; // Обрабатываем все ответы кроме 500-х ошибок
  },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// Добавляем перехватчик для обработки ошибок
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Обработка ответа с ошибкой
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Обработка отсутствия ответа
      console.error("No response received:", error.request);
    } else {
      // Обработка ошибки запроса
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);
export default instance;
