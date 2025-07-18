import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { routeTasks } from "pages/TasksPage";
import { routeSets } from "pages/SetsPage";
import { routeBonus } from "pages/BonusPage";
import SettingsPopup from "components/SettingsPopup";
import { userInitService } from "services/api";
import { useSelector } from "react-redux";
const MainSection = ({
  hourlyIncome: propHourlyIncome,
  coins: propCoins,
  level,
  currentExp,
  expForNextLevel,
  loaded,
  userAvatar,
  defaultAvatar,
  timeIcon,
  moneyIcon,
  cardImg,
  taskImg,
  bonusImg,
  username,
  translations = {
    sets: 'Сет',
    tasks: 'Задания',
    bonus: 'Бонус',
    level: 'Уровень города',
    mayor: '/ Мэр',
    collect: 'Забрать'
  },  // Получаем username из пропсов
}) => {
  const language = useSelector((state) => state.language);
  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const telegramId = tg ? tg.id : null;
  const [coins, setCoins] = useState(propCoins || 0);
  const [hourlyIncome, setHourlyIncome] = useState(propHourlyIncome || 0);
  const [activePopup, setActivePopup] = useState(false);
  const [avatar, setAvatar] = useState(userAvatar || defaultAvatar);

  // Логика накопленного дохода
  const MAX_ACCUMULATED_INCOME = 1000000;
  const [accumulatedIncome, setAccumulatedIncome] = useState(0);
  const [showIncomePopup, setShowIncomePopup] = useState(
    () => !sessionStorage.getItem("incomePopupShown")
  );
//   const [translations, setTranslations] = useState({
//   sets: "Сет",
//   tasks: "Задания",
//   bonus: "Бонус",
//   level: "Уровень города",
//   mayor: "/ Мэр",
//   collect: "Забрать",
//   // Добавьте другие переводы по мере необходимости
// });
// const updateTranslations = (language) => {
//   if (language === "ru") {
//     setTranslations({
//       sets: "Сет",
//       tasks: "Задания",
//       bonus: "Бонус",
//       level: "Уровень города",
//       mayor: "/ Мэр",
//       collect: "Забрать",
//       // Добавьте другие переводы для русского языка
//     });
//   } else if (language === "en") {
//     setTranslations({
//       sets: "Set",
//       tasks: "Tasks",
//       bonus: "Bonus",
//       level: "City Level",
//       mayor: "/ Mayor",
//       collect: "Collect",
//       // Добавьте другие переводы для английского языка
//     });
//   }
// };useEffect(() => {
//   updateTranslations(language);
// }, [language]);
  useEffect(() => {
    if (showIncomePopup) {
      sessionStorage.setItem("incomePopupShown", "true");
    }
  }, [showIncomePopup]);
  useEffect(() => {
    if (telegramId) {
      userInitService
        .getAccumulatedIncome(telegramId)
        .then((response) => {
          const income = parseFloat(response.data.accumulatedIncome) || 0;
          setAccumulatedIncome(income);
        })
        .catch((error) => {
          console.error("Ошибка при получении накопленного дохода", error);
          setAccumulatedIncome(0);
        });
    }
  }, [telegramId]);
  useEffect(() => {
    const interval = setInterval(() => {
      setAccumulatedIncome((prev) => {
        const addition = hourlyIncome / 3600;
        const nextValue = prev + addition;
        return nextValue > MAX_ACCUMULATED_INCOME
          ? MAX_ACCUMULATED_INCOME
          : nextValue;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hourlyIncome]);
  const handleCollectIncome = () => {
    userInitService
      .collectIncome(telegramId)
      .then((response) => {
        const { newCoins } = response.data;
        setCoins(newCoins);
        setAccumulatedIncome(0);
        setShowIncomePopup(false);
      })
      .catch((error) => console.error("Ошибка при сборе дохода", error));
  };
  useEffect(() => {
    setHourlyIncome(propHourlyIncome);
  }, [propHourlyIncome]);
  useEffect(() => {
    setCoins(propCoins);
  }, [propCoins]);
  useEffect(() => {
    setAvatar(userAvatar || defaultAvatar);
  }, [userAvatar, defaultAvatar]);
  const handleOpenSettings = () => {
    document.documentElement.classList.add("fixed");
    setActivePopup(true);
  };
  return (
    <div className="main-section">
      <div className="main-section__wrap">
        <div className="main-section__item">
          <div className="main-head f-jcsb block-style">
            <div className="main-head__offer flex">
              <div className="main-head__avatar">
                <img src={avatar} alt="" />
              </div>
              <div className="main-head__content">
                <div className="main-head__user">
                  {username} <span>{translations.mayor}</span>
                </div>
                <p className="main-head__level">{translations.level} {level}</p>
                <div className="main-head__progress">
                  <div
                    className="main-head__progress-bar"
                    style={{
                      width: `${(currentExp / expForNextLevel) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="main-head__settings" onClick={handleOpenSettings}>
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.2129 0.462668C8.2947 -0.154222 9.6153 -0.154222 10.6971 0.462668C10.7052 0.467298 10.7132 0.472057 10.7212 0.476937L16.2901 3.88816C17.389 4.52104 18 5.66454 18 6.90531V13.1871C18 14.3868 17.4196 15.5621 16.3652 16.121L10.8112 19.5231C10.8032 19.5279 10.7952 19.5327 10.7871 19.5373C9.7053 20.1542 8.3847 20.1542 7.3029 19.5373C7.2948 19.5327 7.2868 19.5279 7.2788 19.5231L1.70985 16.1118C0.61095 15.4789 0 14.3354 0 13.0947V6.90531C0 5.66568 0.60984 4.52315 1.70685 3.88991L7.1832 0.480357C7.193 0.474267 7.2029 0.468368 7.2129 0.462668ZM8.1006 2.07013L2.62675 5.47807C2.61697 5.48416 2.60708 5.49006 2.59708 5.49576C2.0842 5.78822 1.8 6.30341 1.8 6.90531V13.0947C1.8 13.6966 2.0842 14.2118 2.59708 14.5042C2.60519 14.5089 2.61324 14.5136 2.62121 14.5185L8.188 17.9285C8.7205 18.2271 9.3695 18.2271 9.902 17.9285L15.4688 14.5185C15.488 14.5068 15.5075 14.4958 15.5275 14.4855C15.8924 14.2983 16.2 13.8226 16.2 13.1871V6.90531C16.2 6.30341 15.9158 5.78822 15.4029 5.49576C15.3948 5.49113 15.3868 5.48637 15.3788 5.48149L9.812 2.07155C9.2803 1.77339 8.6326 1.77292 8.1006 2.07013ZM9 8.1062C7.9562 8.1062 7.11 8.9748 7.11 10.0462C7.11 11.1176 7.9562 11.9861 9 11.9861C10.0438 11.9861 10.89 11.1176 10.89 10.0462C10.89 8.9748 10.0438 8.1062 9 8.1062ZM5.30999 10.0462C5.30999 7.95439 6.96206 6.25866 9 6.25866C11.0379 6.25866 12.69 7.95439 12.69 10.0462C12.69 12.138 11.0379 13.8337 9 13.8337C6.96206 13.8337 5.30999 12.138 5.30999 10.0462Z"
                  fill="#AAB2BD"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="main-section__item">
          <ul className="main-menu block-style f-center-jcsb">
            <li className="main-menu__item">
              <NavLink to={routeSets()} className="main-menu__card">
                <div className="main-menu__img f-center-center">
                  <img src={cardImg} alt="Сет" style={{ width: "58px" }} />
                </div>
                <p className="main-menu__title">{translations.sets}</p>
              </NavLink>
            </li>
            <li className="main-menu__item">
              <NavLink to={routeTasks()} className="main-menu__card">
                <div className="main-menu__img f-center-center">
                  <img src={taskImg} alt="Задания" style={{ width: "46px" }} />
                </div>
                <p className="main-menu__title">{translations.tasks}</p>
              </NavLink>
            </li>
            <li className="main-menu__item">
              <NavLink to={routeBonus()} className="main-menu__card">
                <div className="main-menu__img f-center-center">
                  <img src={bonusImg} alt="Бонус" style={{ width: "47px" }} />
                </div>
                <p className="main-menu__title">{translations.bonus}</p>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="main-section__item">
          <ul className="main-params f-center-jcsb">
            <li className="main-params__item">
              <div className="main-params__card f-center">
                <div className="main-params__icon f-center-center">
                  <img src={timeIcon} alt="time" />
                </div>
                <p className="main-params__title">
                  {typeof hourlyIncome === "number"
                    ? hourlyIncome.toFixed(2)
                    : "0.00"}{" "}
                  K/H
                </p>
              </div>
            </li>
            <li className="main-params__item">
              <div className="main-params__card f-center">
                <div className="main-params__icon f-center-center">
                  <img src={moneyIcon} alt="money" />
                </div>
                <p className="main-params__title">{coins}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {showIncomePopup && accumulatedIncome > 0 && (
        <div
          className="income-popup"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="income-popup__content"
            style={{
              background: "#f5f5f5",
              borderRadius: "16px",
              padding: "24px",
              width: "90%",
              maxWidth: "320px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="income-popup__amount"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <img
                src={moneyIcon}
                alt="coins"
                className="income-popup__icon"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              />
              <p
                className="income-popup__text"
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                {Math.floor(accumulatedIncome)} / {MAX_ACCUMULATED_INCOME}
              </p>
            </div>
            <button
              onClick={handleCollectIncome}
              className="income-popup__button"
              style={{
                background: "#71B21D",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 32px",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
                width: "100%",
                transition: "background-color 0.2s",
                opacity: accumulatedIncome === 0 ? 0.6 : 1,
                pointerEvents: accumulatedIncome === 0 ? "none" : "auto",
              }}
              disabled={accumulatedIncome === 0}
            >
              {translations.collect}
            </button>
          </div>
        </div>
      )}
      <div className="main-section__bg">
        <svg
          width="375"
          height="511"
          viewBox="0 0 375 511"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.24" filter="url(#filter0_f_80_14521)">
            <circle
              cx="188.04"
              cy="245.959"
              r="124.272"
              transform="rotate(92.6861 188.04 245.959)"
              fill="#71B21D"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_80_14521"
              x="-76.2342"
              y="-18.3155"
              width="528.549"
              height="528.549"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="70"
                result="effect1_foregroundBlur_80_14521"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <SettingsPopup
        setActivePopup={setActivePopup}
        activePopup={activePopup}
      />
    </div>
  );
};
export default MainSection;
