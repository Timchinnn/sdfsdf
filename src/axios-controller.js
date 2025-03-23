import axios from "axios";
const instance = axios.create({
  baseURL: "https://zoomayor.io/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Access-Control-Allow-Origin": "*",
  },
});
export default instance;
