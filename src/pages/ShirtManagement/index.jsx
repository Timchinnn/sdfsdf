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
  const [selectedShirts, setSelectedShirts] = useState([]);
  useEffect(() => {
    cardBackService
      .getAllCardBacks()
      .then((response) => setCardBacks(response.data))
      .catch((error) => console.error(error));
  }, []);
  const handleAddButtonClick = () => setIsSelectionVisible(true);
  const handleCancel = () => setIsSelectionVisible(false);
  const handleSave = () => {
    console.log("Сохраняем рубашку с ценой:", cardCost);
    // Здесь можно добавить API-вызов для сохранения выбранной рубашки вместе с ценой
    setIsSelectionVisible(false);
  };
  const handleAddShirt = (shirt) => {
    // Если рубашка уже добавлена, не добавляем снова
    if (!selectedShirts.find((s) => s.id === shirt.id)) {
      setSelectedShirts([...selectedShirts, shirt]);
      console.log("Добавлена рубашка:", shirt);
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        {/* Если рубашки еще не выбраны, отображается кнопка "Добавить рубашку" */}
        {!isSelectionVisible && selectedShirts.length === 0 && (
          <div className={styles.addButton} onClick={handleAddButtonClick}>
            <img src={addimg} alt="Добавить рубашку" />
            <p>Добавить рубашку</p>
          </div>
        )}
        {/* Если выбраны рубашки, отображаем их список */}
        {selectedShirts.length > 0 && (
          <>
            <h2>Добавленные рубашки</h2>
            <div className={styles.cardsList}>
              {selectedShirts.map((shirt) => (
                <div key={shirt.id} className={styles.cardItem}>
                  <div className={styles.cardItemImg}>
                    <img
                      src={`https://api.zoomayor.io${shirt.image}`}
                      alt={shirt.name}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{shirt.name}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.addButton} onClick={handleAddButtonClick}>
              <img src={addimg} alt="Добавить рубашку" />
              <p>Добавить еще рубашку</p>
            </div>
          </>
        )}
        {/* Блок выбора рубашек */}
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
                      className={styles.addCardButton}
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
