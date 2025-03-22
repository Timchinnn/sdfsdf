import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://api.zoomayor.io" // Продакшен API endpoint
      : "/api", // Локальный API endpoint для разработки
});
export default instance;
