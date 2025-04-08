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
  const [rewardType, setRewardType] = useState("coins"); // coins, card, energy, experience
  const [selectedRewards, setSelectedRewards] = useState([]);

  const [rewardValue, setRewardValue] = useState("");
  const [rewardCardId, setRewardCardId] = useState("");
  const [rewardEnergy, setRewardEnergy] = useState("");
  const [rewardExperience, setRewardExperience] = useState("");
  const [cards, setCards] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
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
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("reward_type", rewardType);
    selectedRewards.forEach((reward, index) => {
      formData.append(`rewards[${index}][type]`, reward.type);
      formData.append(`rewards[${index}][value]`, reward.value);
    });
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    try {
      await adsService.createAd(formData);
      fetchAds();
      resetForm();
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };
  const handleRewardSelection = (type, value) => {
    const reward = { type, value };
    const exists = selectedRewards.some((r) => r.type === type);

    if (exists) {
      setSelectedRewards(selectedRewards.filter((r) => r.type !== type));
    } else {
      setSelectedRewards([...selectedRewards, reward]);
    }
  };
  const isRewardSelected = (type) => {
    return selectedRewards.some((r) => r.type === type);
  };
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRewardType("coins");
    setRewardValue("");
    setRewardCardId("");
    setRewardEnergy("");
    setRewardExperience("");
    setSelectedImage(null);
  };
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
          <label>Тип вознаграждения:</label>
          <select
            value={rewardType}
            onChange={(e) => setRewardType(e.target.value)}
          >
            <option value="coins">Монеты</option>
            <option value="card">Карта</option>
            <option value="energy">Энергия</option>
            <option value="experience">Опыт</option>
          </select>
        </div>
        {rewardType === "coins" && (
          <div className={styles.formGroup}>
            <label>Количество монет:</label>
            <input
              type="number"
              value={rewardValue}
              onChange={(e) => setRewardValue(e.target.value)}
              required
            />
          </div>
        )}
        {rewardType === "card" && (
          <div className={styles.formGroup}>
            <label>Выберите карту:</label>
            <select
              value={rewardCardId}
              onChange={(e) => setRewardCardId(e.target.value)}
              required
            >
              <option value="">Выберите карту</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title}
                </option>
              ))}
            </select>
          </div>
        )}
        {rewardType === "energy" && (
          <div className={styles.formGroup}>
            <label>Количество энергии:</label>
            <input
              type="number"
              value={rewardEnergy}
              onChange={(e) => setRewardEnergy(e.target.value)}
              required
            />
          </div>
        )}
        {rewardType === "experience" && (
          <div className={styles.formGroup}>
            <label>Количество опыта:</label>
            <input
              type="number"
              value={rewardExperience}
              onChange={(e) => setRewardExperience(e.target.value)}
              required
            />
          </div>
        )}
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
              <div className={styles.rewardsList}>
                {ad.rewards &&
                  ad.rewards.map((reward, index) => (
                    <p key={index} className={styles.rewardItem}>
                      {reward.type === "coins" && `${reward.value} монет`}
                      {reward.type === "card" &&
                        `Карта: ${
                          cards.find((c) => c.id === reward.value)?.title ||
                          reward.value
                        }`}
                      {reward.type === "energy" && `${reward.value} энергии`}
                      {reward.type === "experience" && `${reward.value} опыта`}
                    </p>
                  ))}
              </div>
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
