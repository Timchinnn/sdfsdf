import axios from "axios";

const instance = axios.create({
  baseURL: "https://zoomayor.io/api",
});

export default instance;
