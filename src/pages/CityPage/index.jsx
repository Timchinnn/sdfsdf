import React, { useState, useEffect } from "react";
import routeCity from "./routes";
import MainSection from "components/MainSection";
import {
  userCardsService,
  cardSetsService,
  userInitService,
} from "services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import InfoIcon from "assets/img/icons8-info-48.png";
import QuestionMarkImg from "assets/img/question-mark.png";
import MobileNav from "components/MobileNav";
import ShopPopup from "components/ShopPopup";
import { useSelector } from "react-redux";
import Spinner from "components/Spinner";
// Импортируем необходимые локальные изображения
import Avatar from "assets/img/avatar.png";
import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
// Определяем URL-ы для остальных изображений, которые используются в MainSection
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const CityPage = () => {
  const [showInfo, setShowInfo] = useState({});
  const [cardSets, setCardSets] = useState([]);
  const [cardSetData, setCardSetData] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activePopup, setActivePopup] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const imageQuality = useSelector((state) => state.imageQuality);

  // Добавляем состояния для спиннера и загрузки данных
  const [showSpinner, setShowSpinner] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  // Состояния для данных пользователя
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState("");
  const [currentExp, setCurrentExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);
  // Инициализация загрузки данных
  useEffect(() => {
    setUserDataLoaded(true);
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
    return () => clearTimeout(timer);
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
    };

    if (userDataLoaded) {
      initializeUserPhoto();
    }
  }, [userDataLoaded]);
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
    };
    fetchUserCoins();
  }, []);
  // Получение уровня и опыта пользователя
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
            console.error("Ошибка при получении уровня пользователя:", error);
          }
        }
      };
      fetchUserLevel();
    }
  }, [userDataLoaded]);
  // Измеряем время ответа сервера при загрузке компонента
  useEffect(() => {
    const measureResponseTime = async () => {
      const startTime = performance.now();
      try {
        const response = await fetch("https://api.zoomayor.io/api/cards");
        const endTime = performance.now();
        const time = endTime - startTime;
        setResponseTime(time);
      } catch (error) {
        console.error("Ошибка при измерении времени ответа:", error);
      }
    };
    measureResponseTime();
  }, []);
  // Функция для определения URL изображения
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === QuestionMarkImg) return imageUrl;
    // Проверяем настройки качества изображений
    if (imageQuality === "high") {
      // Всегда высокое качество
      return `https://api.zoomayor.io${imageUrl}`;
    } else if (imageQuality === "low") {
      // Всегда низкое качество
      const hasExtension = /\.[^.]+$/.test(imageUrl);
      return `https://api.zoomayor.io${
        hasExtension
          ? imageUrl.replace(/(\.[^.]+)$/, "bad$1")
          : imageUrl + "bad.webp"
      }`;
    } else {
      // Автоматический режим - зависит от времени ответа
      if (responseTime > 300) {
        const hasExtension = /\.[^.]+$/.test(imageUrl);
        return `https://api.zoomayor.io${
          hasExtension
            ? imageUrl.replace(/(\.[^.]+)$/, "bad$1")
            : imageUrl + "bad.webp"
        }`;
      } else {
        return `https://api.zoomayor.io${imageUrl}`;
      }
    }
  };
  // Получение наборов карточек
  useEffect(() => {
    const fetchCardSets = async () => {
      try {
        const response = await cardSetsService.getAllCardSets();
        // Фильтруем наборы, оставляя лишь те, в которых set_type === "city"
        const citySets = response.data.filter((set) => set.set_type === "city");
        setCardSets(citySets);
        // Далее для каждого набора получаем карточки и награды
        const setData = {};
        const tg = window.Telegram.WebApp;
        const telegram_id = tg.initDataUnsafe?.user?.id;
        for (const set of citySets) {
          const cardsResponse = await cardSetsService.getSetCards(set.id);
          const rewardsResponse = await cardSetsService.getSetRewards(set.id);
          set.rewards = rewardsResponse.data.rewards;
          setData[set.id] = cardsResponse.data;
          if (telegram_id) {
            try {
              await cardSetsService.checkSetCompletion(set.id, telegram_id);
            } catch (error) {
              console.error("Ошибка при проверке завершения набора:", error);
            }
          }
        }
        setCardSetData(setData);
      } catch (error) {
        console.error("Ошибка при получении наборов карточек:", error);
      }
    };
    fetchCardSets();
  }, []);
  // Получение карточек пользователя
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const tg = window.Telegram.WebApp;
        const telegram_id = tg.initDataUnsafe?.user?.id;
        if (!telegram_id) {
          console.error("Telegram ID не найден");
          return;
        }
        const response = await userCardsService.getUserCards(telegram_id);
        setUserCards(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserCards();
  }, []);
  const handleAccordionClick = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };
  const handleOpenPopup = (photo) => {
    document.documentElement.classList.add("fixed");
    setSelectedPhoto({
      ...photo,
      image:
        userCards && userCards.some((card) => card.id === photo.id)
          ? getImageUrl(photo.image) // Use getImageUrl helper for quality selection
          : QuestionMarkImg,
    });
    setActivePopup(true);
  };
  const handleClosePopup = () => {
    document.documentElement.classList.remove("fixed");
    setActivePopup(false);
    setShowInfo({});
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      const popup = document.querySelector(".info-popup");
      const infoIcon = document.querySelector(".info-icon");
      if (
        popup &&
        !popup.contains(event.target) &&
        !infoIcon.contains(event.target)
      ) {
        setShowInfo({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <section className="city">
      <div className="container">
        <div className="city-inner">
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
                userAvatar={userAvatar}
                defaultAvatar={Avatar}
                timeIcon={TimeIcon}
                moneyIcon={MoneyIcon}
                cardImg={cardImg}
                taskImg={taskImg}
                bonusImg={bonusImg}
              />
              <ul className="city-list">
                {cardSets.map((set) => (
                  <li key={set.id} className="city-list__item block-style">
                    <div
                      className={`city-list__title f-center-jcsb ${
                        openAccordion === set.id ? "active" : ""
                      }`}
                    >
                      <p style={{ width: "80px" }}>{set.name}</p>
                      <div
                        className="info-icon"
                        style={{ display: "flex" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInfo((prev) => ({
                            ...prev,
                            [set.id]: !prev[set.id],
                          }));
                        }}
                      >
                        <img src={InfoIcon} alt="" className="infoIcon" />
                      </div>
                      {showInfo[set.id] && (
                        <div className="info-popup">
                          <div className="info-popup__content">
                            <p style={{ marginRight: "19px" }}>
                              Информация о {set.name}
                            </p>
                            {set.rewards &&
                              set.rewards
                                .filter(
                                  (reward) =>
                                    reward.value !== 0 && reward.value !== ""
                                )
                                .map((reward, index) => (
                                  <div
                                    key={index}
                                    style={{ marginBottom: "10px" }}
                                  >
                                    <p>
                                      Тип награды:{" "}
                                      {reward.type === "experience"
                                        ? "Опыт"
                                        : reward.type === "hourly_income"
                                        ? "Доход в час"
                                        : reward.type === "coins"
                                        ? "Монеты"
                                        : reward.type === "card"
                                        ? "Карта"
                                        : reward.type}
                                    </p>
                                    <p>Значение: {reward.value}</p>
                                  </div>
                                ))}
                            <button
                              className="info-popup__close"
                              onClick={() => setShowInfo(false)}
                            >
                              <p>✕</p>
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="city-list__more f-center">
                        <div className="city-list__count">
                          {cardSetData[set.id]
                            ? `${
                                new Set(
                                  userCards
                                    .filter((card) =>
                                      cardSetData[set.id].some(
                                        (setCard) => setCard.id === card.id
                                      )
                                    )
                                    .map((card) => card.id)
                                ).size
                              } из ${cardSetData[set.id].length}`
                            : "0 из 0"}
                        </div>
                        <div
                          className="city-list__arrow"
                          onClick={() => handleAccordionClick(set.id)}
                        >
                          <svg
                            width="15"
                            height="9"
                            viewBox="0 0 15 9"
                            fill="none"
                          >
                            <path
                              d="M14.6592 1.56103L8.23438 8.13525C8.08496 8.29297 7.88574 8.38428 7.66992 8.38428C7.4624 8.38428 7.25488 8.29297 7.11377 8.13525L0.688966 1.56103C0.547853 1.42822 0.464845 1.2373 0.464845 1.02148C0.464845 0.589842 0.788575 0.266112 1.22022 0.266112C1.42774 0.266112 1.62695 0.340819 1.75977 0.481932L7.66992 6.5249L13.5884 0.481933C13.7129 0.34082 13.9121 0.266113 14.1279 0.266113C14.5596 0.266113 14.8833 0.589844 14.8833 1.02148C14.8833 1.2373 14.8003 1.42822 14.6592 1.56103Z"
                              fill="#AAB2BD"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div
                      className="city-list__content"
                      style={{
                        maxHeight: openAccordion === set.id ? "500px" : "0px",
                        paddingTop: openAccordion === set.id ? "24px" : "0px",
                        paddingBottom:
                          openAccordion === set.id ? "10px" : "0px",
                      }}
                    >
                      <div className="city-slider">
                        <Swiper spaceBetween={8} slidesPerView={"auto"}>
                          {cardSetData[set.id]?.map((card) => (
                            <SwiperSlide key={card.id}>
                              <div className="city-slider__item">
                                <div
                                  className="city-slider__card"
                                  onClick={() => handleOpenPopup(card)}
                                >
                                  <p className="city-slider__image">
                                    <img
                                      src={
                                        userCards.some(
                                          (userCard) => userCard.id === card.id
                                        )
                                          ? getImageUrl(card.image)
                                          : QuestionMarkImg
                                      }
                                      alt={card.title}
                                    />
                                    {userCards.filter(
                                      (userCard) => userCard.id === card.id
                                    ).length > 1 && (
                                      <span
                                        className="card-count"
                                        style={{
                                          position: "absolute",
                                          top: "2px",
                                          right: "2px",
                                          background: "rgba(0, 0, 0, 0.7)",
                                          color: "white",
                                          padding: "4px 8px",
                                          borderRadius: "12px",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {
                                          userCards.filter(
                                            (userCard) =>
                                              userCard.id === card.id
                                          ).length
                                        }
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <ShopPopup
        active={activePopup}
        setActivePopup={setActivePopup}
        main={true}
        handleClosePopup={handleClosePopup}
        selectedPhoto={selectedPhoto}
      />
      <MobileNav />
    </section>
  );
};
export { routeCity };
export default CityPage;
