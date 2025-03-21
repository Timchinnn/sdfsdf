import React, { useEffect, useRef, useState } from "react";

import "./styles.scss";

// import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import MainCarouselSet from "components/MainCarouselSet";

import StarIcon from "assets/img/star-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";

const ShopPopupCarousel = (props) => {
  const popupRef = useRef(null);
  const [nameCard, setNameCard] = useState(false);
  const [DescrCard, setDescrCard] = useState(false);
  const [priceCard, setPriceCard] = useState(false);
  const [expCard, setExpCard] = useState(false);
  //
  const { setActivePopup } = props;
  const handleOpenPopup = (cardData) => {
    document.documentElement.classList.add("fixed");
    setActivePopup(true);
    setNameCard(cardData.title);
    setDescrCard(cardData.description);
    setPriceCard(cardData.price);
    setExpCard(cardData.experience);
  };

  //   const handleClosePopup = () => {
  //     document.documentElement.classList.remove("fixed");
  //     setActivePopup(false);
  //   };
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
          {/* <div className="shop-popup__image"> */}
          <MainCarouselSet
            getActiveSlide={5}
            handleOpenPopup={handleOpenPopup}
          />
          {/* <img
              src={
                props.selectedPhoto
                  ? `${props.selectedPhoto.image}`
                  : DefaultImg
              }
              alt={props.selectedPhoto?.title || ""}
            />{" "} */}
          {/* </div> */}
          <div className="shop-popup__content">
            <h3 className="shop-popup__title">{nameCard ? nameCard : ""}</h3>{" "}
            <p className="shop-popup__text">{DescrCard ? DescrCard : ""}</p>
            <div className="shop-popup__earn">
              <div className="main-params__card f-center-center">
                <div className="main-params__icon f-center-center">
                  <img src={TimeIcon} alt="" />
                </div>
                <p className="main-params__title">18,09 K/H</p>
              </div>
            </div>
          </div>
          <div className="shop-popup__params">
            <ul className="friends-params f-center-center">
              <li className="friends-params__item f-center">
                <img src={StarIcon} alt="" />
                {expCard ? expCard : ""} EXP
              </li>
              <li className="friends-params__item f-center">
                <img src={CoinIcon} alt="" />
                {priceCard ? priceCard : ""}
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="shop-popup__btn"
            onClick={props.handleClosePopup}
          >
            {!props.main ? "Купить" : "Ок"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPopupCarousel;
