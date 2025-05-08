import React, { useState, useEffect } from "react";
import styles from "./AddEditShopShirt.module.css";
import { useParams, useHistory } from "react-router-dom";
import addimg from "assets/img/addimg.png";
import axios from "../../axios-controller";
import routeAddEditShopShirt from "./route";

const AddEditShopShirt = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (id) {
      const fetchShirt = async () => {
        try {
          const response = await axios.get(`/shop-shirts/${id}`);
          const shirt = response.data;
          setName(shirt.name);
          if (shirt.image_url) {
            setImagePreview(`https://api.zoomayor.io${shirt.image_url}`);
          }
        } catch (error) {
          console.error("Error fetching shirt:", error);
        }
      };
      fetchShirt();
    }
  }, [id]);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  const handleSubmit = async () => {
    try {
      // Валидация входных данных
      if (!name.trim()) {
        throw new Error("Название рубашки обязательно");
      }
      if (!selectedImage && !id) {
        throw new Error("Изображение обязательно для новой рубашки");
      }
      const formData = new FormData();
      formData.append("name", name.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      if (id) {
        await axios.put(`/shop-shirts/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("/shop-shirts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      history.push("/shop-management");
    } catch (error) {
      console.error("Error saving shirt:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ошибка при сохранении рубашки";
      alert(errorMessage);
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div>
            {imagePreview ? (
              <div className={styles.imagePreview}>
                <div
                  onClick={() => document.getElementById("fileInput").click()}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "265px", borderRadius: "8px" }}
                  />
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className={styles.uploadButton}>
                <label htmlFor="fileInput" className={styles.customFileButton}>
                  <div className={styles.whiteBox}>
                    <div className={styles.whiteBoxImg}>
                      <img src={addimg} alt="#" />
                      <p>Добавьте изображение</p>
                    </div>
                  </div>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
          <div>
            <h2 className={styles.title}>Название</h2>
            <input
              className={styles.inputCard}
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
export default AddEditShopShirt;
export { routeAddEditShopShirt };
