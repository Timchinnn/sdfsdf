import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://147.45.244.129:3000/api"
      : "http://localhost:3000/api",
  withCredentials: true,
  timeout: 5000,
  httpsAgent: new (require("https").Agent)({
    rejectUnauthorized: false, // Временное решение для разработки
  }),
});
export default instance;
