import React, { useState, useEffect } from "react";
import styles from "./ShirtManagement.module.css";
import { cardBackService } from "services/api";
import routeShirtManagement from "./route";
import addimg from "assets/img/addimg.png";
const ShirtManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardBacks, setCardBacks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
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
  const handleOpenPopup = () => {
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleSave = () => {
    console.log("Сохраняем стоимость карты:", cardCost);
    setShowPopup(false);
  };
  const handleDelete = async (id) => {
    try {
      await cardBackService.deleteCardBack(id);
      setCardBacks(cardBacks.filter((cb) => cb.id !== id));
    } catch (error) {
      console.error(error);
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
                <button
                  className={styles.cardButton}
                  onClick={() => handleDelete(cardBack.id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          <div
            className={styles.cardItem}
            style={{ cursor: "pointer" }}
            onClick={handleOpenPopup}
          >
            <div className={styles.cardItemImg}>
              <img src={addimg} alt="Добавить рубашку" />
            </div>
            <div className={styles.cardInfo}>
              <h3>Добавить рубашку</h3>
            </div>
          </div>
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
        </div>
      </div>
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>Добавление рубашки</h2>
            <div className={styles.popupMainContent}>
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
                      <button
                        className={styles.cardButton}
                        onClick={() =>
                          console.log("Выбрана рубашка:", cardBack)
                        }
                      >
                        Выбрать
                      </button>
                    </div>
                  ))}
              </div>
              <div className={styles.costInputContainer}>
                <input
                  type="number"
                  placeholder="Стоимость карты"
                  value={cardCost}
                  onChange={(e) => setCardCost(e.target.value)}
                  className={styles.costInput}
                />
              </div>
              <div className={styles.popupButtons}>
                <button onClick={handleSave} className={styles.saveButton}>
                  Сохранить
                </button>
                <button
                  onClick={handleClosePopup}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ShirtManagement;
export { routeShirtManagement };
