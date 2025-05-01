import React, { useState, useEffect } from "react";
import styles from "./ShopManagement.module.css";
import routeShopManagement from "./route";
import { NavLink } from "react-router-dom";
import { routeShirtManagement } from "pages/ShirtManagement";
import axios from "../../axios-controller";

const ShopManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shirts, setShirts] = useState([]);

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await axios.get("/shirts");
        setShirts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рубашек:", error);
      }
    };
    fetchShirts();
  }, []);
  const [items] = useState([
    {
      id: 1,
      title: "Классическая рубашка",
      price: 100,
      type: "shirt",
      image: "/img/shirt1.jpg",
    },
    {
      id: 2,
      title: "Карта жителя",
      price: 200,
      type: "card",
      image: "/img/card1.jpg",
    },
    {
      id: 3,
      title: "Набор карт Полиция",
      price: 500,
      type: "set",
      image: "/img/set1.jpg",
    },
  ]);
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <h2>Рубашки</h2>
        <div className={styles.cardsList}>
          {shirts.map((shirt) => (
            <div key={shirt.id} className={styles.cardItem}>
              <div className={styles.cardItemImg}>
                <img
                  src={`https://api.zoomayor.io${shirt.imageUrl}`}
                  alt={shirt.name}
                />
              </div>
              <div className={styles.cardInfo}>
                <h3>{shirt.name}</h3>
                <p>Цена: {shirt.price}</p>
              </div>
              <button
                style={{ background: "red" }}
                onClick={() => {
                  axios
                    .delete(`/shirts/${shirt.id}`)
                    .then(() => {
                      setShirts(shirts.filter((s) => s.id !== shirt.id));
                    })
                    .catch((error) => {
                      console.error("Ошибка при удалении рубашки:", error);
                      alert("Ошибка при удалении рубашки");
                    });
                }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        <div className={styles.settings}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <NavLink to={routeShirtManagement()} style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить товар</button>
          </NavLink>
        </div>
      </div>
      {/* Аналогичные секции для карт и наборов */}
      <div className={styles.mainContent}>
        <h2>Карты</h2>
        <div className={styles.cardsList}>
          {items
            .filter(
              (item) =>
                item.type === "card" &&
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <div key={item.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{item.title}</h3>
                </div>
                <button>Редактировать</button>
                <button style={{ background: "red", marginTop: "10px" }}>
                  Удалить
                </button>
              </div>
            ))}
        </div>
        <div className={styles.settings}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <NavLink to="/add-shop-item" style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить товар</button>
          </NavLink>
        </div>
      </div>
      <div className={styles.mainContent}>
        <h2>Наборы карт</h2>
        <div className={styles.cardsList}>
          {items
            .filter(
              (item) =>
                item.type === "set" &&
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <div key={item.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{item.title}</h3>
                </div>
                <button>Редактировать</button>
                <button style={{ background: "red", marginTop: "10px" }}>
                  Удалить
                </button>
              </div>
            ))}
        </div>
        <div className={styles.settings}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <NavLink to="/add-shop-item" style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить товар</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export { routeShopManagement };
export default ShopManagement;
