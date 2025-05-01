import React, { useState } from "react";
import styles from "./ShirtManagement.module.css";
import axios from "services/axios-controller";
import routeShirtManagement from "./route";
import addimg from "assets/img/addimg.png";
const ShirtManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [shirtName, setShirtName] = useState("");
  const [shirtPrice, setShirtPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const handleAddButtonClick = () => {
    setIsFormVisible(true);
    setShirtName("");
    setShirtPrice("");
    setImageFile(null);
  };
  const handleCancel = () => {
    setIsFormVisible(false);
    setShirtName("");
    setShirtPrice("");
    setImageFile(null);
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleSave = async () => {
    if (!shirtName || !shirtPrice || !imageFile) {
      alert("Заполните все поля: название, цена и изображение");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", shirtName);
      formData.append("price", shirtPrice);
      formData.append("image", imageFile);
      const response = await axios.post("/api/shirts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Рубашка успешно создана:", response.data);
      alert("Рубашка успешно создана");
      setIsFormVisible(false);
      setShirtName("");
      setShirtPrice("");
      setImageFile(null);
    } catch (error) {
      console.error("Ошибка создания рубашки:", error);
      alert("Ошибка при создании рубашки");
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        {!isFormVisible && (
          <div className={styles.addButton} onClick={handleAddButtonClick}>
            <img src={addimg} alt="Добавить рубашку" />
            <p>Добавить рубашкуу</p>
          </div>
        )}
        {isFormVisible && (
          <>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Название рубашки"
                value={shirtName}
                onChange={(e) => setShirtName(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                type="number"
                placeholder="Цена рубашки"
                value={shirtPrice}
                onChange={(e) => setShirtPrice(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <input type="file" onChange={handleFileChange} />
            </div>
            <div className={styles.save}>
              <button className={styles.saveButton} onClick={handleSave}>
                Сохранить изменения
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Отмена
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ShirtManagement;
export { routeShirtManagement };
