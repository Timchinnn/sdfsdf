import React, { useState, useEffect } from "react";
import styles from "./ShopManagement.module.css";
import routeShopManagement from "./route";
import { NavLink } from "react-router-dom";
import DefaultImg from "assets/img/default-card.png";
import { routeShirtManagement } from "pages/ShirtManagement";
import { routeAddEditShopCard } from "pages/AddEditShopCard";
import { routeAddEditShopSet } from "pages/AddEditShopSet";
import axios from "../../axios-controller";
import { routeAddEditShopShirt } from "pages/AddEditShopShirt";
const cardBackStyles = {
  default: { image: DefaultImg },
};

const ShopManagement = () => {
  const [searchQueries, setSearchQueries] = useState({
    shirts: "",
    shopShirts: "",
    shopCards: "",
    shopSets: "",
  });
  const [shirts, setShirts] = useState([]);
  const [shopShirts, setShopShirts] = useState([]);
  const [shopCards, setShopCards] = useState([]);
  const [shopSets, setShopSets] = useState([]);
  useEffect(() => {
    const fetchShopSets = async () => {
      try {
        const response = await axios.get("/shop-sets");
        setShopSets(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке наборов1:", error);
      }
    };
    fetchShopSets();
  }, []);
  useEffect(() => {
    const fetchShopShirts = async () => {
      try {
        const response = await axios.get("/shop-shirts");
        setShopShirts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рубашек:", error);
      }
    };
    fetchShopShirts();
  }, []);
  useEffect(() => {
    const fetchShopCards = async () => {
      try {
        const response = await axios.get("/shop-cards");
        setShopCards(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке карт:", error);
      }
    };
    fetchShopCards();
  }, []);
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
      title: "Классическая рубашка1",
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
  const handleSearchChange = (type, value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <h2>Рубашки</h2>
        <div className={styles.cardsList}>
          {shirts
            .filter((shirt) =>
              shirt.name
                .toLowerCase()
                .includes(searchQueries.shirts.toLowerCase())
            )
            .map((shirt) => (
              <div key={shirt.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img
                    src={`https://api.zoomayor.io${shirt.image_url}`}
                    alt={shirt.name}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{shirt.name}</h3>
                  {/* <p>Цена: {shirt.price}</p> */}
                  <p>Цена: {Math.floor(shirt.price)}</p>
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
              value={searchQueries.shirts}
              onChange={(e) => handleSearchChange("shirts", e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <NavLink to={routeShirtManagement()} style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить товар</button>
          </NavLink>
        </div>
      </div>
      <div className={styles.mainContent}>
        <h2>Рубашки в магазине</h2>
        <div className={styles.cardsList}>
          {shopShirts
            .filter((shirt) =>
              shirt.name
                .toLowerCase()
                .includes(searchQueries.shopShirts.toLowerCase())
            )
            .map((shirt) => (
              <div key={shirt.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img
                    src={`https://api.zoomayor.io${shirt.image_url}`}
                    alt={shirt.name}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{shirt.name}</h3>
                </div>
                <button
                  style={{ background: "red" }}
                  onClick={() => {
                    axios
                      .delete(`/shop-shirts/${shirt.id}`)
                      .then(() => {
                        setShopShirts(
                          shopShirts.filter((s) => s.id !== shirt.id)
                        );
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
              value={searchQueries.shopShirts}
              onChange={(e) => handleSearchChange("shopShirts", e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <NavLink to={routeAddEditShopShirt()} style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить рубашку</button>
          </NavLink>
        </div>
      </div>
      <div className={styles.mainContent}>
        <h2>Карты</h2>
        <div className={styles.cardsList}>
          {shopCards
            .filter((card) =>
              card.name
                .toLowerCase()
                .includes(searchQueries.shopCards.toLowerCase())
            )
            .map((card) => (
              <div key={card.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img
                    src={`https://api.zoomayor.io${card.image_url}`}
                    alt={card.name}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{card.name}</h3>
                  {/* <p>Цена: {card.price}</p> */}
                  <p>Цена: {Math.floor(card.price)}</p>
                </div>
                {/* <button>Редактировать</button> */}
                <button
                  style={{ background: "red", marginTop: "10px" }}
                  onClick={() => {
                    axios
                      .delete(`/shop-cards/${card.id}`)
                      .then(() => {
                        setShopCards(shopCards.filter((c) => c.id !== card.id));
                      })
                      .catch((error) => {
                        console.error("Ошибка при удалении карты:", error);
                        alert("Ошибка при удалении карты");
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
              value={searchQueries.shopCards}
              onChange={(e) => handleSearchChange("shopCards", e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <NavLink to={routeAddEditShopCard()} style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить товар</button>
          </NavLink>
        </div>
      </div>
      <div className={styles.mainContent}>
        <h2>Наборы карт</h2>
        <div className={styles.cardsList}>
          {shopSets
            .filter((set) =>
              set.name
                .toLowerCase()
                .includes(searchQueries.shopSets.toLowerCase())
            )
            .map((set) => (
              <div key={set.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img src={cardBackStyles.default.image} alt={set.name} />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{set.name}</h3>
                  {/* <p>Цена: {set.price}</p> */}
                  <p>Цена: {Math.floor(set.price)}</p>
                </div>
                <NavLink to={routeAddEditShopSet(set.id)}>
                  <button>Редактировать</button>
                </NavLink>{" "}
                <button
                  style={{ background: "red", marginTop: "10px" }}
                  onClick={() => {
                    axios
                      .delete(`/shop-sets/${set.id}`)
                      .then(() => {
                        setShopSets(shopSets.filter((s) => s.id !== set.id));
                      })
                      .catch((error) => {
                        console.error("Ошибка при удалении набора:", error);
                        alert("Ошибка при удалении набора");
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
              value={searchQueries.shopSets}
              onChange={(e) => handleSearchChange("shopSets", e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <NavLink to={routeAddEditShopSet()} style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить товар</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export { routeShopManagement };
export default ShopManagement;
