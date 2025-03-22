import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://zoomayor.io/api" // Для продакшена
      : "http://147.45.244.129:3000/api", // Для разработки
});
export default instance;
