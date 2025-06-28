import React, { useState, useEffect } from "react";
import { userInitService } from "services/api";
import Spinner from "components/Spinner";

import routeMain from "./routes";
import MainSection from "components/MainSection";
import MobileNav from "components/MobileNav";

// import DefaultImg from 'assets/img/default-card.png';

// import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/scss";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Import Swiper modules
// import { EffectCoverflow } from 'swiper/modules';
import ShopPopup from "components/ShopPopup";
import MainCarousel from "components/MainCarousel";

const MainPage = () => {
  const [activeShopPopup, setActiveShopPopup] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  useEffect(() => {
    setUserDataLoaded(true);

    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);
  // const swiperRef = useRef(null);

  // slideChange
  // const handleSlideChange = () => {
  //     if (swiperRef.current) {
  //       console.log("Current active index:", swiperRef.current.swiper.activeIndex);
  //     }
  //   };

  //   const goToNextSlide = () => {
  //     if (swiperRef.current) {
  //       swiperRef.current.slideNext();
  //     }
  //   };

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [shouldUpdateCarousel, setShouldUpdateCarousel] = useState(false);
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);

  // Fetch initial coin count from user data
  useEffect(() => {
    const fetchUserCoins = async () => {
      const tg = window.Telegram.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        try {
          const telegram_id = tg.initDataUnsafe.user.id;
          const response = await userInitService.getUser(telegram_id);
          if (response.data) {
            if (response.data.coins) {
              setCoins(response.data.coins);
            }
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
  // const [accumulatedCoins, setAccumulatedCoins] = useState(0);
  const handleOpenPopup = (photo) => {
    setTimeout(function () {
      document.documentElement.classList.add("fixed");
      setSelectedPhoto(photo);
      setActiveShopPopup(true);
      // Update hourly income and coins when card is opened
      if (photo) {
        setHourlyIncome((prevIncome) => {
          const currentIncome = parseFloat(prevIncome) || 0;
          const additionalIncome = parseFloat(photo?.hourly_income) || 0;
          const newIncome = currentIncome + additionalIncome;
          return Number(newIncome.toFixed(2));
        });
        const newCoins = photo.price || 0;
        setCoins((prevCoins) => {
          const updatedCoins = prevCoins + newCoins;
          return updatedCoins;
        });
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
