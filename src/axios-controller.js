import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://zoomayor.io/api"
      : "http://147.45.244.129:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default instance;
