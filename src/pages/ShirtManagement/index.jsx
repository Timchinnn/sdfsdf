import React, { useState, useEffect } from "react";
import styles from "./ShirtManagement.module.css";
import { cardBackService } from "services/api";
import routeShirtManagement from "./route";
import addimg from "assets/img/addimg.png";
const ShirtManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardBacks, setCardBacks] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [cardCost, setCardCost] = useState("");
  useEffect(() => {
    const fetchCardBacks = async () => {
      try {
        const response = await cardBackService.getAllCardBacks();
        setCardBacks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCardBacks();
  }, []);
  const handleShowCards = () => {
    setShowCards(true);
  };
  const handleHideCards = () => {
    setShowCards(false);
  };
  const handleSave = () => {
    console.log("Сохраняем рубашку с ценой:", cardCost);
    setShowCards(false);
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        {!showCards && (
          <div className={styles.addButton} onClick={handleShowCards}>
            <img
              src={addimg}
              alt="Добавить рубашку"
              style={{ height: "64px" }}
            />
            <p>Добавить рубашку</p>
          </div>
        )}
        {showCards && (
          <>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Поиск по названию"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.cardsList}>
              {cardBacks
                .filter((cardBack) =>
                  cardBack.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
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
                  </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
              <input
                type="number"
                placeholder="Стоимость рубашки"
                value={cardCost}
                onChange={(e) => setCardCost(e.target.value)}
              />
            </div>
            <div className={styles.save}>
              <button onClick={handleSave} className={styles.addButton}>
                Сохранить изменения
              </button>
              <button onClick={handleHideCards} className={styles.cardButton}>
                Отмена
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ShirtManagement;
export { routeShirtManagement };
