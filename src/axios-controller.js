import axios from "axios";

const instance = axios.create({
  baseURL: "http://147.45.244.129:3000/api",
});

export default instance;
