import React, { useState, useEffect } from "react";
import { userInitService } from "services/api";
import Spinner from "components/Spinner";
import routeMain from "./routes";
import MainSection from "components/MainSection";
import MobileNav from "components/MobileNav";
import ShopPopup from "components/ShopPopup";
import MainCarousel from "components/MainCarousel";
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
  useEffect(() => {
    setUserDataLoaded(true);
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);
  // Получение монет и hourly income
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
  // Перемещённая функция fetchUserLevel
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
    setTimeout(function () {
      document.documentElement.classList.add("fixed");
      setSelectedPhoto(photo);
      setActiveShopPopup(true);
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
              />
              <div className="main-game">
                <MainCarousel
                  getActiveSlide={3}
                  handleOpenPopup={(photo) => handleOpenPopup(photo)}
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
