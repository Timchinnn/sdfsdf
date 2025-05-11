import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, setCardBack } from "../../redux/actions";
import { cardBackService } from "services/api";
const SettingsPopup = ({ setActivePopup, activePopup }) => {
  const dispatch = useDispatch();
  const [purchasedShirts, setPurchasedShirts] = useState([]);
  const [cardBackStyle, setCardBackStyle] = useState("default");
  const [cardBacks, setCardBacks] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("ru");
  const [translations, setTranslations] = useState({});
  const settingsPopupRef = useRef(null);
  const darkTheme = useSelector((state) => state.theme);
  const [settingsVibration, setSettingsVibration] = useState(false);
  const [settingsNight, setSettingsNight] = useState(darkTheme);
  const [modalStep, setModalStep] = useState(1);
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
          const response = await fetch(
            `/user/${tg.initDataUnsafe.user.id}/shirts`
          );
          const data = await response.json();
          if (data && data.shirts) {
            setPurchasedShirts(data.shirts);
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
  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts: [
            "Вибрация",
            "Ночной режим",
            "Рубашка карты",
            "Язык",
            "Сохранить и продолжить",
            "Удалить аккаунт",
            "Вы уверены, что хотите стереть все данные на нашем сервисе?",
          ],
          targetLanguageCode: lang,
        }),
      });
      const translatedTexts = await response.json();
      setTranslations(
        translatedTexts.reduce((acc, translation) => {
          acc[translation.detectedLanguageCode] = translation.text;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Ошибка при переводе текста:", error);
    }
  };
  const handleCardBackChange = async (style) => {
    setCardBackStyle(style);
    dispatch(setCardBack(style));
    const tg = window.Telegram.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      const userId = tg.initDataUnsafe.user.id;
      await cardBackService.updateUserCardBack(userId, { style });
    }
  };
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
    setActivePopup(false);
    document.documentElement.classList.remove("fixed");
    setModalStep(1);
  };
  const setThemeMode = () => {
    setSettingsNight(!settingsNight);
    dispatch(setTheme(!settingsNight));
  };
  return (
    <div
      ref={settingsPopupRef}
      className={`modal ${activePopup ? "show" : ""}`}
    >
      <div className="modal-wrapper">
        {modalStep === 1 && (
          <>
            <div className="modal-settings">
              <div className="modal-settings__item f-center-jcsb">
                <p className="modal-settings__title">
                  {translations["Вибрация"] || "Вибрация"}
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
                  {translations["Ночной режим"] || "Ночной режим"}
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
                  {translations["Рубашка карты"] || "Рубашка карты"}
                </p>
                <div
                  className="modal-settings__select"
                  onClick={() => setModalStep(4)}
                >
                  <span>
                    {cardBacks.find((cb) => cb.image === cardBackStyle)?.name ||
                      "Default"}
                  </span>
                </div>
              </div>
              <div className="modal-settings__item f-center-jcsb">
                <p className="modal-settings__title">
                  {translations["Язык"] || "Язык"}
                </p>
                <select
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  value={selectedLanguage}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  {/* Добавьте другие языки по мере необходимости */}
                </select>
              </div>
            </div>
            <button
              type="button"
              className="modal-settings__delete"
              onClick={() => setModalStep(3)}
            >
              {translations["Удалить аккаунт"] || "Удалить аккаунт"}
            </button>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                {translations["Сохранить и продолжить"] ||
                  "Сохранить и продолжить"}
              </button>
            </div>
          </>
        )}
        {modalStep === 2 && (
          <>
            <h3 className="modal-title">
              {translations["Выбор языка"] || "Выбор языка"}
            </h3>
            {/* Добавьте логику для выбора языка */}
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                {translations["Сохранить и продолжить"] ||
                  "Сохранить и продолжить"}
              </button>
            </div>
          </>
        )}
        {modalStep === 3 && (
          <>
            <h3 className="modal-title">
              {translations[
                "Вы уверены, что хотите стереть все данные на нашем сервисе?"
              ] ||
                "Вы уверены, что хотите стереть все данные на нашем сервисе?"}
            </h3>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                {translations["Оставить аккаунт"] || "Оставить аккаунт"}
              </button>
              <button
                type="button"
                className="modal-btn modal-btn_delete"
                onClick={handleClickPopupClose}
              >
                {translations["Стереть все данные"] || "Стереть все данные"}
              </button>
            </div>
          </>
        )}
        {modalStep === 4 && (
          <>
            <h3 className="modal-title">
              {translations["Выбор рубашки"] || "Выбор рубашки"}
            </h3>
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
            </div>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={() => setModalStep(1)}
              >
                {translations["Применить"] || "Применить"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SettingsPopup;
