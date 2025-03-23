import React, { useEffect, useRef } from "react";

import "./styles.scss";

import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import QuestionMarkImg from "assets/img/question-mark.png";

import StarIcon from "assets/img/star-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";

const ShopPopup = (props) => {
  const popupRef = useRef(null);

  const { setActivePopup, onButtonClick } = props; // Добавляем onButtonClick в props
  console.log(props);

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
      console.log("Image matches QuestionMarkImg");
      console.log(props.selectedPhoto.image);
      console.log(QuestionMarkImg);
    }
  }, [props.selectedPhoto]);
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
            {/* <img
              src={
                props.selectedPhoto
                  ? `${props.selectedPhoto.image}`
                  : DefaultImg
              }
              alt={props.selectedPhoto?.title || ""}
            /> */}
            {/* <img
              src={
                item.id === "set" || item.id === "energy" || item.id === "money"
                  ? item.image
                  : `${item.image}`
              }
              alt=""
              className="shop-card__Img"
            /> */}
            <img
              src={
                props.selectedPhoto
                  ? props.selectedPhoto.id === "set" ||
                    props.selectedPhoto.id === "energy" ||
                    props.selectedPhoto.id === "money" ||
                    props.selectedPhoto.image === QuestionMarkImg
                    ? props.selectedPhoto.image
                    : `${props.selectedPhoto.image}`
                  : DefaultImg
              }
              alt={props.selectedPhoto?.title || ""}
            />
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
