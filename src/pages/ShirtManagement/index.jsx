import React, { useState, useEffect } from "react";
import styles from "./ShirtManagement.module.css";
import { cardBackService } from "services/api";
import routeShirtManagement from "./route";
import addimg from "assets/img/addimg.png";
const ShirtManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardBacks, setCardBacks] = useState([]);
  const [isSelectionVisible, setIsSelectionVisible] = useState(false);
  const [cardCost, setCardCost] = useState("");
  useEffect(() => {
    cardBackService
      .getAllCardBacks()
      .then((response) => setCardBacks(response.data))
      .catch((error) => console.error(error));
  }, []);
  const handleAddButton = () => setIsSelectionVisible(true);
  const handleCancel = () => setIsSelectionVisible(false);
  const handleSave = () => {
    console.log("Сохраняем рубашку с ценой:", cardCost);
    setIsSelectionVisible(false);
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        {!isSelectionVisible && (
          <div className={styles.addButton} onClick={handleAddButton}>
            <img
              src={addimg}
              alt="Добавить рубашку"
              style={{ height: "64px" }}
            />
            <p>Добавить рубашку</p>
          </div>
        )}
        {isSelectionVisible && (
          <>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Поиск по рубашкам"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.cardsList}>
              {cardBacks
                .filter((cb) =>
                  cb.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cb) => (
                  <div key={cb.id} className={styles.cardItem}>
                    <div className={styles.cardItemImg}>
                      <img
                        src={`https://api.zoomayor.io${cb.image}`}
                        alt={cb.name}
                      />
                    </div>
                    <div className={styles.cardInfo}>
                      <h3>{cb.name}</h3>
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
              <button className={styles.addButton} onClick={handleSave}>
                Сохранить изменения
              </button>
              <button className={styles.cardButton} onClick={handleCancel}>
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
