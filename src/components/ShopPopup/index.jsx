import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import DefaultImg from "assets/img/default-img.png";
import TimeIcon from "assets/img/time-icon.svg";
import QuestionMarkImg from "assets/img/question-mark.png";
import StarIcon from "assets/img/star-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";
import Spinner from "components/Spinner";
import { useSelector } from "react-redux"; // Импортируем useSelector
const ShopPopup = (props) => {
  const popupRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setActivePopup, onButtonClick } = props;
  const [translations, setTranslations] = useState({
    titleClosedCard: "Карта не открыта",
    buy: "Купить",
    ok: "Ок",
  });
  const language = useSelector((state) => state.language); // Получаем текущий язык из Redux
  useEffect(() => {
    const updateTranslations = (lang) => {
      if (lang === "ru") {
        setTranslations({
          titleClosedCard: "Карта не открыта",
          buy: "Купить",
          ok: "Ок",
        });
      } else if (lang === "en") {
        setTranslations({
          titleClosedCard: "Card not opened",
          buy: "Buy",
          ok: "Ok",
        });
      }
    };
    updateTranslations(language); // Обновляем переводы при изменении языка
  }, [language]);
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
  const imageUrl = props.selectedPhoto?.image
    ? `https://api.zoomayor.io${props.selectedPhoto.image}`
    : DefaultImg;
  // Функция для перевода заголовка и описания
  const translateText = (text) => {
    if (language === "ru") {
      return text; // Оставляем текст без изменений для русского
    } else if (language === "en") {
      // Здесь можно добавить логику для перевода текста
      // Например, если у вас есть объект с переводами для заголовков и описаний
      const translationsMap = {
        "Сет": "Set",
        "Задания": "Tasks",
        "Бонус": "Bonus",
        // Добавьте другие переводы
      };
      return translationsMap[text] || text; // Возвращаем перевод или оригинал, если перевод не найден
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
          {/* Иконка закрытия */}
        </button>
        {loading ? (
          <div className="shop-popup__spinner">
            <Spinner loading={true} size={50} />
          </div>
        ) : (
          <div className="shop-popup__inner">
            <div className="shop-popup__image">
              {showImage && (
                <img
                  src={imageUrl}
                  alt={props.selectedPhoto?.title || ""}
                />
              )}
            </div>
            <div className="shop-popup__content">
              {props.selectedPhoto && props.selectedPhoto.image === QuestionMarkImg ? (
                <h3 className="shop-popup__title">{translations.titleClosedCard}</h3>
              ) : (
                <>
                  <h3 className="shop-popup__title">
                    {props.selectedPhoto ? translateText(props.selectedPhoto.title) : ""}
                  </h3>
                  <p className="shop-popup__text">
                    {props.selectedPhoto ? translateText(props.selectedPhoto.description) : ""}
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
            {props.selectedPhoto && props.selectedPhoto.image !== QuestionMarkImg && (
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
              onClick={handleButtonClick}
            >
              {!props.main ? translations.buy : translations.ok} {/* Используем переводы для кнопки */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ShopPopup;