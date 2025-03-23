import axios from "axios";

const instance = axios.create({
  baseURL: "https://zoomayor.io:3000/api",
});

export default instance;
