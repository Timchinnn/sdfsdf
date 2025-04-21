import React, { useState, useEffect } from "react";
import styles from "./AddEditCardBack.module.css";
import routeAddEditCardBack from "./route";
import { cardBackService } from "services/api";
import { useHistory } from "react-router-dom";
const AddEditCardBack = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [cardBacks, setCardBacks] = useState([]);
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
      setCardBacks(response.data);
      setName("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      // Получаем информацию о пользователях с этой рубашкой
      const usersWithThisCardBack = await cardBackService.getUsersWithCardBack(
        id
      );

      // Удаляем рубашку
      await cardBackService.deleteCardBack(id);

      // Для каждого пользователя устанавливаем стоковую рубашку
      for (const user of usersWithThisCardBack) {
        await cardBackService.updateUserCardBack(user.telegram_id, {
          style: "default",
        });
      }

      setCardBacks(cardBacks.filter((cb) => cb.id !== id));
    } catch (error) {
      console.error("Error deleting card back:", error);
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
        <div className={styles.cardBacksList}>
          <h2>Существующие рубашки</h2>
          <div className={styles.cardBacksGrid}>
            {cardBacks.map((cardBack) => (
              <div key={cardBack.id} className={styles.cardBackItem}>
                <img
                  src={`https://api.zoomayor.io${cardBack.image}`}
                  alt={cardBack.name}
                />
                <p>{cardBack.name}</p>
                <button
                  onClick={() => handleDelete(cardBack.id)}
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
export { routeAddEditCardBack };
export default AddEditCardBack;
