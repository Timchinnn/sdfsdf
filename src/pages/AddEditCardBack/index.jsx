import React, { useState } from "react";
import styles from "./AddEditCardBack.module.css";
import routeAddEditCardBack from "./route";
import { cardBackService } from "services/api";
import { useHistory } from "react-router-dom";
const AddEditCardBack = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
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
      history.push("/cardmanagement");
    } catch (error) {
      console.error("Error:", error);
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
      </div>
    </div>
  );
};
export { routeAddEditCardBack };
export default AddEditCardBack;
