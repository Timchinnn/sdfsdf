import axios from "axios";
const instance = axios.create({
  baseURL: "http://api.zoomayor.io/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default instance;
