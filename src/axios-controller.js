import axios from "axios";
import https from "https";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://zoomayor.io/api"
      : "https://localhost:3000/api",
  withCredentials: true,
  timeout: 15000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.env.NODE_ENV === "production",
    secureProtocol: "TLSv1_2_method",
    ciphers: "ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256",
    honorCipherOrder: true,
  }),
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      console.error("Resource not found:", error.config.url);
    }
    return Promise.reject(error);
  }
);
export default instance;
