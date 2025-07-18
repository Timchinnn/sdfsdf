import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { routeAdmin } from "pages/AdminPanel";
import { NavLink } from "react-router-dom";
import { cardBackService } from "services/api";
import axios from "../../axios-controller";
import Spinner from "../Spinner";
import {
  setTheme,
  setCardBack,
  setLanguage,
  setImageQuality,
} from "../../redux/actions";
const SettingsPopup = ({ setActivePopup, activePopup }) => {
  const imageQuality = useSelector((state) => state.imageQuality);
  const dispatch = useDispatch();
  const [purchasedShirts, setPurchasedShirts] = useState([]);
  const [cardBackStyle, setCardBackStyle] = useState("default");
  const [cardBacks, setCardBacks] = useState([]);
  const [settingsVibration, setSettingsVibration] = useState(false);
  const [settingsNight, setSettingsNight] = useState(
    useSelector((state) => state.theme)
  );
const language = useSelector((state) => state.language) || 'ru';
const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [modalStep, setModalStep] = useState(1);
  const [seletLang, setSelectLang] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return savedLang === "en" ? 2 : savedLang === "ru" ? 1 : 1;
  });
  const [translations, setTranslations] = useState({
    vibration: "Вибрация",
    nightMode: "Ночной режим",
    cardBack: "Рубашка карты",
    language: "Язык",
    deleteAccount: "Удалить аккаунт",
    saveAndContinue: "Сохранить и продолжить",
    imageQuality: "Качество изображений",
    automatic: "Автоматически",
    high: "Высокое качество",
    low: "Низкое качество",
    backToSettings: "Назад",
    russian: "Русский",
    english: "Английский",
    italian: "Итальянский",
    spanish: "Испанский",
    german: "Немецкий",
    confirmDeleteAccount:
      "Вы уверенны, что хотите стереть все данные на нашем сервисе?",
    keepAccount: "Оставить аккаунт",
    deleteData: "Стереть все данные",
    automaticDescription: "Выбирается в зависимости от скорости соединения",
    highQualityDescription: "Может замедлить работу при плохом соединении",
    lowQualityDescription: "Рекомендуется для медленного соединения",
  });
  const translateServerResponse = async (text) => {
    try {
      const translatedText = await translateText(text, language);
      return translatedText;
    } catch (error) {
      console.error("Ошибка при переводе текста с сервера:", error);
      return text;
    }
  };
  const [translatedCardBackName, setTranslatedCardBackName] = useState("");
useEffect(() => {
    const getTranslatedName = async () => {
      const cardBackName = purchasedShirts.find(
        (shirt) => shirt.image_url === cardBackStyle
      )?.name;
      if (cardBackName) {
        const translatedName = await translateServerResponse(cardBackName);
        setTranslatedCardBackName(translatedName);
      }
    };
    getTranslatedName();
  }, [cardBackStyle, purchasedShirts, language]);

  const [isLoading, setIsLoading] = useState(true);
  const settingsPopupRef = useRef(null);
