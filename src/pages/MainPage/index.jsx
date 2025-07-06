import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { userInitService } from "services/api";
import Spinner from "components/Spinner";
import routeMain from "./routes";
import MainSection from "components/MainSection";
import MobileNav from "components/MobileNav";
import ShopPopup from "components/ShopPopup";
import MainCarousel from "components/MainCarousel";
// Импортируем необходимые локальные изображения
import Avatar from "assets/img/avatar.png";
import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
// Определяем URL-ы для остальных изображений, которые используются в MainSection
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const MainPage = () => {
  const [activeShopPopup, setActiveShopPopup] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [shouldUpdateCarousel, setShouldUpdateCarousel] = useState(false);

  // Состояния для данных пользователя
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState("");
  const [currentExp, setCurrentExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);
  const [userAvatar, setUserAvatar] = useState(null);
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
    collect: "Забрать",
    slowConnectionTitle: "Внимание",
    slowConnectionMessage: "Обнаружено медленное соединение. Качество изображений будет снижено для улучшения производительности.",
  });
  // Get language from Redux store
  const language = useSelector((state) => state.language);
  // const [isLoadingCardBack, setIsLoadingCardBack] = useState(true);
    const [cardBackStyle, setCardBackStyle] = useState(null);
    
    // const swiperRef = useRef(null);
    useEffect(() => {
        const loadCardBack = async () => {
            try {
                const tg = window.Telegram.WebApp;
                if (tg?.initDataUnsafe?.user?.id) {
                    const response = await cardBackService.getUserCardBack(tg.initDataUnsafe.user.id);
                    if (response.data.style) {
                        setCardBackStyle(response.data.style);
                    }
                }
            } catch (error) {
                console.error("Error loading card back:", error);
            } 
        };
        loadCardBack();
    }, []);
  // Update translations when language changes
  useEffect(() => {
    if (language === "ru") {
      setTranslations({
        sets: "Сет",
        tasks: "Задания",
        bonus: "Бонус", 
        level: "Уровень города",
        mayor: "/ Мэр",
        collect: "Забрать",
        slowConnectionTitle: "Внимание",
        slowConnectionMessage: "Обнаружено медленное соединение. Качество изображений будет снижено для улучшения производительности.",
      });
    } else if (language === "en") {
      setTranslations({
        sets: "Set",
        tasks: "Tasks", 
        bonus: "Bonus",
        level: "City Level",
        mayor: "/ Mayor",
        collect: "Collect",
        slowConnectionTitle: "Attention",
        slowConnectionMessage: "A slow connection has been detected. The image quality will be reduced to improve performance.",
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
      usernameLoaded
    ) {
      // Добавляем небольшую задержку для плавности
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userPhotoLoaded, userCoinsLoaded, userLevelLoaded, usernameLoaded]);
  const handleOpenPopup = (photo) => {
    document.documentElement.classList.add("fixed");
    setSelectedPhoto(photo);
    setActiveShopPopup(true);

    // Обновляем hourly income и coins при открытии popup
    if (photo) {
      setHourlyIncome((prevIncome) => {
        const currentIncome = parseFloat(prevIncome) || 0;
        const additionalIncome = parseFloat(photo?.hourly_income) || 0;
        const newIncome = currentIncome + additionalIncome;
        return Number(newIncome.toFixed(2));
      });

      const newCoins = photo.price || 0;
      setCoins((prevCoins) => prevCoins + newCoins);
    }
  };
  const handleClosePopup = () => {
    document.documentElement.classList.remove("fixed");
    setActiveShopPopup(false);
  };
  const handlePopupButtonClick = () => {
    setShouldUpdateCarousel(true);
  };
  return (
    <section className="main">
      <div className="container">
        <div className="friends-inner">
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
              <div className="main-game">
                <MainCarousel
                  getActiveSlide={3}
                  handleOpenPopup={handleOpenPopup}
                  shouldUpdate={shouldUpdateCarousel}
                  onUpdateComplete={() => setShouldUpdateCarousel(false)}
                  translations={translations}
                                                  cardBackStyle={cardBackStyle} 

                />
              </div>
            </>
          )}
        </div>
      </div>
      <ShopPopup
        active={activeShopPopup}
        main={true}
        setActivePopup={setActiveShopPopup}
        handleClosePopup={handleClosePopup}
        selectedPhoto={selectedPhoto}
        onButtonClick={handlePopupButtonClick}
      />
      <MobileNav />
    </section>
  );
};
export { routeMain };
export default MainPage;
