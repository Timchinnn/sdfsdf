const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://zoomayor.io/api"
      : "http://147.45.244.129:3000/api",
  timeout: 30000, // Увеличиваем таймаут до 30 секунд
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true, // Добавляем поддержку credentials
});
