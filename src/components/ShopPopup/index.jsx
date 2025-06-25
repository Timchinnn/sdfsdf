import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import QuestionMarkImg from "assets/img/question-mark.png";
import StarIcon from "assets/img/star-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";
import { useSelector } from "react-redux";
const ShopPopup = (props) => {
  const popupRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const imageQuality = useSelector((state) => state.imageQuality);

  useEffect(() => {
    // Измеряем время ответа сервера при загрузке компонента
    const measureResponseTime = async () => {
      const startTime = performance.now();
      try {
        const response = await fetch("https://api.zoomayor.io/api/cards");
        const endTime = performance.now();
        const time = endTime - startTime;
        setResponseTime(time);
      } catch (error) {
        console.error("Ошибка при измерении времени ответа:", error);
      }
    };
    measureResponseTime();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const { setActivePopup, onButtonClick } = props; // Добавляем onButtonClick в props

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

  const handleButtonClick = () => {
    if (props.handleClosePopup) {
      props.handleClosePopup();
    }
    if (onButtonClick) {
      onButtonClick(); // Вызываем callback при клике на кнопку
    }
  };

  useEffect(() => {
    if (props.selectedPhoto && props.selectedPhoto.image === QuestionMarkImg) {
      console.log(QuestionMarkImg);
    }
  }, [props.selectedPhoto]);

  // Функция для определения URL изображения с учетом качества
  const getImageUrl = () => {
    if (!props.selectedPhoto) return DefaultImg;

    // Если это специальное изображение или локальное изображение
    if (
      props.selectedPhoto.id === "set" ||
      props.selectedPhoto.id === "energy" ||
      props.selectedPhoto.id === "money" ||
      props.selectedPhoto.image === QuestionMarkImg
    ) {
      return props.selectedPhoto.image;
    }

    // Проверяем настройки качества изображений
    if (imageQuality === "high") {
      // Всегда высокое качество
      return `https://api.zoomayor.io${props.selectedPhoto.image}`;
    } else if (imageQuality === "low") {
      // Всегда низкое качество
      const hasExtension = /\.[^.]+$/.test(props.selectedPhoto.image);
      return `https://api.zoomayor.io${
        hasExtension
          ? props.selectedPhoto.image.replace(/(\.[^.]+)$/, "bad$1")
          : props.selectedPhoto.image + "bad.webp"
      }`;
    } else {
      // Автоматический режим - зависит от времени ответа
      if (responseTime > 300) {
        const hasExtension = /\.[^.]+$/.test(props.selectedPhoto.image);
        return `https://api.zoomayor.io${
          hasExtension
            ? props.selectedPhoto.image.replace(/(\.[^.]+)$/, "bad$1")
            : props.selectedPhoto.image + "bad.webp"
        }`;
      } else {
        return `https://api.zoomayor.io${props.selectedPhoto.image}`;
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
              <img src={getImageUrl()} alt={props.selectedPhoto?.title || ""} />
            )}
          </div>
          <div className="shop-popup__content">
            {props.selectedPhoto &&
            props.selectedPhoto.image === QuestionMarkImg ? (
              <h3 className="shop-popup__title">Карта не открыта</h3>
            ) : (
              <>
                <h3 className="shop-popup__title">
                  {props.selectedPhoto ? props.selectedPhoto.title : ""}
                </h3>
                <p className="shop-popup__text">
                  {props.selectedPhoto ? props.selectedPhoto.description : ""}
                  {props.selectedPhoto &&
                    props.selectedPhoto.type === "energy_boost" && (
                      <span style={{ marginLeft: "5px" }}>
                        ⚡ {props.selectedPhoto.energy || 100}
                      </span>
                    )}
                </p>
                <div className="shop-popup__earn">
                  <div className="main-params__card f-center-center">
                    <div className="main-params__icon f-center-center">
                      <img src={TimeIcon} alt="" />
                    </div>
                    <p className="main-params__title">
                      {props.selectedPhoto?.hourly_income
                        ? typeof props.selectedPhoto.hourly_income === "number"
                          ? props.selectedPhoto.hourly_income.toFixed(2)
                          : props.selectedPhoto.hourly_income
                        : "0.00"}{" "}
                      K/H
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          {props.selectedPhoto &&
            props.selectedPhoto.image !== QuestionMarkImg && (
              <div className="shop-popup__params">
                <ul className="friends-params f-center-center">
                  <li className="friends-params__item f-center">
                    <img src={StarIcon} alt="" />
                    {props.selectedPhoto ? props.selectedPhoto.experience : ""}
                  </li>
                  <li className="friends-params__item f-center">
                    <img src={CoinIcon} alt="" />
                    {props.selectedPhoto ? props.selectedPhoto.price : ""}
                  </li>
                </ul>
              </div>
            )}
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
export default ShopPopup;
