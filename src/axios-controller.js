import axios from "axios";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://zoomayor.io"
      : "http://localhost:3000",
  withCredentials: true,
});
export default instance;
