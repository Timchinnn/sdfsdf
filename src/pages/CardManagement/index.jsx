import React, { useState, useEffect } from "react";
import styles from "./CardManagement.module.css";
import routeCardManagement from "./route";
import { cardsService } from "services/api";
import { cardBackService, cardSetsService } from "services/api";
import { NavLink } from "react-router-dom";
import { routeAddEditCard } from "pages/AddEditCard";
import { routeAddEditDeck } from "pages/AddEditDeck";
import { routeAddEditCardBack } from "pages/AddEditCardBack";
// import { routeAddEditDeck } from "pages/AddEditCard";
import axios from "../../axios-controller";
const CardManagement = () => {
  const [cardBacks, setCardBacks] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardSets, setCardSets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [setsSearchQuery, setSetsSearchQuery] = useState("");

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
  useEffect(() => {
    const fetchCardSets = async () => {
      try {
        const response = await axios.get("/card-sets");
        setCardSets(response.data);
      } catch (error) {
        console.error("Error fetching card sets:", error);
      }
    };
    fetchCardSets();
  }, []);
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await cardsService.getAllCards();
        console.log(response.data);
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchCards();
  }, []);
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <h2>Карты жителей</h2>
        <div className={styles.cardsList}>
          {cards
            .filter((card) =>
              card.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((card) => (
              <div key={card.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  {" "}
                  <img src={`${card.image}`} alt={card.title} />
                </div>
                <div className={styles.cardInfo}>
                  {" "}
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>{" "}
                </div>

                <NavLink to={routeAddEditCard(card.id)}>
                  <button>Редактировать</button>
                </NavLink>
                <button
                  style={{ background: "red", marginTop: "10px" }}
                  onClick={async () => {
                    try {
                      await cardsService.deleteCard(card.id);
                      setCards(cards.filter((c) => c.id !== card.id));
                    } catch (error) {
                      console.error("Error deleting card:", error);
                    }
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
              placeholder="Поиск по названию карты"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button
              className={styles.searchButton}
              style={{
                background: "green",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
                padding: "8px 16px",
              }}
              onClick={() => setSearchQuery(searchQuery)}
            >
              Поиск
            </button>
          </div>{" "}
          <div>
            <NavLink to={routeAddEditCard()} style={{ width: "40%" }}>
              <button
                className={styles.addCard}
                style={{
                  background: "green",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "8px 16px",
                }}
              >
                Добавить карту
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <h2>Наборы карт жители</h2>
        <div className={styles.cardsList}>
          {cardSets
            .filter((set) =>
              set.name.toLowerCase().includes(setsSearchQuery.toLowerCase())
            )
            .map((set) => (
              <div key={set.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img src={`${set.image}`} alt={set.name} />
                </div>
                <div className={styles.cardInfo}>
                  {" "}
                  <h3>{set.name}</h3>
                  <p>{set.description}</p>
                </div>

                <NavLink to={routeAddEditDeck(set.id)}>
                  <button>Редактировать</button>
                </NavLink>
                <button
                  style={{ background: "red", marginTop: "10px" }}
                  onClick={async () => {
                    try {
                      await cardSetsService.deleteCardSet(set.id);
                      setCardSets(cardSets.filter((cs) => cs.id !== set.id));
                    } catch (error) {
                      console.error("Error deleting card set:", error);
                    }
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
              placeholder="Поиск по названию карты"
              value={setsSearchQuery}
              onChange={(e) => setSetsSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button
              className={styles.searchButton}
              style={{
                background: "green",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
                padding: "8px 16px",
              }}
              onClick={() => setSearchQuery(searchQuery)}
            >
              Поиск
            </button>
          </div>{" "}
          <div>
            <NavLink to={routeAddEditDeck()} style={{ width: "40%" }}>
              <button
                className={styles.addCard}
                style={{
                  background: "green",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "8px 16px",
                }}
              >
                Добавить набор
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        {" "}
        <h2>Рубашки карт</h2>
        <div className={styles.cardsList}>
          {cardBacks.map((cardBack) => (
            <div
              key={cardBack.id}
              className={styles.cardItem}
              style={{ height: "228px" }}
            >
              <div className={styles.cardItemImg}>
                <img src={`${cardBack.image}`} alt="" />
              </div>

              <button
                style={{ background: "red" }}
                onClick={async () => {
                  try {
                    await cardBackService.deleteCardBack(cardBack.id);
                    setCardBacks(
                      cardBacks.filter((cb) => cb.id !== cardBack.id)
                    );
                  } catch (error) {
                    console.error("Error deleting card back:", error);
                  }
                }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        <div className={styles.addCart}>
          <NavLink to={routeAddEditCardBack()} style={{ width: "40%" }}>
            <button>Добавить рубашку</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export { routeCardManagement };

export default CardManagement;
