import React, { useState, useEffect } from "react";
import routeSets from "./routes";
import MainSection from "components/MainSection";
import Spinner from "components/Spinner";
import { userInitService } from "services/api";
import MobileNav from "components/MobileNav";
import { useSelector } from "react-redux";
import axios from "../../axios-controller";

// Импортируем необходимые локальные изображения
import Avatar from "assets/img/avatar.png";
import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
// Определяем URL-ы для остальных изображений
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const SetsPage = () => {
  // Состояния для данных пользователя
  const [userAvatar, setUserAvatar] = useState(null);
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  const [telegramId, setTelegramId] = useState(null);
  const [lot, setLot] = useState(null);
  const [lotCards, setLotCards] = useState([]);
  const [lotLoaded, setLotLoaded] = useState(false);
  const [level, setLevel] = useState("");
  const [currentExp, setCurrentExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);
  const [username, setUsername] = useState("Пользователь");
  // Состояния для отслеживания загрузки данных
  const [userPhotoLoaded, setUserPhotoLoaded] = useState(false);
  const [userCoinsLoaded, setUserCoinsLoaded] = useState(false);
  const [userLevelLoaded, setUserLevelLoaded] = useState(false);
  const [usernameLoaded, setUsernameLoaded] = useState(false);
  // Состояние для спиннера
  const [showSpinner, setShowSpinner] = useState(true);

  const [translations, setTranslations] = useState({
    sets: "Сет",
    tasks: "Задания",
    bonus: "Бонус",
    level: "Уровень города",
    mayor: "/ Мэр",
    comingSoon: "Скоро",
  });
  // Get language from Redux store
  const language = useSelector((state) => state.language);
  useEffect(() => {
    const fetchLotData = async () => {
      try {
        // Получаем информацию о лоте
        const lotResponse = await axios.get("/card-lots");
        if (lotResponse.data && lotResponse.data.length > 0) {
          const currentLot = lotResponse.data[0]; // Берем первый лот
          setLot(currentLot);

          // Получаем карты для лота
          const cardsResponse = await axios.get(
            `/card-lots/${currentLot.id}/cards`
          );
          if (cardsResponse.data) {
            setLotCards(cardsResponse.data);
          }
          console.log(currentLot);
          console.log(cardsResponse.data);
          console.log();
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных лота:", error);
      }
      setLotLoaded(true);
    };
    fetchLotData();
  }, []);
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      setTelegramId(tg.initDataUnsafe.user.id);
    }
  }, []);
  useEffect(() => {
    if (language === "ru") {
      setTranslations({
        sets: "Сет",
        tasks: "Задания",
        bonus: "Бонус",
        level: "Уровень города",
        mayor: "/ Мэр",
        comingSoon: "Скоро",
      });
    } else if (language === "en") {
      setTranslations({
        sets: "Set",
        tasks: "Tasks",
        bonus: "Bonus",
        level: "City Level",
        mayor: "/ Mayor",
        comingSoon: "Coming Soon",
      });
    } else if (language === "it") {
      setTranslations({
        sets: "Set",
        tasks: "Compiti",
        bonus: "Bonus",
        level: "Livello città",
        mayor: "/ Sindaco",
        comingSoon: "Prossimamente",
      });
    } else if (language === "es") {
      setTranslations({
        sets: "Conjunto",
        tasks: "Tareas",
        bonus: "Bono",
        level: "Nivel de ciudad",
        mayor: "/ Alcalde",
        comingSoon: "Próximamente",
      });
    } else if (language === "de") {
      setTranslations({
        sets: "Set",
        tasks: "Aufgaben",
        bonus: "Bonus",
        level: "Stadtlevel",
        mayor: "/ Bürgermeister",
        comingSoon: "Demnächst",
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
  // Проверка загрузки всех данных и отключение спиннера
  useEffect(() => {
    if (
      userPhotoLoaded &&
      userCoinsLoaded &&
      userLevelLoaded &&
      usernameLoaded &&
      lotLoaded // Добавляем проверку загрузки лота
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
    lotLoaded, // Добавляем в зависимости
  ]);
  return (
    <section className="sets">
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
              {telegramId === 6243418179 ? (
                <div></div>
              ) : (
                <div
                  className="block-style"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    marginTop: "6px",
                  }}
                >
                  {translations.comingSoon}
                </div>
              )}

              {/* Здесь будет остальной контент после раскомментирования */}
            </>
          )}
        </div>
      </div>
      <MobileNav />
    </section>
  );
};
export { routeSets };
export default SetsPage;
