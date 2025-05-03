import React, { useEffect, useState } from "react";
import styles from "./CardShopPopup.module.css";
import CoinIcon from "assets/img/coin-icon.svg";
import StarIcon from "assets/img/star-icon.svg";
const CardShopPopup = ({ card, onClose }) => {
  const [cardData, setCardData] = useState(null);
  useEffect(() => {
    if (card && card.card_id) {
      // Fetch card details using the card_id
      fetch(`https://api.zoomayor.io/api/cards/${card.card_id}`)
        .then((response) => response.json())
        .then((data) => {
          setCardData(data);
        })
        .catch((error) => {
          console.error("Error fetching card details:", error);
        });
    }
  }, [card]);
  if (!cardData) {
    return null;
  }
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.cardImage}>
          <img
            src={`https://api.zoomayor.io${cardData.image}`}
            alt={cardData.title}
          />
        </div>
        <div className={styles.cardInfo}>
          <h2>{cardData.title}</h2>
          <p>{cardData.description}</p>

          <div className={styles.cardStats}>
            <div className={styles.stat}>
              <img src={CoinIcon} alt="Price" />
              <span>{card.price}</span>
            </div>
            {cardData.experience && (
              <div className={styles.stat}>
                <img src={StarIcon} alt="Experience" />
                <span>{cardData.experience}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardShopPopup;
