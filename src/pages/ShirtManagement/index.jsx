import React, { useState, useEffect } from "react";
import styles from "./ShirtManagement.module.css";
import { NavLink } from "react-router-dom";
import { cardBackService } from "services/api";
import routeShirtManagement from "./route";

const ShirtManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardBacks, setCardBacks] = useState([]);
  useEffect(() => {
    const fetchCardBacks = async () => {
      try {
        const response = await cardBackService.getAllCardBacks();
        setCardBacks(response.data);
      } catch (error) {
        console.error("Error fetching card backs:", error);
      }
    };
    fetchCardBacks();
  }, []);
  const handleDelete = async (id) => {
    try {
      await cardBackService.deleteCardBack(id);
      setCardBacks(cardBacks.filter((cb) => cb.id !== id));
    } catch (error) {
      console.error("Error deleting card back:", error);
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <h2>Рубашки</h2>
        <div className={styles.cardsList}>
          {cardBacks
            .filter((cardBack) =>
              cardBack.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((cardBack) => (
              <div key={cardBack.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img
                    src={`https://api.zoomayor.io${cardBack.image}`}
                    alt={cardBack.name}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{cardBack.name}</h3>
                </div>
                <button>Редактировать</button>
                <button
                  style={{ background: "red", marginTop: "10px" }}
                  onClick={() => handleDelete(cardBack.id)}
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
          <NavLink to="/add-shop-item" style={{ width: "40%" }}>
            <button className={styles.addButton}>Добавить рубашку</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default ShirtManagement;
