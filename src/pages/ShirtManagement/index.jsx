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
  const handleAddButtonClick = () => setIsSelectionVisible(true);
  const handleCancel = () => setIsSelectionVisible(false);
  const handleSave = () => {
    console.log("Сохранить рубашку с ценой:", cardCost);
    setIsSelectionVisible(false);
    // Можно добавить вызов API для сохранения выбранной рубашки
  };
  const handleAddShirt = (shirt) => {
    console.log("Добавлена рубашка:", shirt);
    // Дополнительная логика добавления рубашки, если необходима
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        {!isSelectionVisible && (
          <div
            className={styles.initialAddButton}
            onClick={handleAddButtonClick}
          >
            <img src={addimg} alt="Добавить рубашку" />
            <p>Добавить рубашку</p>
          </div>
        )}
        {isSelectionVisible && (
          <>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Поиск рубашек"
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
                    <button
                      className={styles.cardButton}
                      onClick={() => handleAddShirt(cb)}
                    >
                      Добавить
                    </button>
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
              <button className={styles.saveButton} onClick={handleSave}>
                Сохранить изменения
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
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
