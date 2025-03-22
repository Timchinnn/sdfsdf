import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://zoomayor.io/api" // Для продакшена
      : "/api", // Для разработки
});
export default instance;
