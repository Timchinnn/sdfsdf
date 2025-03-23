import axios from "axios";

const instance = axios.create({
  baseURL: "api.zoomayor.io/api",
});

export default instance;