useEffect(() => {
    const loadData = async () => {
      try {
        // Load saved language
        const savedLanguage = localStorage.getItem("language") || "ru";
        dispatch(setLanguage(savedLanguage));
        setSelectLang(savedLanguage === "en" ? 2 : 1);
        await handleLanguageChange(savedLanguage);
        
        // Load user card back and purchased shirts first
        const tg = window.Telegram.WebApp;
        let cardBackStyleValue = "default";
        
        if (tg?.initDataUnsafe?.user?.id) {
          const [cardBackResponse, purchasedResponse] = await Promise.all([
            cardBackService.getUserCardBack(tg.initDataUnsafe.user.id),
            fetchPurchasedShirts()
          ]);
          
          if (cardBackResponse.data.style) {
            cardBackStyleValue = cardBackResponse.data.style;
            setCardBackStyle(cardBackStyleValue);
            dispatch(setCardBack(cardBackStyleValue));
          }
          // Get card back name and translate it before setting loading to false
          const cardBackName = purchasedShirts.find(
            (shirt) => shirt.image_url === cardBackStyleValue
          )?.name;
          if (cardBackName) {
            const translatedName = await translateServerResponse(cardBackName);
            setTranslatedCardBackName(translatedName);
          }
        }
        
        // Load card backs
        await fetchCardBacks();
        setIsLoading(false);
      } catch (error) {
        console.error("Error");
        setIsLoading(false);
      }
    };
    loadData();
}, [dispatch]);
const handleLanguageChange = async (langCode) => {
    if (langCode === "ru") {
      setSelectLang(1);
      dispatch(setLanguage("ru"));
      setSelectedLanguage("ru");
      localStorage.setItem("language", "ru");
      
      setTranslations({
        vibration: "Вибрация",
        nightMode: "Ночной режим", 
        cardBack: "Рубашка карты",
        language: "Язык",
        deleteAccount: "Удалить аккаунт",
        saveAndContinue: "Сохранить и продолжить",
        imageQuality: "Качество изображений",
        automatic: "Автоматически",
        high: "Высокое качество",
        low: "Низкое качество",
        backToSettings: "Назад",
        russian: "Русский",
        english: "Английский",
        italian: "Итальянский",
        spanish: "Испанский", 
        german: "Немецкий",
        confirmDeleteAccount: "Вы уверенны, что хотите стереть все данные на нашем сервисе?",
        keepAccount: "Оставить аккаунт",
        deleteData: "Стереть все данные",
        automaticDescription: "Выбирается в зависимости от скорости соединения",
        highQualityDescription: "Может замедлить работу при плохом соединении",
        lowQualityDescription: "Рекомендуется для медленного соединения"
      });
      
    } else if (langCode === "en") {
      setSelectLang(2);
      dispatch(setLanguage("en")); 
      setSelectedLanguage("en");
      localStorage.setItem("language", "en");
      
      setTranslations({
        vibration: "Vibration",
        nightMode: "Night Mode",
        cardBack: "Card Back",
        language: "Language", 
        deleteAccount: "Delete Account",
        saveAndContinue: "Save and Continue",
        imageQuality: "Image Quality",
        automatic: "Automatic",
        high: "High Quality",
        low: "Low Quality",
        backToSettings: "Back",
        russian: "Russian",
        english: "English",
        italian: "Italian",
        spanish: "Spanish",
        german: "German",
        confirmDeleteAccount: "Are you sure you want to delete all data on our service?",
        keepAccount: "Keep Account",
        deleteData: "Delete All Data",
        automaticDescription: "Selected based on connection speed",
        highQualityDescription: "May slow down with poor connection",
        lowQualityDescription: "Recommended for slow connection"
      });
    } else if (langCode === "it") {
      setSelectLang(3);
      dispatch(setLanguage("it")); // Добавлен dispatch
      setSelectedLanguage("it");
      localStorage.setItem("language", "it");
      
      setTranslations({
        vibration: "Vibrazione",
        nightMode: "Modalità notte",
        cardBack: "Dorso della carta",
        language: "Lingua",
        deleteAccount: "Elimina account",
        saveAndContinue: "Salva e continua", 
        imageQuality: "Qualità immagine",
        automatic: "Automatico",
        high: "Alta qualità",
        low: "Bassa qualità",
        backToSettings: "Indietro",
        russian: "Russo",
        english: "Inglese", 
        italian: "Italiano",
        spanish: "Spagnolo",
        german: "Tedesco",
        confirmDeleteAccount: "Sei sicuro di voler cancellare tutti i dati sul nostro servizio?",
        keepAccount: "Mantieni account",
        deleteData: "Cancella tutti i dati",
        automaticDescription: "Selezionato in base alla velocità di connessione",
        highQualityDescription: "Potrebbe rallentare con una connessione scarsa",
        lowQualityDescription: "Consigliato per connessione lenta"
      });
    } else if (langCode === "es") {
      setSelectLang(4);
      dispatch(setLanguage("es")); // Добавлен dispatch
      setSelectedLanguage("es");
      localStorage.setItem("language", "es");
      
      setTranslations({
        vibration: "Vibración",
        nightMode: "Modo nocturno",
        cardBack: "Reverso de carta",
        language: "Idioma",
        deleteAccount: "Eliminar cuenta",
        saveAndContinue: "Guardar y continuar",
        imageQuality: "Calidad de imagen",
        automatic: "Automático",
        high: "Alta calidad", 
        low: "Baja calidad",
        backToSettings: "Atrás",
        russian: "Ruso",
        english: "Inglés",
        italian: "Italiano",
        spanish: "Español",
        german: "Alemán",
        confirmDeleteAccount: "¿Estás seguro de que quieres borrar todos los datos en nuestro servicio?",
        keepAccount: "Mantener cuenta",
        deleteData: "Borrar todos los datos",
        automaticDescription: "Seleccionado según la velocidad de conexión",
        highQualityDescription: "Puede ralentizarse con mala conexión",
        lowQualityDescription: "Recomendado para conexión lenta"
      });
    } else if (langCode === "de") {
      setSelectLang(5);
      dispatch(setLanguage("de")); // Добавлен dispatch
      setSelectedLanguage("de");
      localStorage.setItem("language", "de");
      
      setTranslations({
        vibration: "Vibration",
        nightMode: "Nachtmodus",
        cardBack: "Kartenrückseite",
        language: "Sprache",
        deleteAccount: "Konto löschen",
        saveAndContinue: "Speichern und fortfahren",
        imageQuality: "Bildqualität",
        automatic: "Automatisch",
        high: "Hohe Qualität",
        low: "Niedrige Qualität",
        backToSettings: "Zurück",
        russian: "Russisch",
        english: "Englisch",
        italian: "Italienisch",
        spanish: "Spanisch",
        german: "Deutsch",
        confirmDeleteAccount: "Sind Sie sicher, dass Sie alle Daten in unserem Service löschen möchten?",
        keepAccount: "Konto behalten",
        deleteData: "Alle Daten löschen",
        automaticDescription: "Basierend auf Verbindungsgeschwindigkeit ausgewählt",
        highQualityDescription: "Kann bei schlechter Verbindung langsamer werden",
        lowQualityDescription: "Empfohlen für langsame Verbindung"
      });
    }
}
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
      console.error("Ошибка при получении купленных рубашек:", error);
    }
  };
  const fetchCardBacks = async () => {
    try {
      const response = await cardBackService.getAllCardBacks();
      setCardBacks(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке рубашек карт:", error);
    }
  };
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
      console.error("Ошибка при обновлении рубашки карты:", error);
    }
  };
  const setThemeMode = () => {
    setSettingsNight(!settingsNight);
    dispatch(setTheme(!settingsNight));
  };
  const handleSelectClick = () => {
    fetchPurchasedShirts();
    setModalStep(4);
  };
  const handleClickPopupClose = () => {
    setActivePopup(false);
    document.documentElement.classList.remove("fixed");
    setModalStep(1);
  };
  const handleClickOutside = (event) => {
    if (
      settingsPopupRef.current &&
      !settingsPopupRef.current.contains(event.target)
    ) {
      document.documentElement.classList.remove("fixed");
      setActivePopup(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActivePopup]);
  const tg = window.Telegram.WebApp;
  return (
    <div
      ref={settingsPopupRef}
      className={`modal ${activePopup ? "show" : ""}`}
    >
      {" "}
    {isLoading || !translatedCardBackName ? (
        <div className="modal-spinner" style={{ marginBottom: "50vw" }}>
          <Spinner loading={true} size={50} />
        </div>
      ) : (
        <div className="modal-wrapper">
          {modalStep === 1 && (
            <>
              <div className="modal-settings">
                <div className="modal-settings__item f-center-jcsb">
                  {tg?.initDataUnsafe?.user?.id === 467518658 && (
                    <>
                      <p className="modal-settings__title">Админ панель</p>
                      <NavLink
                        to={routeAdmin()}
                        className="modal-settings__select"
                      >
                        <span>Перейти</span>
                      </NavLink>
                    </>
                  )}
                </div>
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
                    {translations.cardBack}
                  </p>
                  <div
                    className="modal-settings__select"
                    onClick={handleSelectClick}
                  >
                    <span>{translatedCardBackName}</span>
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
  <div className="modal-settings__lang f-center" onClick={() => setModalStep(2)}>
    {selectedLanguage === "ru" ? translations.russian : translations.english}
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
                  <p className="modal-settings__title">
                    {translations.imageQuality}
                  </p>
                  <div
                    className="modal-settings__select"
                    onClick={() => setModalStep(5)}
                  >
                    <span>
                      {imageQuality === "auto"
                        ? translations.automatic
                        : imageQuality === "high"
                        ? translations.high
                        : translations.low}
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
                  {translations.saveAndContinue}
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
                    <p className="modal-lang__content-title">
                      {translations.russian}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.russian}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      seletLang === 1 ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                    <p className="modal-lang__content-title">
                      {translations.english}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.english}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      seletLang === 2 ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.7403 17.0108C7.31573 17.0108 7.75862 16.7748 8.06896 16.3028L17.1465 2.2597C17.2565 2.09159 17.3373 1.92996 17.389 1.77478C17.4407 1.61961 17.4666 1.46444 17.4666 1.30927C17.4666 0.927802 17.3405 0.614224 17.0884 0.368535C16.8362 0.122845 16.5129 0 16.1185 0C15.847 0 15.6207 0.0549569 15.4397 0.164871C15.2586 0.268319 15.084 0.449353 14.9159 0.707974L6.70151 13.7231L2.49246 8.38901C2.18858 8.00754 1.81358 7.81681 1.36746 7.81681C0.97306 7.81681 0.646551 7.94289 0.387931 8.19504C0.12931 8.4472 0 8.76724 0 9.15517C0 9.32974 0.0290948 9.49784 0.0872845 9.65948C0.15194 9.82112 0.255388 9.98599 0.397629 10.1541L5.42133 16.3416C5.7834 16.7877 6.22306 17.0108 6.7403 17.0108Z"
                        fill="#71B21D"
                      />
                    </svg>
                  </span>
                </div>
                <div
                  className="modal-lang__item f-center-jcsb"
                  onClick={() => handleLanguageChange("it")}
                >
                  <div className="modal-lang__content">
                    <p className="modal-lang__content-title">
                      {translations.italian}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.italian}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      seletLang === 3 ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.7403 17.0108C7.31573 17.0108 7.75862 16.7748 8.06896 16.3028L17.1465 2.2597C17.2565 2.09159 17.3373 1.92996 17.389 1.77478C17.4407 1.61961 17.4666 1.46444 17.4666 1.30927C17.4666 0.927802 17.3405 0.614224 17.0884 0.368535C16.8362 0.122845 16.5129 0 16.1185 0C15.847 0 15.6207 0.0549569 15.4397 0.164871C15.2586 0.268319 15.084 0.449353 14.9159 0.707974L6.70151 13.7231L2.49246 8.38901C2.18858 8.00754 1.81358 7.81681 1.36746 7.81681C0.97306 7.81681 0.646551 7.94289 0.387931 8.19504C0.12931 8.4472 0 8.76724 0 9.15517C0 9.32974 0.0290948 9.49784 0.0872845 9.65948C0.15194 9.82112 0.255388 9.98599 0.397629 10.1541L5.42133 16.3416C5.7834 16.7877 6.22306 17.0108 6.7403 17.0108Z"
                        fill="#71B21D"
                      />
                    </svg>
                  </span>
                </div>
                <div
                  className="modal-lang__item f-center-jcsb"
                  onClick={() => handleLanguageChange("es")}
                >
                  <div className="modal-lang__content">
                    <p className="modal-lang__content-title">
                      {translations.spanish}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.spanish}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      seletLang === 4 ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.7403 17.0108C7.31573 17.0108 7.75862 16.7748 8.06896 16.3028L17.1465 2.2597C17.2565 2.09159 17.3373 1.92996 17.389 1.77478C17.4407 1.61961 17.4666 1.46444 17.4666 1.30927C17.4666 0.927802 17.3405 0.614224 17.0884 0.368535C16.8362 0.122845 16.5129 0 16.1185 0C15.847 0 15.6207 0.0549569 15.4397 0.164871C15.2586 0.268319 15.084 0.449353 14.9159 0.707974L6.70151 13.7231L2.49246 8.38901C2.18858 8.00754 1.81358 7.81681 1.36746 7.81681C0.97306 7.81681 0.646551 7.94289 0.387931 8.19504C0.12931 8.4472 0 8.76724 0 9.15517C0 9.32974 0.0290948 9.49784 0.0872845 9.65948C0.15194 9.82112 0.255388 9.98599 0.397629 10.1541L5.42133 16.3416C5.7834 16.7877 6.22306 17.0108 6.7403 17.0108Z"
                        fill="#71B21D"
                      />
                    </svg>
                  </span>
                </div>
                <div
                  className="modal-lang__item f-center-jcsb"
                  onClick={() => handleLanguageChange("de")}
                >
                  <div className="modal-lang__content">
                    <p className="modal-lang__content-title">
                      {translations.german}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.german}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      seletLang === 5 ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                  {translations.saveAndContinue}
                </button>
                <button
                  type="button"
                  className="modal-btn modal-btn_default"
                  onClick={handleClickPopupClose}
                >
                  {translations.backToSettings}
                </button>
              </div>
            </>
          )}
          {modalStep === 3 && (
            <>
              <h3 className="modal-title">
                {translations.confirmDeleteAccount}
              </h3>
              <div className="modal-nav">
                <button
                  type="button"
                  className="modal-btn"
                  onClick={handleClickPopupClose}
                >
                  {translations.keepAccount}
                </button>
                <button
                  type="button"
                  className="modal-btn modal-btn_delete"
                  onClick={handleClickPopupClose}
                >
                  {translations.deleteData}
                </button>
              </div>
            </>
          )}
          {modalStep === 4 && (
            <>
              <h3 className="modal-title">{translations.cardBack}</h3>
              <div
                className="modal-cardback"
                style={{
                  display: "flex",
                  marginTop: "20px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {/* Стандартные рубашки карт */}
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
                {/* Купленные рубашки */}
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
                  {translations.saveAndContinue}
                </button>
              </div>
            </>
          )}
          {modalStep === 5 && (
            <>
              <h3 className="modal-title">{translations.imageQuality}</h3>
              <div className="modal-quality">
                <div
                  className="modal-lang__item f-center-jcsb"
                  onClick={() => {
                    dispatch(setImageQuality("auto"));
                    setModalStep(1);
                  }}
                >
                  <div className="modal-lang__content">
                    <p className="modal-lang__content-title">
                      {translations.automatic}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.automaticDescription}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      imageQuality === "auto" ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.7403 17.0108C7.31573 17.0108 7.75862 16.7748 8.06896 16.3028L17.1465 2.2597C17.2565 2.09159 17.3373 1.92996 17.389 1.77478C17.4407 1.61961 17.4666 1.46444 17.4666 1.30927C17.4666 0.927802 17.3405 0.614224 17.0884 0.368535C16.8362 0.122845 16.5129 0 16.1185 0C15.847 0 15.6207 0.0549569 15.4397 0.164871C15.2586 0.268319 15.084 0.449353 14.9159 0.707974L6.70151 13.7231L2.49246 8.38901C2.18858 8.00754 1.81358 7.81681 1.36746 7.81681C0.97306 7.81681 0.646551 7.94289 0.387931 8.19504C0.12931 8.4472 0 8.76724 0 9.15517C0 9.32974 0.0290948 9.49784 0.0872845 9.65948C0.15194 9.82112 0.255388 9.98599 0.397629 10.1541L5.42133 16.3416C5.7834 16.7877 6.22306 17.0108 6.7403 17.0108Z"
                        fill="#71B21D"
                      />
                    </svg>
                  </span>
                </div>
                <div
                  className="modal-lang__item f-center-jcsb"
                  onClick={() => {
                    dispatch(setImageQuality("high"));
                    setModalStep(1);
                  }}
                >
                  <div className="modal-lang__content">
                    <p className="modal-lang__content-title">
                      {translations.high}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.highQualityDescription}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      imageQuality === "high" ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.7403 17.0108C7.31573 17.0108 7.75862 16.7748 8.06896 16.3028L17.1465 2.2597C17.2565 2.09159 17.3373 1.92996 17.389 1.77478C17.4407 1.61961 17.4666 1.46444 17.4666 1.30927C17.4666 0.927802 17.3405 0.614224 17.0884 0.368535C16.8362 0.122845 16.5129 0 16.1185 0C15.847 0 15.6207 0.0549569 15.4397 0.164871C15.2586 0.268319 15.084 0.449353 14.9159 0.707974L6.70151 13.7231L2.49246 8.38901C2.18858 8.00754 1.81358 7.81681 1.36746 7.81681C0.97306 7.81681 0.646551 7.94289 0.387931 8.19504C0.12931 8.4472 0 8.76724 0 9.15517C0 9.32974 0.0290948 9.49784 0.0872845 9.65948C0.15194 9.82112 0.255388 9.98599 0.397629 10.1541L5.42133 16.3416C5.7834 16.7877 6.22306 17.0108 6.7403 17.0108Z"
                        fill="#71B21D"
                      />
                    </svg>
                  </span>
                </div>
                <div
                  className="modal-lang__item f-center-jcsb"
                  onClick={() => {
                    dispatch(setImageQuality("low"));
                    setModalStep(1);
                  }}
                >
                  <div className="modal-lang__content">
                    <p className="modal-lang__content-title">
                      {translations.low}
                    </p>
                    <p className="modal-lang__content-subtitle">
                      {translations.lowQualityDescription}
                    </p>
                  </div>
                  <span
                    className={`modal-lang__select ${
                      imageQuality === "low" ? "active" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                  onClick={() => setModalStep(1)}
                >
                  {translations.backToSettings}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsPopup;
