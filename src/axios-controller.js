import axios from "axios";
const instance = axios.create({
  baseURL: "https://api.zoomayor.io/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// Add response interceptor to handle CORS headers
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error("CORS error:", error);
    }
    return Promise.reject(error);
  }
);
export default instance;
