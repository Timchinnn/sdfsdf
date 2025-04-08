import React, { useState, useEffect } from "react";
import styles from "./AdsManagement.module.css";
import axios from "../../axios-controller";
import routeAdsManagement from "./route";
import { adsService } from "../../services/api";
import { cardsService } from "../../services/api";
const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [rewardType, setRewardType] = useState("coins"); // coins, card, energy, experience

  // const [rewardValue, setRewardValue] = useState("");
  // const [rewardCardId, setRewardCardId] = useState("");
  // const [rewardEnergy, setRewardEnergy] = useState("");
  // const [rewardExperience, setRewardExperience] = useState("");
  const [cards, setCards] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [rewards, setRewards] = useState([]);

  const [selectedRewardTypes, setSelectedRewardTypes] = useState({
    coins: false,
    card: false,
    energy: false,
    experience: false,
  });
  const [rewardValues, setRewardValues] = useState({
    coins: "",
    card: "",
    energy: "",
    experience: "",
  });
  console.log(8);
  useEffect(() => {
    fetchAds();
    fetchCards();
  }, []);
  const fetchAds = async () => {
    try {
      const response = await adsService.getAllAds();
      setAds(response.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };
  const fetchCards = async () => {
    try {
      const response = await cardsService.getAllCards();
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };
  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      // Собираем все выбранные награды
      const selectedRewards = [];

      // Проверяем каждый тип награды и добавляем, если он выбран
      Object.entries(selectedRewardTypes).forEach(([type, isSelected]) => {
        if (isSelected && rewardValues[type]) {
          selectedRewards.push({
            type: type,
            value: parseInt(rewardValues[type]),
          });
        }
      });
      // Проверяем, что хотя бы одна награда выбрана
      if (selectedRewards.length === 0) {
        alert("Выберите хотя бы одну награду");
        return;
      }
      formData.append("rewards", JSON.stringify(selectedRewards));

      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      const response = await adsService.createAd(formData);
      console.log("Ответ сервера:", response);

      await fetchAds();
      // resetForm();
    } catch (error) {
      console.error("Ошибка при создании рекламы:", error);
      alert(
        "Произошла ошибка при создании рекламы: " +
          (error.message || "Неизвестная ошибка")
      );
    }
  };
  const renderRewards = (ad) => {
    if (!ad.reward_types || !ad.reward_values) return "Нет наград";

    return ad.reward_types
      .map((type, index) => {
        const value = ad.reward_values[index];
        switch (type) {
          case "coins":
            return `${value} монет`;
          case "card":
            const card = cards.find((c) => c.id === value);
            return card ? `Карта: ${card.title}` : "Неизвестная карта";
          case "energy":
            return `${value} энергии`;
          case "experience":
            return `${value} опыта`;
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");
  };
  // const resetForm = () => {
  //   setTitle("");
  //   setDescription("");
  //   setRewardType("coins");
  //   setRewardValue("");
  //   setRewardCardId("");
  //   setRewardEnergy("");
  //   setRewardExperience("");
  //   setSelectedImage(null);
  // };
  const handleDelete = async (id) => {
    try {
      await adsService.deleteAd(id);
      fetchAds();
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };
  return (
    <div className={styles.container}>
      <h2>Управление рекламой</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Заголовок:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Награды:</label>
          <div className={styles.rewardsContainer}>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={selectedRewardTypes.coins}
                onChange={(e) =>
                  setSelectedRewardTypes({
                    ...selectedRewardTypes,
                    coins: e.target.checked,
                  })
                }
              />
              <label>Монеты:</label>
              <input
                type="number"
                value={rewardValues.coins}
                onChange={(e) =>
                  setRewardValues({
                    ...rewardValues,
                    coins: e.target.value,
                  })
                }
                disabled={!selectedRewardTypes.coins}
              />
            </div>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={selectedRewardTypes.card}
                onChange={(e) =>
                  setSelectedRewardTypes({
                    ...selectedRewardTypes,
                    card: e.target.checked,
                  })
                }
              />
              <label>Карта:</label>
              <select
                value={rewardValues.card}
                onChange={(e) =>
                  setRewardValues({
                    ...rewardValues,
                    card: e.target.value,
                  })
                }
                disabled={!selectedRewardTypes.card}
              >
                <option value="">Выберите карту</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={selectedRewardTypes.energy}
                onChange={(e) =>
                  setSelectedRewardTypes({
                    ...selectedRewardTypes,
                    energy: e.target.checked,
                  })
                }
              />
              <label>Энергия:</label>
              <input
                type="number"
                value={rewardValues.energy}
                onChange={(e) =>
                  setRewardValues({
                    ...rewardValues,
                    energy: e.target.value,
                  })
                }
                disabled={!selectedRewardTypes.energy}
              />
            </div>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={selectedRewardTypes.experience}
                onChange={(e) =>
                  setSelectedRewardTypes({
                    ...selectedRewardTypes,
                    experience: e.target.checked,
                  })
                }
              />
              <label>Опыт:</label>
              <input
                type="number"
                value={rewardValues.experience}
                onChange={(e) =>
                  setRewardValues({
                    ...rewardValues,
                    experience: e.target.value,
                  })
                }
                disabled={!selectedRewardTypes.experience}
              />
            </div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Изображение:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <button type="submit" className={styles.submitButton}>
          Добавить рекламу
        </button>
      </form>
      <div className={styles.adsList}>
        {ads.map((ad) => (
          <div key={ad.id} className={styles.adItem}>
            <div className={styles.adContent}>
              <h3>{ad.title}</h3>
              <p>{ad.description}</p>
              <p>Награды: {renderRewards(ad)}</p>
              {ad.image_url && (
                <img
                  src={`https://api.zoomayor.io${ad.image_url}`}
                  alt={ad.title}
                  className={styles.adImage}
                />
              )}
            </div>
            <button
              onClick={() => handleDelete(ad.id)}
              className={styles.deleteButton}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export { routeAdsManagement };

export default AdsManagement;
