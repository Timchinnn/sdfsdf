import axios from "axios";
const instance = axios.create({
  baseURL: "https://zoomayor.io/api",
  withCredentials: true,
});
export default instance;
