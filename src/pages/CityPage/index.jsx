import React, { useState, useEffect } from "react";
import routeCity from "./routes";
import MainSection from "components/MainSection";
import { userCardsService, cardSetsService } from "services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import InfoIcon from "assets/img/icons8-info-48.png";
import QuestionMarkImg from "assets/img/question-mark.png";
import MobileNav from "components/MobileNav";
import ShopPopup from "components/ShopPopup";
const CityPage = () => {
  const [showInfo, setShowInfo] = useState({});
  const [cardSets, setCardSets] = useState([]);
  const [cardSetData, setCardSetData] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activePopup, setActivePopup] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
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
              console.error("Error checking set completion:", error);
            }
          }
        }
        setCardSetData(setData);
      } catch (error) {
        console.error("Error fetching card sets:", error);
      }
    };
    fetchCardSets();
  }, []);
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const tg = window.Telegram.WebApp;
        const telegram_id = tg.initDataUnsafe?.user?.id;
        if (!telegram_id) {
          console.error("Telegram ID not found");
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
          ? photo.image
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
          <MainSection />
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
                              <div key={index} style={{ marginBottom: "10px" }}>
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
                      <svg width="15" height="9" viewBox="0 0 15 9" fill="none">
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
                    paddingBottom: openAccordion === set.id ? "10px" : "0px",
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
                                      ? `https://api.zoomayor.io${card.image}`
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
                                        (userCard) => userCard.id === card.id
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
