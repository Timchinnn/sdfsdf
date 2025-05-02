import React, { useState, useEffect } from "react";
import styles from "./AddEditShopSet.module.css";
import { useParams, useHistory } from "react-router-dom";
import routeAddEditShopSet from "./route";
import addimg from "assets/img/addimg.png";
import axios from "../../axios-controller";
import left from "assets/img/left.png";
import right from "assets/img/right.png";
const AddEditShopSet = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cards, setCards] = useState([]);
  const [showAddCards, setShowAddCards] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [cardsInSet, setCardsInSet] = useState(new Set());
  useEffect(() => {
    if (id) {
      const fetchSetData = async () => {
        try {
          const response = await axios.get(`/shop-sets/${id}`);
          const data = response.data;
          setName(data.name || "");
          setPrice(data.price || "");
          if (data.image_url) {
            setImagePreview(`https://api.zoomayor.io${data.image_url}`);
          }
        } catch (error) {
          console.error("Error fetching set");
        }
      };
      fetchSetData();
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
  const handleAddCardToSet = (cardId) => {
    setCardsInSet((prev) => new Set([...prev, cardId]));
  };
  const handleRemoveCardFromSet = (cardId) => {
    setCardsInSet((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
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
        await axios.put(`/shop-sets/${id}`, formData);
      } else {
        await axios.post("/shop-sets", formData);
      }
      history.push("/shop-management");
    } catch (error) {
      console.error("Error saving shop set:", error);
      alert("Error saving shop set");
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
            <div style={{ marginRight: "20px" }}>
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
export { routeAddEditShopSet };
export default AddEditShopSet;
