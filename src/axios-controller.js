import axios from "axios";
const instance = axios.create({
  baseURL: "https://api.zoomayor.io/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
export default instance;
