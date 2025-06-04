import React, { useState, useEffect } from "react";
import styles from "./AddEditShopSet.module.css";
import { useParams, useHistory } from "react-router-dom";
import routeAddEditShopSet from "./route";
import addimg from "assets/img/addimg.png";
import axios from "../../axios-controller";
import left from "assets/img/left.png";
import right from "assets/img/right.png";
import { cardsService } from "services/api";
const AddEditShopSet = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cards, setCards] = useState([]);
  const [showAddCards, setShowAddCards] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [cardsInSet, setCardsInSet] = useState(new Set());
  const [imageFile, setImageFile] = useState(null); // Инициализация состояния для файла изображения
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Получаем первый выбранный файл
    if (file) {
      setImageFile(file); // Обновляем состояние с новым файлом
    }
  };
  useEffect(() => {
    if (id) {
      const fetchSetData = async () => {
        try {
          const response = await axios.get(`/shop-sets/${id}`);
          const data = response.data;
          setName(data.name || "");
          setPrice(data.price || "");

          // Fetch cards in the set
          const cardsResponse = await axios.get(`/shop-sets/${id}/cards`);
          const setCards = cardsResponse.data;
          // Add cards to cardsInSet
          const cardIds = new Set(setCards.map((card) => card.id));
          setCardsInSet(cardIds);
        } catch (error) {
          console.error("Error fetching set data:", error);
        }
      };
      fetchSetData();
    }
  }, [id]);
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await cardsService.getAllCards();
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchCards();
  }, []);
  const handleAddCardToSet = (cardId) => {
    setCardsInSet((prev) => new Set([...prev, cardId]));
  };
  const handleRemoveCardFromSet = (cardId) => {
    setCardsInSet((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };
  const handleSubmit = async () => {
    try {
      // Проверяем минимальное количество карт
      if (cardsInSet.size < 3) {
        alert("Необходимо добавить минимум 3 карты в набор");
        return;
      }
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      // Convert cardsInSet Set to Array and append each cardId separately
      const cardIdsArray = Array.from(cardsInSet);
      cardIdsArray.forEach((cardId) => {
        formData.append("cardIds[]", cardId);
      });
      if (id) {
        await axios.put(`/shop-sets/${id}`, formData);
      } else {
        await axios.post("/shop-sets", formData);
      }
      history.push("/shop-management");
    } catch (error) {
      console.error("Error saving shop set:", error);
      alert("Error saving shop set");
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContents}>
        <div className={styles.content}>
          <div>
            <h3>Карты в наборе:</h3>
            <div className={styles.mainContent}>
              <img
                src={left}
                className={styles.arrow}
                onClick={() => {
                  currentSetIndex > 0 &&
                    setCurrentSetIndex(currentSetIndex - 1);
                }}
                alt="Previous"
              />
              {cards
                .filter((card) => cardsInSet.has(card.id))
                .slice(currentSetIndex, currentSetIndex + 3)
                .map((card) => (
                  <div key={card.id} className={styles.cardItem}>
                    <div className={styles.cardItemImg}>
                      <img
                        src={`https://api.zoomayor.io${card.image}`}
                        alt={card.title}
                      />
                    </div>
                    <div className={styles.cardInfo}>
                      <h3>{card.title}</h3>
                    </div>
                    <button
                      onClick={() => handleRemoveCardFromSet(card.id)}
                      style={{ background: "red" }}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              <div
                className={styles.whiteBox}
                onClick={() => setShowAddCards(!showAddCards)}
              >
                <div className={styles.whiteBoxImg}>
                  <img src={addimg} alt="#" style={{ height: "64px" }} />
                  <p>Добавьте карту</p>
                </div>
              </div>
              <img
                src={right}
                className={styles.arrow}
                onClick={() => {
                  const filteredCards = cards.filter((card) =>
                    cardsInSet.has(card.id)
                  );
                  currentSetIndex < filteredCards.length - 3 &&
                    setCurrentSetIndex(currentSetIndex + 1);
                }}
                alt="Next"
              />
            </div>
            {showAddCards && (
              <div>
                <h3>Добавить карты:</h3>
                <div className={styles.mainContent}>
                  <img
                    src={left}
                    className={styles.arrow}
                    onClick={() => {
                      currentAvailableIndex > 0 &&
                        setCurrentAvailableIndex(currentAvailableIndex - 1);
                    }}
                    alt="Previous"
                  />
                  {cards
                    .filter(
                      (card) =>
                        !cardsInSet.has(card.id) &&
                        card.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .slice(currentAvailableIndex, currentAvailableIndex + 3)
                    .map((card) => (
                      <div key={card.id} className={styles.cardItem}>
                        <div className={styles.cardItemImg}>
                          <img
                            src={`https://api.zoomayor.io${card.image}`}
                            alt={card.title}
                          />
                        </div>
                        <div className={styles.cardInfo}>
                          <h3>{card.title}</h3>
                        </div>
                        <button onClick={() => handleAddCardToSet(card.id)}>
                          Выбрать
                        </button>
                      </div>
                    ))}
                  <img
                    src={right}
                    className={styles.arrow}
                    onClick={() => {
                      const filteredCards = cards.filter(
                        (card) => !cardsInSet.has(card.id)
                      );
                      currentAvailableIndex < filteredCards.length - 3 &&
                        setCurrentAvailableIndex(currentAvailableIndex + 1);
                    }}
                    alt="Next"
                  />
                </div>
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
            )}
          </div>
          <div className={styles.inputContainer}>
            {" "}
            <div>
              <h2 className={styles.title}>Изображение набора</h2>
              <div className={styles.uploadButton}>
                <label htmlFor="fileInput" className={styles.customFileButton}>
                  <div className={styles.whiteBox}>
                    <div className={styles.whiteBoxImg}>
                      <img src={addimg} alt="#" />
                      <p>Добавьте изображение</p>
                    </div>
                  </div>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div style={{ marginRight: "20px" }}>
              <h2 className={styles.title}>Название</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <h2 className={styles.title}>Цена</h2>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <button className={styles.saveButton} onClick={handleSubmit}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { routeAddEditShopSet };
export default AddEditShopSet;
