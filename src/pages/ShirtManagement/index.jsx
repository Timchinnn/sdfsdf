import React, { useState, useEffect } from "react";
import styles from "./ShirtManagement.module.css";
import { cardBackService } from "services/api";
import routeShirtManagement from "./route";
const ShirtManagement = () => {
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [shirts, setShirts] = useState([]);
  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await cardBackService.getAllCardBacks();
        setShirts(response.data);
      } catch (error) {
        console.error("Error fetching shirts:", error);
      }
    };
    fetchShirts();
  }, []);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    try {
      await cardBackService.addCardBack(formData);
      const response = await cardBackService.getAllCardBacks();
      setShirts(response.data);
      setName("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await cardBackService.deleteCardBack(id);
      setShirts(shirts.filter((shirt) => shirt.id !== id));
    } catch (error) {
      console.error("Error deleting shirt:", error);
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div>
            <p>Фото</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <div>
            <p>Название</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className={styles.saveButton} onClick={handleSubmit}>
            Сохранить
          </button>
        </div>
        <div className={styles.shirtsList}>
          <h2>Существующие рубашки</h2>
          <div className={styles.shirtsGrid}>
            {shirts.map((shirt) => (
              <div key={shirt.id} className={styles.shirtItem}>
                <img
                  src={`https://api.zoomayor.io${shirt.image}`}
                  alt={shirt.name}
                />
                <p>{shirt.name}</p>
                <button
                  onClick={() => handleDelete(shirt.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShirtManagement;
export { routeShirtManagement };
