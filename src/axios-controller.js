import axios from "axios";
// Настройка базового URL для axios
const instance = axios.create({
  baseURL: "https://zoomayor.io",
  // можно добавить таймауты и другие опции, если необходимо
});
// Пример запроса с использованием настроенного экземпляра axios
instance
  .get("/api/endpoint")
  .then((response) => {
    console.log("Данные:", response.data);
  })
  .catch((error) => {
    console.error("Ошибка:", error);
  });
export default instance;
