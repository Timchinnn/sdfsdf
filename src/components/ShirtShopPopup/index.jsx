import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";
import axios from "../../axios-controller";

const ShirtShopPopup = (props) => {
  console.log(props);
  const popupRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const { setActivePopup, onButtonClick } = props;
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        document.documentElement.classList.remove("fixed");
        setActivePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActivePopup]);
  const handleButtonClick = async () => {
    console.log(props);

    try {
      const tg = window.Telegram.WebApp;
      const telegram_id = tg.initDataUnsafe?.user?.id;
      if (!telegram_id) {
        console.error("Telegram ID not found");
        return;
      }
      // Проверяем, есть ли у пользователя уже эта рубашка
      const existingShirtResponse = await axios.get(
        `/user/${telegram_id}/shirts`
      );
      console.log(existingShirtResponse.data);
      if (
        existingShirtResponse.data.shirts.some(
          (shirt) => shirt.id === props.selectedPhoto.id
        )
      ) {
        alert("У вас уже есть такая рубашка");
        return;
      }
      const response = await axios.post("/shop/buy-shirt", {
        telegram_id,
        shirt_id: props.selectedPhoto.id,
        price: parseFloat(props.selectedPhoto.price).toFixed(2),
      });
      if (response.data.success) {
        if (props.handleClosePopup) {
          props.handleClosePopup();
        }
        if (onButtonClick) {
          onButtonClick();
        }
        // Показываем уведомление об успешной покупке
        tg.showPopup({
          title: "Успех!",
          message: "Рубашка успешно куплена",
          buttons: [{ type: "ok" }],
        });
      }
    } catch (error) {
      console.error("Error buying shirt:", error);
      // Показываем ошибку пользователю через Telegram popup
      const errorMessage =
        error.response?.data?.error || "Ошибка при покупке рубашки";
      window.Telegram.WebApp.showPopup({
        title: "Ошибка",
        message: errorMessage,
        buttons: [{ type: "ok" }],
      });
    }
  };
  return (
    <div ref={popupRef} className={`shop-popup ${props.active ? "show" : ""}`}>
      <div className="shop-popup__wrapper">
        <button
          type="button"
          className="shop-popup__close"
          onClick={props.handleClosePopup}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 512 512"
          >
            <path
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
              fill="#AAB2BD"
            />
          </svg>
        </button>
        <div className="shop-popup__inner">
          <div className="shop-popup__image">
            {showImage && (
              <img
                src={`https://api.zoomayor.io${props.selectedPhoto.image}`}
                alt={props.selectedPhoto?.name || ""}
              />
            )}
          </div>
          <div className="shop-popup__content">
            <h3 className="shop-popup__title">
              {props.selectedPhoto ? props.selectedPhoto.name : ""}
            </h3>
            <div className="shop-popup__params">
              <ul className="friends-params f-center-center">
                <li className="friends-params__item f-center">
                  <img src={CoinIcon} alt="Icon монет" />
                  {Math.floor(props.selectedPhoto.price)}
                </li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            className="shop-popup__btn"
            onClick={handleButtonClick}
          >
            {!props.main ? "Купить" : "Ок"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShirtShopPopup;
