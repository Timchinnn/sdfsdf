import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import QuestionMarkImg from "assets/img/question-mark.png";
import StarIcon from "assets/img/star-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";
import Spinner from "components/Spinner";
import axios from "../../axios-controller";
import { useSelector } from 'react-redux';

const ShopPopup = (props) => {  
  const language = useSelector((state) => state.language);

  const popupRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setActivePopup, onButtonClick } = props;
  const [translatedTitle, setTranslatedTitle] = useState("");
const [translatedDescription, setTranslatedDescription] = useState("");
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
    const translateSelectedPhoto = async () => {
      if (props.selectedPhoto) {
        const title = props.selectedPhoto.title || "";
        const description = props.selectedPhoto.description || "";
        setIsTranslating(true); // Начинаем загрузку
        const translatedTitle = await translateText(title, language);
        const translatedDescription = await translateText(description, language);
        setTranslatedTitle(translatedTitle);
        setTranslatedDescription(translatedDescription);
        setIsTranslating(false); // Завершаем загрузку
      }
    };
    translateSelectedPhoto();
  }, [props.selectedPhoto, language]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
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
      onButtonClick();
    }
  };
  useEffect(() => {
    if (props.selectedPhoto && props.selectedPhoto.image === QuestionMarkImg) {
      console.log(QuestionMarkImg);
    }
  }, [props.selectedPhoto]);
  const imageUrl = props.selectedPhoto?.image
    ? `https://api.zoomayor.io${props.selectedPhoto.image}`
    : DefaultImg;
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
{isTranslating  ? ( 
          <div className="shop-popup__spinner"> 
            <Spinner loading={true} size={50} /> 
          </div> 
        ) : ( 
          <div className="shop-popup__inner">
            <div className="shop-popup__image">
              {showImage && (
                <img
                  src={
                    props.selectedPhoto
                      ? props.selectedPhoto.id === "set" ||
                        props.selectedPhoto.id === "energy" ||
                        props.selectedPhoto.id === "money" ||
                        props.selectedPhoto.image === QuestionMarkImg ||
                        props.selectedPhoto.image.startsWith(
                          "https://api.zoomayor.io"
                        )
                        ? props.selectedPhoto.image
                        : `https://api.zoomayor.io${props.selectedPhoto.image}`
                      : DefaultImg
                  }
                  alt={props.selectedPhoto?.title || ""}
                />
              )}
            </div>
            <div className="shop-popup__content">
              {props.selectedPhoto &&
              props.selectedPhoto.image === QuestionMarkImg ? (
                <h3 className="shop-popup__title">Карта не открыта</h3>
              ) : (
                <>
                  <h3 className="shop-popup__title">
                    {props.selectedPhoto ? translatedTitle : ""}
                  </h3>
                  <p className="shop-popup__text">
                    {props.selectedPhoto ? translatedDescription : ""}
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
                          ? typeof props.selectedPhoto.hourly_income ===
                            "number"
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
                      {props.selectedPhoto
                        ? props.selectedPhoto.experience
                        : ""}
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
        )}
      </div>
    </div>
  );
};
export default ShopPopup;
