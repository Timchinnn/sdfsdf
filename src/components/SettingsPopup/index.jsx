import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, setCardBack, setLanguage } from "../../redux/actions";
import { routeAdmin } from "pages/AdminPanel";
import { NavLink } from "react-router-dom";
import { cardBackService, translationService } from "services/api";
import axios from "../../axios-controller";
const SettingsPopup = ({ setActivePopup, activePopup }) => {
  const dispatch = useDispatch();
  const [purchasedShirts, setPurchasedShirts] = useState([]);
  const [cardBackStyle, setCardBackStyle] = useState("default");
  const [cardBacks, setCardBacks] = useState([]);
  const [settingsVibration, setSettingsVibration] = useState(false);
  const darkTheme = useSelector((state) => state.theme);
  const [settingsNight, setSettingsNight] = useState(darkTheme);
  const [modalStep, setModalStep] = useState(1);
  const [seletLang, setSelectLang] = useState(1);
  const [currentLanguage, setCurrentLanguage] = useState(
    useSelector((state) => state.language)
  );
  // Храним переводы в состоянии, по умолчанию — на русском.
  const [translations, setTranslations] = useState({
    saveContinue: "Сохранить и продолжить",
    reset: "Сбросить",
    adminPanel: "Админ панель",
    goOver: "Перейти",
    vibration: "Вибрация",
    nightMode: "Ночной режим",
    cardShirt: "Рубашка карты",
    language: "Язык",
    deleteAccount: "Удалить аккаунт",
    leaveAccount: "Оставить аккаунт",
    eraseData: "Стереть все данные",
    eraseConfirmation:
      "Вы уверенны, что хотите стереть все данные на нашем сервисе?",
    apply: "Применить",
  });
  // Получение данных о рубашках пользователя
  useEffect(() => {
    const loadUserCardBack = async () => {
      try {
        const tg = window.Telegram.WebApp;
        if (tg?.initDataUnsafe?.user?.id) {
          const response = await cardBackService.getUserCardBack(
            tg.initDataUnsafe.user.id
          );
          if (response.data.style) {
            setCardBackStyle(response.data.style);
            dispatch(setCardBack(response.data.style));
          }
        }
      } catch (error) {
        console.error("Error loading card back style:", error);
      }
    };
    loadUserCardBack();
  }, [dispatch]);
  useEffect(() => {
    const fetchPurchasedShirts = async () => {
      try {
        const tg = window.Telegram.WebApp;
        if (tg?.initDataUnsafe?.user?.id) {
          const response = await axios.get(
            `/user/${tg.initDataUnsafe.user.id}/shirts`
          );
          if (response.data && response.data.shirts) {
            setPurchasedShirts(response.data.shirts);
          }
        }
      } catch (error) {
        console.error("Error fetching purchased shirts:", error);
      }
    };
    fetchPurchasedShirts();
  }, []);
  useEffect(() => {
    const fetchCardBacks = async () => {
      try {
        const response = await cardBackService.getAllCardBacks();
        setCardBacks(response.data);
      } catch (error) {
        console.error("Error fetching card backs:", error);
      }
    };
    fetchCardBacks();
  }, []);
  const handleCardBackChange = async (style) => {
    try {
      setCardBackStyle(style);
      dispatch(setCardBack(style));
      const tg = window.Telegram.WebApp;
      if (tg?.initDataUnsafe?.user?.id) {
        const userId = tg.initDataUnsafe.user.id;
        await cardBackService.updateUserCardBack(userId, { style });
      }
    } catch (error) {
      console.error("Error updating card backф:", error);
    }
  };
  const setThemeMode = () => {
    setSettingsNight(!settingsNight);
    dispatch(setTheme(!settingsNight));
  };
  // Новый вариант handleLanguageChange с обновлением состояния переводов
  const handleLanguageChange = async (langCode) => {
    try {
      setSelectLang(langCode === "ru" ? 1 : 2);
      setCurrentLanguage(langCode);
      const textsToTranslate = [
        "Сохранить и продолжить",
        "Сбросить",
        "Админ панель",
        "Перейти",
        "Вибрация",
        "Ночной режим",
        "Рубашка карты",
        "Язык",
        "Удалить аккаунт",
        "Оставить аккаунт",
        "Стереть все данные",
        "Вы уверенны, что хотите стереть все данные на нашем сервисе?",
        "Применить",
      ];
      const response = await translationService.translateText(
        textsToTranslate,
        langCode
      );
      if (response.data && response.data.translations) {
        const trans = response.data.translations;
        const newTranslations = {
          saveContinue: trans[0].text,
          reset: trans[1].text,
          adminPanel: trans[2].text,
          goOver: trans[3].text,
          vibration: trans[4].text,
          nightMode: trans[5].text,
          cardShirt: trans[6].text,
          language: trans[7].text,
          deleteAccount: trans[8].text,
          leaveAccount: trans[9].text,
          eraseData: trans[10].text,
          eraseConfirmation: trans[11].text,
          apply: trans[12].text,
        };
        setTranslations(newTranslations);
        localStorage.setItem("translations", JSON.stringify(newTranslations));
        localStorage.setItem("currentLanguage", langCode);
        dispatch(setLanguage(langCode));
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };
  // Загружаем сохраненные переводы при монтировании
  useEffect(() => {
    const savedLanguage = localStorage.getItem("currentLanguage");
    const savedTranslations = localStorage.getItem("translations");
    if (savedLanguage && savedTranslations) {
      setCurrentLanguage(savedLanguage);
      setSelectLang(savedLanguage === "ru" ? 1 : 2);
      setTranslations(JSON.parse(savedTranslations));
    }
  }, []);
  const settingsPopupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsPopupRef.current &&
        !settingsPopupRef.current.contains(event.target)
      ) {
        document.documentElement.classList.remove("fixed");
        setActivePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActivePopup]);
  const handleClickPopupClose = () => {
    dispatch(setLanguage(currentLanguage));
    setActivePopup(false);
    document.documentElement.classList.remove("fixed");
    setModalStep(1);
  };
  const tg = window.Telegram.WebApp;
  return (
    <div
      ref={settingsPopupRef}
      className={`modal ${activePopup ? "show" : ""}`}
    >
      <div className="modal-wrapper">
        {modalStep === 1 && (
          <>
            <div className="modal-settings">
              {tg?.initDataUnsafe?.user?.id === 467518658 && (
                <>
                  <p className="modal-settings__title">
                    {translations.adminPanel}
                  </p>
                  <NavLink to={routeAdmin()} className="modal-settings__select">
                    <span>{translations.goOver}</span>
                  </NavLink>
                </>
              )}
              <div className="modal-settings__item f-center-jcsb">
                <p className="modal-settings__title">
                  {translations.vibration}
                </p>
                <div
                  className={`modal-settings__toggle ${
                    settingsVibration ? "active" : ""
                  }`}
                  onClick={() => setSettingsVibration(!settingsVibration)}
                >
                  <span className="modal-settings__toggle-select"></span>
                </div>
              </div>
              <div className="modal-settings__item f-center-jcsb">
                <p className="modal-settings__title">
                  {translations.nightMode}
                </p>
                <div
                  className={`modal-settings__toggle ${
                    settingsNight ? "active" : ""
                  }`}
                  onClick={setThemeMode}
                >
                  <span className="modal-settings__toggle-select"></span>
                </div>
              </div>
              <div className="modal-settings__item f-center-jcsb">
                <p className="modal-settings__title">
                  {translations.cardShirt}
                </p>
                <div
                  className="modal-settings__select"
                  onClick={() => setModalStep(4)}
                >
                  <span>
                    {cardBacks.find((cb) => cb.image === cardBackStyle)?.name ||
                      "Default"}
                  </span>
                  <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.96826 6.71191C7.96826 6.89502 7.89502 7.05615 7.75586 7.19531L1.95508 12.8716C1.82324 13.0034 1.66211 13.0693 1.47168 13.0693C1.09814 13.0693 0.805176 12.7837 0.805176 12.4028C0.805176 12.2124 0.878418 12.0513 0.995605 11.9268L6.32764 6.71191L0.995605 1.49707C0.878418 1.37256 0.805176 1.2041 0.805176 1.021C0.805176 0.640137 1.09814 0.354492 1.47168 0.354492C1.66211 0.354492 1.82324 0.42041 1.95508 0.544922L7.75586 6.22852C7.89502 6.36035 7.96826 6.52881 7.96826 6.71191Z"
                      fill="#AAB2BD"
                    />
                  </svg>
                </div>
              </div>
              <div className="modal-settings__item f-center-jcsb">
                <p className="modal-settings__title">{translations.language}</p>
                <div
                  className="modal-settings__lang f-center"
                  onClick={() => setModalStep(2)}
                >
                  {currentLanguage === "ru" ? "Русский" : "English"}
                  <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.96826 6.71191C7.96826 6.89502 7.89502 7.05615 7.75586 7.19531L1.95508 12.8716C1.82324 13.0034 1.66211 13.0693 1.47168 13.0693C1.09814 13.0693 0.805176 12.7837 0.805176 12.4028C0.805176 12.2124 0.878418 12.0513 0.995605 11.9268L6.32764 6.71191L0.995605 1.49707C0.878418 1.37256 0.805176 1.2041 0.805176 1.021C0.805176 0.640137 1.09814 0.354492 1.47168 0.354492C1.66211 0.354492 1.82324 0.42041 1.95508 0.544922L7.75586 6.22852C7.89502 6.36035 7.96826 6.52881 7.96826 6.71191Z"
                      fill="#AAB2BD"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="modal-settings__delete"
              onClick={() => setModalStep(3)}
            >
              {translations.deleteAccount}
            </button>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                {translations.saveContinue}
              </button>
            </div>
          </>
        )}
        {modalStep === 2 && (
          <>
            <h3 className="modal-title">{translations.language}</h3>
            <div className="modal-lang">
              <div
                className="modal-lang__item f-center-jcsb"
                onClick={() => handleLanguageChange("ru")}
              >
                <div className="modal-lang__content">
                  <p className="modal-lang__content-title">Russian</p>
                  <p className="modal-lang__content-subtitle">Русский</p>
                </div>
                <span
                  className={`modal-lang__select ${
                    currentLanguage === "ru" ? "active" : ""
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M6.7403 17.0108C7.31573 17.0108 7.75862 16.7748 8.06896 16.3028L17.1465 2.2597C17.2565 2.09159 17.3373 1.92996 17.389 1.77478C17.4407 1.61961 17.4666 1.46444 17.4666 1.30927C17.4666 0.927802 17.3405 0.614224 17.0884 0.368535C16.8362 0.122845 16.5129 0 16.1185 0C15.847 0 15.6207 0.0549569 15.4397 0.164871C15.2586 0.268319 15.084 0.449353 14.9159 0.707974L6.70151 13.7231L2.49246 8.38901C2.18858 8.00754 1.81358 7.81681 1.36746 7.81681C0.97306 7.81681 0.646551 7.94289 0.387931 8.19504C0.12931 8.4472 0 8.76724 0 9.15517C0 9.32974 0.0290948 9.49784 0.0872845 9.65948C0.15194 9.82112 0.255388 9.98599 0.397629 10.1541L5.42133 16.3416C5.7834 16.7877 6.22306 17.0108 6.7403 17.0108Z"
                      fill="#71B21D"
                    />
                  </svg>
                </span>
              </div>
              <div
                className="modal-lang__item f-center-jcsb"
                onClick={() => handleLanguageChange("en")}
              >
                <div className="modal-lang__content">
                  <p className="modal-lang__content-title">English</p>
                  <p className="modal-lang__content-subtitle">English</p>
                </div>
                <span
                  className={`modal-lang__select ${
                    currentLanguage === "en" ? "active" : ""
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M6.7403 17.0108C7.31573 17.0108 7.75862 16.7748 8.06896 16.3028L17.1465 2.2597C17.2565 2.09159 17.3373 1.92996 17.389 1.77478C17.4407 1.61961 17.4666 1.46444 17.4666 1.30927C17.4666 0.927802 17.3405 0.614224 17.0884 0.368535C16.8362 0.122845 16.5129 0 16.1185 0C15.847 0 15.6207 0.0549569 15.4397 0.164871C15.2586 0.268319 15.084 0.449353 14.9159 0.707974L6.70151 13.7231L2.49246 8.38901C2.18858 8.00754 1.81358 7.81681 1.36746 7.81681C0.97306 7.81681 0.646551 7.94289 0.387931 8.19504C0.12931 8.4472 0 8.76724 0 9.15517C0 9.32974 0.0290948 9.49784 0.0872845 9.65948C0.15194 9.82112 0.255388 9.98599 0.397629 10.1541L5.42133 16.3416C5.7834 16.7877 6.22306 17.0108 6.7403 17.0108Z"
                      fill="#71B21D"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                {translations.saveContinue}
              </button>
              <button
                type="button"
                className="modal-btn modal-btn_default"
                onClick={handleClickPopupClose}
              >
                {translations.reset}
              </button>
            </div>
          </>
        )}
        {modalStep === 3 && (
          <>
            <h3 className="modal-title">{translations.eraseConfirmation}</h3>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                {translations.leaveAccount}
              </button>
              <button
                type="button"
                className="modal-btn modal-btn_delete"
                onClick={handleClickPopupClose}
              >
                {translations.eraseData}
              </button>
            </div>
          </>
        )}
        {modalStep === 4 && (
          <>
            <h3 className="modal-title">{translations.cardShirt}</h3>
            <div
              className="modal-cardback"
              style={{
                overflowX: "auto",
                scrollbarWidth: "none",
                whiteSpace: "nowrap",
              }}
            >
              {cardBacks.map((cardBack) => (
                <div
                  key={cardBack.id}
                  className={`modal-cardback__item ${
                    cardBackStyle === cardBack.image ? "active" : ""
                  }`}
                  onClick={() => handleCardBackChange(cardBack.image)}
                >
                  <div className="modal-cardback__select">
                    <div className="modal-cardback__circle">
                      {cardBackStyle === cardBack.image && (
                        <div className="modal-cardback__dot"></div>
                      )}
                    </div>
                  </div>
                  <img
                    src={`https://api.zoomayor.io${cardBack.image}`}
                    alt={cardBack.name}
                    style={{ marginRight: "20px", height: "245px" }}
                  />
                </div>
              ))}
              {purchasedShirts.map((shirt) => (
                <div
                  key={shirt.id}
                  className={`modal-cardback__item ${
                    cardBackStyle === shirt.image_url ? "active" : ""
                  }`}
                  onClick={() => handleCardBackChange(shirt.image_url)}
                >
                  <div className="modal-cardback__select">
                    <div className="modal-cardback__circle">
                      {cardBackStyle === shirt.image_url && (
                        <div className="modal-cardback__dot"></div>
                      )}
                    </div>
                  </div>
                  <img
                    src={`https://api.zoomayor.io${shirt.image_url}`}
                    alt={shirt.name}
                    style={{ marginRight: "20px", height: "245px" }}
                  />
                </div>
              ))}
            </div>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={() => setModalStep(1)}
              >
                {translations.apply}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SettingsPopup;
