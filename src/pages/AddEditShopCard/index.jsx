import React, { useState, useEffect } from "react";
import styles from "./AddEditShopCard.module.css";
import { useParams, useHistory } from "react-router-dom";
import addimg from "assets/img/addimg.png";
import axios from "../../axios-controller";
import routeAddEditShopCard from "./route";
import { cardsService } from "services/api";
import left from "assets/img/left.png";
import right from "assets/img/right.png";
const AddEditShopCard = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cards, setCards] = useState([]);
  const [showAddCards, setShowAddCards] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [cardsInSet, setCardsInSet] = useState(new Set());
  useEffect(() => {
    if (id) {
      const fetchCard = async () => {
        try {
          const response = await axios.get(`/cards/${id}`);
          const card = response.data;
          setName(card.name);
          setPrice(card.price);
          if (card.image_url) {
            setImagePreview(`https://api.zoomayor.io${card.image_url}`);
          }
        } catch (error) {
          console.error("Error fetching card:", error);
        }
      };
      fetchCard();
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
  const handleSelectCard = (card) => {
    setName(card.title);
    setImagePreview(`https://api.zoomayor.io${card.image}`);
    setSelectedImage(card.image); // Добавляем установку selectedImage
    setShowAddCards(false);
    setCardsInSet(new Set([...cardsInSet, card.id]));
  };
  const handleRemoveCard = (cardId) => {
    const newCardsInSet = new Set(cardsInSet);
    newCardsInSet.delete(cardId);
    setCardsInSet(newCardsInSet);
  };
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);

      // Add cardId if a card is selected
      if (cardsInSet.size > 0) {
        // Get the first (and only) card ID from the set
        const cardId = Array.from(cardsInSet)[0];
        formData.append("cardId", cardId);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      if (id) {
        await axios.put(`/shop-cards/${id}`, formData);
      } else {
        await axios.post("/shop-cards", formData);
      }
      history.push("/shopmanagement");
    } catch (error) {
      console.error("Error saving shop card1:", error);
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div>
            <h3>Карта для добавления в магазин:</h3>
            <div className={styles.mainContent}>
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
                      onClick={() => handleRemoveCard(card.id)}
                      style={{ background: "red" }}
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              {cards.filter((card) => cardsInSet.has(card.id)).length === 0 && (
                <div
                  className={styles.whiteBox}
                  onClick={() => setShowAddCards(!showAddCards)}
                >
                  <div className={styles.whiteBoxImg}>
                    <img src={addimg} alt="#" style={{ height: "64px" }} />
                    <p>Добавьте карту</p>
                  </div>
                </div>
              )}
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
                        <button onClick={() => handleSelectCard(card)}>
                          Выбрать
                        </button>
                      </div>
                    ))}
                  <img
                    src={right}
                    className={styles.arrow}
                    onClick={() => {
                      const filteredCards = cards.filter(
                        (card) =>
                          !cardsInSet.has(card.id) &&
                          card.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
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
            <div style={{ marginRight: "20px" }}>
              <h2 className={styles.title}>Цена</h2>
              <input
                type="text"
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
export default AddEditShopCard;
export { routeAddEditShopCard };
