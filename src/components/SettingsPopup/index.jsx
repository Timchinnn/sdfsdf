import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
// import DefaultImg from "assets/img/default-card.png";
// import Style1CardBack from "assets/img/card1.png";
// import Style2CardBack from "assets/img/card2.png";
import { setTheme, setCardBack } from "../../redux/actions";
import { routeAdmin } from "pages/AdminPanel";
import { NavLink } from "react-router-dom";
import { cardBackService } from "services/api";

// import { setTheme } from "../../redux/actions";

const SettingsPopup = ({ setActivePopup, activePopup }) => {
  const dispatch = useDispatch();

  const [cardBackStyle, setCardBackStyle] = useState("default");
  const [cardBacks, setCardBacks] = useState([]);
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
        // Update the API endpoint to use the correct path
        await cardBackService.updateUserCardBack(userId, {
          style: style,
        });
      }
    } catch (error) {
      console.error("Error updating card back:", error);
    }
  };
  const darkTheme = useSelector((state) => state.theme);

  console.log(darkTheme);
  // const cardBackStyles = [
  //   {
  //     id: "default",
  //     image: DefaultImg,
  //   },
  //   {
  //     id: "style1",
  //     image: Style1CardBack,
  //   },
  //   {
  //     id: "style2",
  //     image: Style2CardBack,
  //   },
  // ];
  const [settingsVibration, setSettingsVibration] = useState(false);
  const [settingsNight, setSettingsNight] = useState(darkTheme);
  const [modalStep, setModalStep] = useState(1);
  const [seletLang, setSelectLang] = useState(1);

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
    setActivePopup(false);
    document.documentElement.classList.remove("fixed");
    setModalStep(1);
  };

  const setThemeMode = () => {
    setSettingsNight(!settingsNight);
    dispatch(setTheme(!settingsNight));
  };

  // if (settingsNight === true) {
  //     document.body.classList.add("dark");
  //   }
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
            <div className="modal-settings__item f-center-jcsb">
                {tg?.initDataUnsafe?.user?.id === 7241281378 && (
                  <>
                    <p className="modal-settings__title">Админ панель</p>
                    <NavLink to={routeAdmin()} className="modal-settings__select">
                      <span>Перейти</span>
                    </NavLink>
                  </>
                )}
              </div>
              <div className="modal-settings__item f-center-jcsb">
                <p className="modal-settings__title">Вибрация</p>
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
                <p className="modal-settings__title">Ночной режим</p>
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
                <p className="modal-settings__title">Рубашка карты</p>
                <div
                  className="modal-settings__select"
                  onClick={() => setModalStep(4)}
                >
                  <span>
                    {cardBacks.find((cb) => cb.image === cardBackStyle)?.name ||
                      "Default"}
                  </span>{" "}
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
                <p className="modal-settings__title">Язык</p>
                <div
                  className="modal-settings__lang f-center"
                  onClick={() => setModalStep(2)}
                >
                  Русский
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
              Удалить аккаунт
            </button>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                Сохранить и продолжить
              </button>
            </div>
          </>
        )}
        {modalStep === 2 && (
          <>
            <h3 className="modal-title">Язык</h3>
            <div className="modal-lang">
              <div
                className="modal-lang__item f-center-jcsb"
                onClick={() => setSelectLang(1)}
              >
                <div className="modal-lang__content">
                  <p className="modal-lang__content-title">Russian</p>
                  <p className="modal-lang__content-subtitle">Русский</p>
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
                onClick={() => setSelectLang(2)}
              >
                <div className="modal-lang__content">
                  <p className="modal-lang__content-title">English</p>
                  <p className="modal-lang__content-subtitle">Русский</p>
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
                onClick={() => setSelectLang(3)}
              >
                <div className="modal-lang__content">
                  <p className="modal-lang__content-title">Italian</p>
                  <p className="modal-lang__content-subtitle">Italiano</p>
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
                onClick={() => setSelectLang(4)}
              >
                <div className="modal-lang__content">
                  <p className="modal-lang__content-title">Spanish</p>
                  <p className="modal-lang__content-subtitle">Español</p>
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
                onClick={() => setSelectLang(5)}
              >
                <div className="modal-lang__content">
                  <p className="modal-lang__content-title">German</p>
                  <p className="modal-lang__content-subtitle">Deutsch</p>
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
                Сохранить и продолжить
              </button>
              <button
                type="button"
                className="modal-btn modal-btn_default"
                onClick={handleClickPopupClose}
              >
                Сбросить
              </button>
            </div>
          </>
        )}
        {modalStep === 3 && (
          <>
            <h3 className="modal-title">
              Вы уверенны, что хотите стереть
              <br />
              все данные на нашем сервисе?
            </h3>
            <div className="modal-nav">
              <button
                type="button"
                className="modal-btn"
                onClick={handleClickPopupClose}
              >
                Оставить аккаунт
              </button>
              <button
                type="button"
                className="modal-btn modal-btn_delete"
                onClick={handleClickPopupClose}
              >
                Стереть все данные
              </button>
            </div>
          </>
        )}
        {modalStep === 4 && (
          <>
            <h3 className="modal-title">Выбор рубашки</h3>
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
                    src={`${cardBack.image}`}
                    alt={cardBack.name}
                    style={{
                      marginRight: "20px",
                      height: "245px",
                    }}
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
                Применить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPopup;
