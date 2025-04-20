import React, { useState } from "react";
import styles from "./AddEditCardBack.module.css";
import routeAddEditCardBack from "./route";
import { cardBackService } from "services/api";
import { useHistory } from "react-router-dom";
const AddEditCardBack = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла не должен превышать 5MB");
        return;
      }
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Пожалуйста, введите название");
      return;
    }
    if (!selectedImage) {
      alert("Пожалуйста, выберите изображение");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", selectedImage);
    try {
      await cardBackService.addCardBack(formData);
      history.push("/cardmanagement");
    } catch (error) {
      console.error("Erro1r:", error);
      alert(error.response?.data?.error || "Произошла ошибка при сохранении");
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div>
            <p>Фото</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          <div>
            <p>Название</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button className={styles.saveButton} onClick={handleSubmit}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddEditCardBack;
