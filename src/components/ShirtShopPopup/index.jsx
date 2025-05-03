import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";
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
    if (props.handleClosePopup) {
      try {
        const tg = window.Telegram.WebApp;
        const telegram_id = tg.initDataUnsafe?.user?.id;

        if (!telegram_id) {
          console.error("Telegram ID not found");
          return;
        }
        const response = await axios.post("/shop/buy-shirt", {
          telegram_id,
          shirt_id: props.selectedPhoto.id,
          price: props.selectedPhoto.price,
        });
        if (response.data.success) {
          props.handleClosePopup();
          if (onButtonClick) {
            onButtonClick();
          }
        }
      } catch (error) {
        console.error("Error buying shirt:", error);
        alert(error.response?.data?.message || "Error purchasing shirt");
      }
    }
  };
  return (
    <div ref={popupRef} className={`shop-popup ${props.active ? "show" : ""}`}>
      <div className="shop-popup__wrapper">
        <button
          type="button"
          className="shop-popup__close"
          onClick={handleButtonClick}
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
            onClick={() => {
              if (props.main) {
                handleButtonClick();
              } else {
                props.handleClosePopup();
              }
            }}
          >
            {!props.main ? "Купить" : "Ок"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShirtShopPopup;
