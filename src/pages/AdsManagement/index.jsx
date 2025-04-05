import React, { useState, useEffect } from "react";
import styles from "./AdsManagement.module.css";
import axios from "../../axios-controller";
import routeAdsManagement from "./route";

const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    fetchAds();
  }, []);
  const fetchAds = async () => {
    try {
      const response = await axios.get("/api/ads");
      setAds(response.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
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
    formData.append("reward", reward);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    try {
      await axios.post("/api/ads", formData);
      fetchAds();
      setTitle("");
      setDescription("");
      setReward("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/ads/${id}`);
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
          <label>Награда:</label>
          <input
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            required
          />
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
              <p>Награда: {ad.reward}</p>
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
