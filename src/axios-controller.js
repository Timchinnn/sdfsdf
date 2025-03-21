import axios from "axios";
const instance = axios.create({
  baseURL: window.location.origin + "/api",
  withCredentials: true,
});
export default instance;
