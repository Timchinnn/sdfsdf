import React, { useState, useEffect } from "react";
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
  const [showSpinner, setShowSpinner] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [shouldUpdateCarousel, setShouldUpdateCarousel] = useState(false);
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  // Состояния для уровня пользователя и опыта
  const [level, setLevel] = useState("");
  const [currentExp, setCurrentExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);
  const [userAvatar, setUserAvatar] = useState(null); // Изначально null
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
              setUserAvatar(null); // Если фото нет, оставляем null
            }
          } else {
            setUserAvatar(existingUser.data.photo_url || null);
          }
        } catch (error) {
          console.error("Error initializing user photo:", error);
          setUserAvatar(null);
        }
      }
    };

    if (userDataLoaded) {
      initializeUserPhoto();
    }
  }, [userDataLoaded]);
  useEffect(() => {
    setUserDataLoaded(true);
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);
  // Получаем монеты и hourly income
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
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserCoins();
  }, []);
  // Получаем уровень пользователя и опыт прямо в MainPage
  useEffect(() => {
    if (userDataLoaded) {
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
            console.error("Error fetching user level:", error);
          }
        }
      };
      fetchUserLevel();
    }
  }, [userDataLoaded]);
  const handleOpenPopup = (photo) => {
    setTimeout(() => {
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
    }, 1000);
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
          {showSpinner && <Spinner loading={true} size={50} />}
          {!showSpinner && (
            <>
              <MainSection
                hourlyIncome={hourlyIncome}
                coins={coins}
                level={level}
                currentExp={currentExp}
                expForNextLevel={expForNextLevel}
                loaded={userDataLoaded}
                userAvatar={userAvatar} // Передаем актуальный аватар пользователя (может быть null)
                defaultAvatar={Avatar} // Передаем дефолтное изображение
                timeIcon={TimeIcon}
                moneyIcon={MoneyIcon}
                cardImg={cardImg}
                taskImg={taskImg}
                bonusImg={bonusImg}
              />
              <div className="main-game">
                <MainCarousel
                  getActiveSlide={3}
                  handleOpenPopup={handleOpenPopup}
                  shouldUpdate={shouldUpdateCarousel}
                  onUpdateComplete={() => setShouldUpdateCarousel(false)}
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
