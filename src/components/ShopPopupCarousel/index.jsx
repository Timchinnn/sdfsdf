import React, { useEffect, useRef, useState } from "react";

import "./styles.scss";
import axios from "../../axios-controller";
import { useSelector } from 'react-redux';
// import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import MainCarouselSet from "components/MainCarouselSet";

import StarIcon from "assets/img/star-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";
import Spinner from "components/Spinner";

const ShopPopupCarousel = ({ setActivePopup, onButtonClick, ...props }) => {
  const popupRef = useRef(null);
  // const [nameCard, setNameCard] = useState(false);
  // const [DescrCard, setDescrCard] = useState(false);
  // const [priceCard, setPriceCard] = useState(false);
  // const [expCard, setExpCard] = useState(false);
  // const [totalEnergy, setTotalEnergy] = useState(0);
  // const [totalCoins, setTotalCoins] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [translatedTitle, setTranslatedTitle] = useState("");
const [translatedDescription, setTranslatedDescription] = useState("");
const [isTranslating, setIsTranslating] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
useEffect(() => {
    if (

      !isTranslating // Add check for translation loading state
    ) {
      // Добавляем небольшую задержку для плавности
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [

    isTranslating, // Add isTranslating to dependencies
  ]);
  // const { setActivePopup } = props;
  const handleOpenPopup = (cardData) => {
    document.documentElement.classList.add("fixed");
    setActivePopup(true);
    setSelectedCard(cardData);
  };

  //   const handleClosePopup = () => {
  //     document.documentElement.classList.remove("fixed");
  //     setActivePopup(false);
  //   };
  const language = useSelector((state) => state.language);
const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post("/translate", {
      texts: [text],
      targetLanguageCode: targetLang,
    });
    if (response.data && response.data[0]) {
      return response.data[0].text;
    }
    return text;
  } catch (error) {
    console.error("Ошибка при переводе:", error);
    return text;
  }
};
useEffect(() => {
  const translateTexts = async () => {
    if (selectedCard || props.selectedSet) {
      setIsTranslating(true);
      const title = selectedCard ? selectedCard.title : props.selectedSet?.title || "";
      const description = selectedCard ? selectedCard.description : props.selectedSet?.description || "";
      
      try {
        const [translatedTitleResponse, translatedDescResponse] = await Promise.all([
          translateText(title, language),
          translateText(description, language)
        ]);
        
        setTranslatedTitle(translatedTitleResponse);
        setTranslatedDescription(translatedDescResponse);
      } catch (error) {
        console.error("Ошибка при переводе:", error);
        setTranslatedTitle(title);
        setTranslatedDescription(description);
      }
      setIsTranslating(false);
    }
  };
  translateTexts();
}, [selectedCard, props.selectedSet, language]);
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
        const response = await axios.post("/shop/buy-set", {
          telegram_id,
          set_id: props.selectedSet.id,
          price: props.selectedSet.price,
        });
        if (response.data.success) {
          props.handleClosePopup();
          if (onButtonClick) {
            onButtonClick();
          }
        }
      } catch (error) {
        console.error("Error buying set:", error);
        alert(error.response?.data?.message || "Error purchasing set");
      }
    }
  };
  return (
    <div
      ref={popupRef}
      className={`shop-popup ${props.active ? "show" : ""}`}
      style={{ padding: "0 7px" }}
    >
      {showSpinner ? (
                  <Spinner loading={true} size={50} />
                ) : (
      <div className="shop-popup__wrapper">
        <button
          type="button"
          className="shop-popup__close"
          onClick={props.handleClosePopup}
          style={{ zIndex: 1000 }}
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
        <div className="shop-popup__inner" style={{ overflowX: "hidden" }}>
          {/* <div className="shop-popup__image"> */}
          <MainCarouselSet
            getActiveSlide={5}
            handleOpenPopup={handleOpenPopup}
            selectedSet={props.selectedSet}
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
            <h3 className="shop-popup__title">
              {translatedTitle || (selectedCard
                  ? selectedCard.title
                  : props.selectedSet?.title || "")}
            </h3>
            <p className="shop-popup__text">
              {translatedDescription || (selectedCard
                  ? selectedCard.description
                  : props.selectedSet?.description || "")}
            </p>
            <div className="shop-popup__earn">
              <div className="main-params__card f-center-center">
                <div className="main-params__icon f-center-center">
                  <img src={TimeIcon} alt="" />
                </div>
                <p className="main-params__title">
                  {selectedCard
                    ? selectedCard.hourly_income
                    : props.selectedSet?.cards?.reduce(
                        (sum, card) => sum + (card.hourly_income || 0),
                        0
                      ) || 0}{" "}
                  K/H
                </p>
              </div>
            </div>
          </div>
          <div className="shop-popup__params">
            <ul className="friends-params f-center-center">
              <li className="friends-params__item f-center">
                <img src={StarIcon} alt="" />
                {selectedCard
                  ? selectedCard.experience
                  : props.selectedSet?.cards?.reduce(
                      (sum, card) => sum + (card.experience || 0),
                      0
                    ) || 0}{" "}
                EXP
              </li>
              <li className="friends-params__item f-center">
                <img src={CoinIcon} alt="" />
                {selectedCard
                  ? Math.floor(selectedCard.price)
                  : Math.floor(
                      props.selectedSet?.cards?.reduce(
                        (sum, card) => sum + (card.price || 0),
                        0
                      )
                    ) || 0}
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="shop-popup__btn"
            onClick={handleButtonClick}
          >
            {!props.main ? "Купить" : "Ок"}
          </button>
        </div>
      </div>)}
    </div>
  );
};

export default ShopPopupCarousel;
