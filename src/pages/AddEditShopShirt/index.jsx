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
  const [price, setPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (id) {
      const fetchShirt = async () => {
        try {
          const response = await axios.get(`/api/shop-shirts/${id}`);
          const shirt = response.data;
          setName(shirt.name);
          setPrice(shirt.price);
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      if (id) {
        await axios.put(`/api/shop-shirts/${id}`, formData);
      } else {
        await axios.post("/api/shop-shirts", formData);
      }
      history.push("/shop-management");
    } catch (error) {
      console.error("Error saving shirt:", error);
      alert(error.response?.data?.message || "Error saving shirt");
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
            <h2 className={styles.title}>Цена</h2>
            <input
              className={styles.inputCard}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
