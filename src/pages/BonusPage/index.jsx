import React, { useState, useEffect } from "react";
import routeBonus from "./routes";
import MainSection from "components/MainSection";
import { bonusCodeService, userInitService } from "../../services/api";
import DefaultImg from "assets/img/default-img.png";
import CoinIcon from "assets/img/coin-icon.svg";
import StarIcon from "assets/img/star-icon.svg";
import MobileNav from "components/MobileNav";
import Spinner from "components/Spinner";
// Импортируем необходимые локальные изображения
import Avatar from "assets/img/avatar.png";
import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
import { useSelector } from "react-redux";

// Определяем URL-ы для остальных изображений, которые используются в MainSection
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const BonusPage = () => {
  const [code, setCode] = useState("");
  const [history, setHistory] = useState([]);
  const tg = window.Telegram?.WebApp;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Состояния для данных пользователя
  const [userAvatar, setUserAvatar] = useState(null);
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState("");
  const [currentExp, setCurrentExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);
  const [username, setUsername] = useState("Пользователь");

  // Состояния для отслеживания загрузки данных
  const [userPhotoLoaded, setUserPhotoLoaded] = useState(false);
  const [userCoinsLoaded, setUserCoinsLoaded] = useState(false);
  const [userLevelLoaded, setUserLevelLoaded] = useState(false);
  const [usernameLoaded, setUsernameLoaded] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Состояние для спиннера
  const [showSpinner, setShowSpinner] = useState(true);
    const [translations, setTranslations] = useState({
      sets: "Сет",
      tasks: "Задания", 
      bonus: "Бонус",
      level: "Уровень города",
      mayor: "/ Мэр",
    code: "Код",
    enterCodeAndGetBonus: "Введите код и получите бонус",
    activationHistory: "История активаций",
    activated: "Активирован",
    activating: "Активация...",
    apply: "Применить",
            enterCode: "Введите код"

  });
    const language = useSelector((state) => state.language);
  useEffect(() => {
    if (language === "ru") {
      setTranslations({
        sets: "Сет",
      tasks: "Задания", 
      bonus: "Бонус",
      level: "Уровень города",
      mayor: "/ Мэр",
        code: "Код",
        enterCodeAndGetBonus: "Введите код и получите бонус",
        activationHistory: "История активаций", 
        activated: "Активирован",
        activating: "Активация...",
        apply: "Применить",
                enterCode: "Введите код"

      });
    } else if (language === "en") {
      setTranslations({
        sets: "Set",
            tasks: "Tasks",
            bonus: "Bonus",
            level: "City Level", 
            mayor: "/ Mayor",
        code: "Code",
        enterCodeAndGetBonus: "Enter code and get bonus",
        activationHistory: "Activation History",
        activated: "Activated",
        activating: "Activating...", 
        apply: "Apply",
                enterCode: "Enter code"

      });
    }
  }, [language]);
  // Получаем username из Telegram API
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const tgUsername = tg.initDataUnsafe.user.username || "Пользователь";
      setUsername(tgUsername);
    }
    setUsernameLoaded(true);
  }, []);
  // Получение аватара пользователя
  useEffect(() => {
    const initializeUserPhoto = async () => {
      const tg = window.Telegram.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        try {
          const telegram_id = tg.initDataUnsafe.user.id;
          const userPhoto = tg.initDataUnsafe.user.photo_url;
          const existingUser = await userInitService.getUser(telegram_id);
          const lastPhotoUpdate = existingUser.data?.last_photo_update;
          const now = new Date();
          const lastUpdate = lastPhotoUpdate ? new Date(lastPhotoUpdate) : null;
          const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
          if (
            !lastPhotoUpdate ||
            !lastUpdate ||
            now - lastUpdate >= twoDaysInMs
          ) {
            if (userPhoto) {
              await userInitService.updateUserPhoto(telegram_id, userPhoto);
              setUserAvatar(userPhoto);
            } else {
              setUserAvatar(null);
            }
          } else {
            setUserAvatar(existingUser.data.photo_url || null);
          }
        } catch (error) {
          console.error("Ошибка при инициализации фото пользователя:", error);
          setUserAvatar(null);
        }
      }
      setUserPhotoLoaded(true);
    };

    initializeUserPhoto();
  }, []);
  // Получение монет и почасового дохода
  useEffect(() => {
    const fetchUserCoins = async () => {
      const tg = window.Telegram.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        try {
          const telegram_id = tg.initDataUnsafe.user.id;
          const response = await userInitService.getUser(telegram_id);
          if (response.data && response.data.coins) {
            setCoins(response.data.coins);
          }
          const hourlyIncomeResponse = await userInitService.getHourlyIncome(
            telegram_id
          );
          if (
            hourlyIncomeResponse.data &&
            hourlyIncomeResponse.data.hourly_income
          ) {
            setHourlyIncome(hourlyIncomeResponse.data.hourly_income);
          }
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
        }
      }
      setUserCoinsLoaded(true);
    };
    fetchUserCoins();
  }, []);
  // Получение уровня и опыта пользователя
  useEffect(() => {
    const fetchUserLevel = async () => {
      const tg = window.Telegram.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        try {
          const telegram_id = tg.initDataUnsafe.user.id;
          const response = await userInitService.getUserLevel(telegram_id);
          setLevel(response.data.level);
          setCurrentExp(response.data.currentExperience);
          setExpForNextLevel(response.data.experienceToNextLevel);
        } catch (error) {
          console.error("Ошибка при получении уровня пользователя:", error);
        }
      }
      setUserLevelLoaded(true);
    };
    fetchUserLevel();
  }, []);
  // Получение истории активаций бонусов
  useEffect(() => {
    const fetchHistory = async () => {
      if (tg?.initDataUnsafe?.user?.id) {
        try {
          const response = await bonusCodeService.getHistory(
            tg.initDataUnsafe.user.id
          );
          setHistory(response.data);
        } catch (err) {
          console.error("Ошибка при получении истории:", err);
        }
      }
      setHistoryLoaded(true);
    };
    fetchHistory();
  }, []);
  // Проверка загрузки всех данных и отключение спиннера
  useEffect(() => {
    if (
      userPhotoLoaded &&
      userCoinsLoaded &&
      userLevelLoaded &&
      usernameLoaded &&
      historyLoaded
    ) {
      // Добавляем небольшую задержку для плавности
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    userPhotoLoaded,
    userCoinsLoaded,
    userLevelLoaded,
    usernameLoaded,
    historyLoaded,
  ]);
  const handleActivateCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!tg || !tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        throw new Error("Данные пользователя Telegram не найдены");
      }
      const telegram_id = tg.initDataUnsafe.user.id;
      const response = await bonusCodeService.activateCode(telegram_id, code);
      if (response.data.success) {
        // Обновляем историю после активации
        const historyResponse = await bonusCodeService.getHistory(telegram_id);
        setHistory(historyResponse.data);
        tg.showPopup({
          title: "Успех!",
          message: "Бонус код успешно активирован",
          buttons: [{ type: "ok" }],
        });
        setCode("");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Ошибка при активации кода");
      tg.showPopup({
        title: "Ошибка",
        message: error.response?.data?.error || "Ошибка при активации кода",
        buttons: [{ type: "ok" }],
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="bonus">
      <div className="container">
        <div className="tasks-inner">
          {showSpinner ? (
            <Spinner loading={true} size={50} />
          ) : (
            <>
              <MainSection
                hourlyIncome={hourlyIncome}
                coins={coins}
                level={level}
                currentExp={currentExp}
                expForNextLevel={expForNextLevel}
                loaded={true}
                userAvatar={userAvatar}
                defaultAvatar={Avatar}
                timeIcon={TimeIcon}
                moneyIcon={MoneyIcon}
                cardImg={cardImg}
                taskImg={taskImg}
                bonusImg={bonusImg}
                username={username}
                translations={translations}
              />
              <div className="bonus-wrap">
                <div className="bonus-promo block-style">
                  <div className="section-content">
                    <h2 className="section-content__title">{translations.code}</h2>
                    <p className="section-content__text">
                      {translations.enterCodeAndGetBonus}
                    </p>
                  </div>
                  <div className="bonus-promo__code">
                    <div className="bonus-promo__code-input">
                      <input
                        type="text"
                        name="promo"
                        placeholder={translations.enterCode}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      type="button"
                      className="bonus-promo__code-btn"
                      onClick={handleActivateCode}
                      disabled={isLoading || !code}
                    >
                      {isLoading ? translations.activating : translations.apply}
                    </button>
                  </div>
                </div>
                <div className="bonus-more">
                  <div className="friends-block__head f-center-jcsb">
                    <h2 className="section-content__title">
                      {translations.activationHistory}
                    </h2>
                  </div>
                  <ul className="friends-list">
                    {history.map((item) => {
                      // Пытаемся распарсить поле rewards, если оно заполнено
                      let rewardsObj = {};
                      try {
                        rewardsObj =
                          item.rewards &&
                          typeof item.rewards === "string" &&
                          item.rewards.trim() !== ""
                            ? JSON.parse(item.rewards)
                            : item.rewards || {};
                      } catch (e) {
                        console.error("Ошибка парсинга rewards:", e);
                      }
                      return (
                        <li key={item.id} className="friends-list__item">
                          <div className="friends-list__card block-style flex">
                            <div className="friends-list__content">
                              <h3 className="friends-list__title">
                                {item.name || "Бонус код"}
                              </h3>
                              <p className="friends-list__code">{item.code}</p>
                              <ul className="friends-params f-center">
                                {rewardsObj.coins > 0 && (
                                  <li className="friends-params__item f-center">
                                    <img src={CoinIcon} alt="Монеты" />
                                    {rewardsObj.coins}
                                  </li>
                                )}
                                {rewardsObj.experience > 0 && (
                                  <li className="friends-params__item f-center">
                                    <img src={StarIcon} alt="Опыт" />
                                    {rewardsObj.experience}
                                  </li>
                                )}
                                {rewardsObj.energy > 0 && (
                                  <li className="friends-params__item f-center">
                                    <span role="img" aria-label="энергия">
                                      🔥
                                    </span>
                                    {rewardsObj.energy}
                                  </li>
                                )}
                                {rewardsObj.cardId && (
                                  <li className="friends-params__item f-center">
                                    <span role="img" aria-label="карта">
                                      🃏
                                    </span>
                                    {/* Карта #{rewardsObj.cardId} */}
                                  </li>
                                )}
                              </ul>
                              <p className="friends-list__date">
                                Активирован:{" "}
                                {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <MobileNav />
    </section>
  );
};
export { routeBonus };
export default BonusPage;
