import React, { useState, useEffect } from "react";
import styles from "./ShirtManagement.module.css";
import { shopShirtService } from "services/api";
import axios from "../../axios-controller";
import routeShirtManagement from "./route";
import addimg from "assets/img/addimg.png";
const ShirtManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardBacks, setCardBacks] = useState([]);
  const [isSelectionVisible, setIsSelectionVisible] = useState(false);
  const [cardCost, setCardCost] = useState("");
  const [selectedShirt, setSelectedShirt] = useState(null);
  useEffect(() => {
    shopShirtService
      .getAllShopShirts()
      .then((response) => setCardBacks(response.data))
      .catch((error) => console.error("Ошибка получения рубашек:", error));
  }, []);
  const handleAddButtonClick = () => {
    setIsSelectionVisible(true);
    setSelectedShirt(null);
  };
  const handleCancel = () => {
    setIsSelectionVisible(false);
    setSelectedShirt(null);
  };
  const handleSelectShirt = (shirt) => {
    setSelectedShirt(shirt);
    setIsSelectionVisible(false);
  };
  const handleSave = async () => {
    if (!selectedShirt || !cardCost) {
      alert("Выберите рубашку и заполните цену!");
      return;
    }
    try {
      const payload = {
        name: selectedShirt.name,
        price: cardCost,
        imageUrl: selectedShirt.image_url,
      };
      const response = await axios.post("/shirts", payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Рубашка успешно добавлена в магазин");

      // Reset all state variables to initial values
      setIsSelectionVisible(false);
      setSelectedShirt(null);
      setCardCost("");
      setSearchQuery("");
    } catch (error) {
      console.error("Ошибка при добавлении рубашки:", error);
      alert(
        error.response?.data?.message ||
          "Рубашка с таким названием уже существует"
      );
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        {!isSelectionVisible && !selectedShirt && (
          <div className={styles.addButton} onClick={handleAddButtonClick}>
            <img src={addimg} alt="Добавить рубашку" />
            <p>Добавить рубашку</p>
          </div>
        )}
        {(isSelectionVisible || selectedShirt) && (
          <>
            {selectedShirt ? (
              <div className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img
                    src={`https://api.zoomayor.io${selectedShirt.image_url}`}
                    alt={selectedShirt.name}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{selectedShirt.name}</h3>
                </div>
              </div>
            ) : (
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
                            src={`https://api.zoomayor.io${cb.image_url}`}
                            alt={cb.name}
                          />
                        </div>
                        <div className={styles.cardInfo}>
                          <h3>{cb.name}</h3>
                        </div>
                        <button
                          className={styles.addCardButton}
                          onClick={() => handleSelectShirt(cb)}
                        >
                          Добавить
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
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
