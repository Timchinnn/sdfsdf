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
      console.log(response.data);
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
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        alert("Размер файла не должен превышать 5MB");
        return;
      }
      setSelectedImage(file);
    }
  };
  const handleSubmit = async (e) => {
    console.log(selectedImage);
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    // Добавляем награды в formData
    if (selectedRewardTypes.coins) {
      formData.append("reward_type", "coins");
      formData.append("reward_value", rewardValues.coins);
    }
    if (selectedRewardTypes.card) {
      formData.append("reward_type", "card");
      formData.append("reward_card_id", rewardValues.card);
    }
    if (selectedRewardTypes.energy) {
      formData.append("reward_type", "energy");
      formData.append("reward_energy", rewardValues.energy);
    }
    if (selectedRewardTypes.experience) {
      formData.append("reward_type", "experience");
      formData.append("reward_experience", rewardValues.experience);
    }
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    try {
      await adsService.createAd(formData);
      fetchAds();
      // Очищаем форму
      setTitle("");
      setDescription("");
      setSelectedRewardTypes({
        coins: false,
        card: false,
        energy: false,
        experience: false,
      });
      setRewardValues({
        coins: "",
        card: "",
        energy: "",
        experience: "",
      });
      setSelectedImage(null);
    } catch (error) {
      console.error("Error creating ad:", error);
    }
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
  const [testUserId, setTestUserId] = useState("");
  const [testStatus, setTestStatus] = useState(null);
  // Функция тестирования награды
  const testAdReward = async (adId) => {
    if (!testUserId) {
      alert("Введите Telegram ID пользователя для тестирования");
      return;
    }
    try {
      setTestStatus({ loading: true });
      const response = await adsService.testReward(testUserId, adId);

      if (response.data.success) {
        const rewards = response.data.rewards;
        setTestStatus({
          success: true,
          message: `Награды начислены:
            ${rewards.coins ? `\nМонеты: ${rewards.coins}` : ""}
            ${rewards.cardId ? `\nКарта ID: ${rewards.cardId}` : ""}
            ${rewards.energy ? `\nЭнергия: ${rewards.energy}` : ""}
            ${rewards.experience ? `\nОпыт: ${rewards.experience}` : ""}`,
        });
      }
    } catch (error) {
      setTestStatus({
        success: false,
        message: `Ошибка: ${error.response?.data?.error || error.message}`,
      });
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
              <div className={styles.rewardInfo}>
                {ad.reward_value && <p>Монеты: {ad.reward_value}</p>}
                {ad.reward_card_id && <p>Карта ID: {ad.reward_card_id}</p>}
                {ad.reward_energy && <p>Энергия: {ad.reward_energy}</p>}
                {ad.reward_experience && <p>Опыт: {ad.reward_experience}</p>}
              </div>{" "}
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
