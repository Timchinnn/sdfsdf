import React, { useState, useEffect } from "react";
import styles from "./AddEditCard.module.css";
import routeAddEditCard from "./route";
import { cardsService } from "services/api";
import { useParams } from "react-router-dom";
import axios from "../../axios-controller";
import { useHistory } from "react-router-dom";
import addimg from "assets/img/addimg.png";

const AddEditCard = () => {
  const history = useHistory();
  const [chance, setChance] = useState("0");
  const [hourlyIncome, setHourlyIncome] = useState("0"); // Добавляем состояние для hourly_income
  const [cardType, setCardType] = useState("citizen");
  const [lowQualityImage, setLowQualityImage] = useState(null);

  const [cardSection, setCardSection] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [experience, setExperience] = useState("");
  const [energyBoost, setEnergyBoost] = useState("100"); // значение по умолчанию

  // const [image, setImage] = useState(null);
  const { id } = useParams(); // Добавить импорт useParams из react-router-dom
  useEffect(() => {
    const fetchCardData = async () => {
      if (id) {
        try {
          const response = await cardsService.getCard(id);
          const card = response.data;
          setCardResponse(response);
          setTitle(card.title || "");
          setDescription(card.description || "");
          setChance(card.chance !== undefined ? String(card.chance) : "0");
          setHourlyIncome(card.hourly_income || "0");
          setPrice(card.price || "");
          setExperience(card.experience || "");
          setCardType(card.type || "citizen");
          setCardSection(card.section || "");
          // Если карта типа energy_boost, присваиваем значение энергии из карточки
          if (card.type === "energy_boost") {
            setEnergyBoost(card.energy ? String(card.energy) : "100");
          }
        } catch (error) {
          console.error("Error fetching card:", error);
        }
      }
    };
    fetchCardData();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cardResponse, setCardResponse] = useState(null);
  useEffect(() => {
    if (id && cardResponse?.data?.image) {
      const imageUrl = `https://api.zoomayor.io${cardResponse.data.image}`;
      setImagePreview(imageUrl);
      setSelectedImage(null);
    }
  }, [id, cardResponse]);
  const handleLowQualityImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLowQualityImage(file);
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Очищаем предыдущий URL для предотвращения утечек памяти
      return () => URL.revokeObjectURL(previewUrl);
    }
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("chance", chance);
    formData.append("hourly_income", hourlyIncome);
    formData.append("price", price);
    formData.append("experience", experience);
    formData.append("type", cardType);
    if (cardType === "energy_boost") {
      formData.append("energy", energyBoost);
    }
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if (lowQualityImage) {
      formData.append("low_quality_image", lowQualityImage);
    }
    try {
      if (id) {
        await cardsService.updateCard(id, formData);
      } else {
        await cardsService.createCard(formData);
      }
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
            {imagePreview ? (
              <div className={styles.imagePreview}>
                <div
                  onClick={() => document.getElementById("fileInput").click()}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      imagePreview.startsWith("/img")
                        ? `https://api.zoomayor.io${imagePreview}`
                        : imagePreview
                    }
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
          {/* <div>
            {lowQualityImage ? (
              <div className={styles.imagePreview}>
                <div
                  onClick={() =>
                    document.getElementById("lowQualityFileInput").click()
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={URL.createObjectURL(lowQualityImage)}
                    alt="Preview"
                    style={{ maxWidth: "265px", borderRadius: "8px" }}
                  />
                </div>
                <input
                  id="lowQualityFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleLowQualityImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className={styles.uploadButton}>
                <label
                  htmlFor="lowQualityFileInput"
                  className={styles.customFileButton}
                >
                  <div className={styles.whiteBox}>
                    <div className={styles.whiteBoxImg}>
                      <img src={addimg} alt="#" />
                      <p>Добавьте изображение низкого качества</p>
                    </div>
                  </div>
                </label>
                <input
                  id="lowQualityFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleLowQualityImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div> */}
          <div>
            <h2 className={styles.title}>Название</h2>
            <input
              className={styles.inputCard}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />{" "}
            <h2 className={styles.title}>Вознаграждение</h2>
            <input
              className={styles.inputCard}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />{" "}
            <h2 className={styles.title}>Опыт</h2>
            <input
              className={styles.inputCard}
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />{" "}
            <h2 className={styles.title}>Шанс выпадения</h2>
            <input
              className={styles.inputCard}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={chance}
              onChange={(e) => {
                let value = e.target.value;
                // Разрешаем ввод только цифр, одной точки или запятой
                if (/^\d*[.,]?\d{0,2}$/.test(value)) {
                  // Заменяем запятую на точку для корректного сохранения
                  value = value.replace(",", ".");
                  setChance(value);
                }
              }}
            />
            <h2 className={styles.title}>Доход в час</h2>
            <input
              className={styles.inputCard}
              type="number"
              min="0"
              value={hourlyIncome}
              onChange={(e) => setHourlyIncome(e.target.value)}
            />
          </div>
          <div>
            <h2 className={styles.title}>Описание</h2>
            <textarea
              className={styles.describedCard}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание"
            />
            <h2 className={styles.title}>Тип карты</h2>
            <div>
              <label>
                <input
                  type="radio"
                  value="citizen"
                  checked={cardType === "citizen"}
                  onChange={(e) => setCardType(e.target.value)}
                />
                Житель
              </label>
              <label>
                <input
                  type="radio"
                  value="city"
                  checked={cardType === "city"}
                  onChange={(e) => setCardType(e.target.value)}
                />
                Город
              </label>
              <label>
                <input
                  type="radio"
                  value="energy_boost"
                  checked={cardType === "energy_boost"}
                  onChange={(e) => setCardType(e.target.value)}
                />
                Энергия
              </label>
            </div>
            {cardType === "energy_boost" && (
              <div>
                <h2 className={styles.title}>Начислять энергии</h2>
                <input
                  className={styles.inputCard}
                  type="number"
                  min="0"
                  max="1000"
                  value={energyBoost}
                  onChange={(e) => setEnergyBoost(e.target.value)}
                />
              </div>
            )}
            {/* Add section select based on card type */}
            <div>
              <h2 className={styles.title}>Раздел карты</h2>
              <select
                className={styles.chooseChapter}
                value={cardSection}
                onChange={(e) => setCardSection(e.target.value)}
              >
                <option value="">Выберите раздел</option>
                {cardType === "citizen" ? (
                  <>
                    <option value="police">Полиция</option>
                    <option value="firefighter">Пожарные</option>
                  </>
                ) : (
                  <>
                    <option value="culture">Культурные объекты</option>
                    <option value="trade">Торговые объекты</option>
                  </>
                )}
              </select>
            </div>
            <button className={styles.saveButton} onClick={handleSubmit}>
              Сохранить
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};
export { routeAddEditCard };

export default AddEditCard;
