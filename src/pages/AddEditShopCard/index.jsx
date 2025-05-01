import React, { useState, useEffect } from "react";
import styles from "./AddEditShopCard.module.css";
import { useParams, useHistory } from "react-router-dom";
import addimg from "assets/img/addimg.png";
import axios from "../../axios-controller";
import routeAddEditShopCard from "./route";

const AddEditShopCard = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (id) {
      const fetchCard = async () => {
        try {
          const response = await axios.get(`/cards/${id}`);
          const card = response.data;
          setName(card.name);
          setPrice(card.price);
          if (card.image_url) {
            setImagePreview(`https://api.zoomayor.io${card.image_url}`);
          }
        } catch (error) {
          console.error("Error fetching card:", error);
        }
      };
      fetchCard();
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
        await axios.put(`/cards/${id}`, formData);
      } else {
        await axios.post("/cards", formData);
      }

      history.push("/shopmanagement");
    } catch (error) {
      console.error("Error saving card:", error);
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
          <div className={styles.inputContainer}>
            <div>
              <h2 className={styles.title}>Название</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <h2 className={styles.title}>Цена</h2>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <button className={styles.saveButton} onClick={handleSubmit}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddEditShopCard;
export { routeAddEditShopCard };
