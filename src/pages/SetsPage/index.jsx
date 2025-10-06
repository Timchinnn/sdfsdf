import React, { useState, useEffect, useRef } from "react";
import routeSets from "./routes";
import MainSection from "components/MainSection";
import Spinner from "components/Spinner";
import { userInitService, userCardsService } from "services/api";
import MobileNav from "components/MobileNav";
import { useSelector } from "react-redux";
import axios from "../../axios-controller";
import QuestionMarkImg from "assets/img/question-mark.png";

// Импортируем необходимые локальные изображенияd
import Avatar from "assets/img/avatar.png";
import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
// Определяем URL-ы для остальных изображений
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const SetsPage = () => {
  // Состояния для данных пользователя
  const [searchTerm, setSearchTerm] = useState("");
  const filterRef = useRef(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  const [telegramId, setTelegramId] = useState(null);
  const [lot, setLot] = useState(null);
  const [userCards, setUserCards] = useState(null);
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
  const [sortDirection, setSortDirection] = useState(null);
  const [activePopupFilter, setActivePopupFilter] = useState(false);
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
    const tg = window.Telegram.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      setTelegramId(tg.initDataUnsafe.user.id);
    }
  }, []);
  useEffect(() => {
    const fetchLotData = async () => {
      try {
        const tg = window.Telegram.WebApp;

        const response = await userCardsService.getUserCards(
          tg.initDataUnsafe.user.id
        );
        // Filter out money and energy cards
        const filteredCards = response.data.filter(
          (card) =>
            !card.title.match(/^Монеты \d+/) && card.type !== "energy_boost"
        );
        setUserCards(filteredCards);
        console.log(filteredCards);

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
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных лота:", error);
      }
      setLotLoaded(true);
    };
    fetchLotData();
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
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    const filtered = userCards.filter((card) => {
      const titleMatch = card.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const chanceMatch = card.chance && !isNaN(parseFloat(card.chance));
      return titleMatch && chanceMatch;
    });
    setFilteredItems(filtered);
  };
  const handleSort = (direction) => {
    setSortDirection(direction);
    if (!userCards) return;
    // Сначала применяем фильтрацию по поисковому запросу
    const filtered = userCards.filter((card) => {
      const titleMatch = card.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const chanceMatch = card.chance && !isNaN(parseFloat(card.chance));
      return titleMatch && chanceMatch;
    });
    // Затем сортируем отфильтрованные карты
    const sorted = [...filtered].sort((a, b) => {
      const chanceA = parseFloat(a.chance) || 0;
      const chanceB = parseFloat(b.chance) || 0;
      return direction === "asc" ? chanceA - chanceB : chanceB - chanceA;
    });
    setFilteredItems(sorted);
  };
  const handleOpenFilter = () => {
    document.documentElement.classList.add("fixed");
    setActivePopupFilter(true);
  };
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
                <div>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <img
                      src={QuestionMarkImg}
                      alt=""
                      style={{ height: "135px" }}
                    />
                    <img
                      src={QuestionMarkImg}
                      alt=""
                      style={{ height: "135px" }}
                    />
                    <img
                      src={QuestionMarkImg}
                      alt=""
                      style={{ height: "135px" }}
                    />
                  </div>
                  <div className="shop-block__nav f-center-jcsb">
                    <div className="shop-block__search">
                      <div className="shop-block__search-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.90918 7.44629C0.90918 3.79395 3.88086 0.822266 7.5332 0.822266C11.1855 0.822266 14.1572 3.79395 14.1572 7.44629C14.1572 8.95703 13.6509 10.3433 12.7959 11.4556L16.855 15.5396C17.0293 15.7139 17.1289 15.9546 17.1289 16.2202C17.1289 16.7764 16.7388 17.1997 16.1743 17.1997C15.9087 17.1997 15.6597 17.1084 15.4688 16.9175L11.3848 12.8252C10.2974 13.6055 8.97754 14.0703 7.5332 14.0703C3.88086 14.0703 0.90918 11.0986 0.90918 7.44629ZM2.32861 7.44629C2.32861 10.3184 4.66113 12.6509 7.5332 12.6509C10.4053 12.6509 12.7378 10.3184 12.7378 7.44629C12.7378 4.57422 10.4053 2.2417 7.5332 2.2417C4.66113 2.2417 2.32861 4.57422 2.32861 7.44629Z"
                            fill="#AAB2BD"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        style={{ color: "white" }}
                        name="search"
                        value={searchTerm}
                        onChange={handleSearch}
                        required
                      />
                    </div>
                    <div
                      className="shop-block__nav-btn"
                      onClick={handleOpenFilter}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.74975 17.5C8.53708 17.5 8.359 17.4281 8.2155 17.2843C8.07183 17.1406 8 16.9625 8 16.75V12.75C8 12.5375 8.07192 12.3594 8.21575 12.2158C8.35958 12.0719 8.53775 12 8.75025 12C8.96292 12 9.141 12.0719 9.2845 12.2158C9.42817 12.3594 9.5 12.5375 9.5 12.75V14H16.75C16.9625 14 17.1406 14.0719 17.2843 14.2158C17.4281 14.3596 17.5 14.5378 17.5 14.7503C17.5 14.9629 17.4281 15.141 17.2843 15.2845C17.1406 15.4282 16.9625 15.5 16.75 15.5H9.5V16.75C9.5 16.9625 9.42808 17.1406 9.28425 17.2843C9.14042 17.4281 8.96225 17.5 8.74975 17.5ZM0.75 15.5C0.5375 15.5 0.359417 15.4281 0.21575 15.2843C0.0719168 15.1404 0 14.9622 0 14.7498C0 14.5371 0.0719168 14.359 0.21575 14.2155C0.359417 14.0718 0.5375 14 0.75 14H4.75C4.9625 14 5.14058 14.0719 5.28425 14.2158C5.42808 14.3596 5.5 14.5378 5.5 14.7503C5.5 14.9629 5.42808 15.141 5.28425 15.2845C5.14058 15.4282 4.9625 15.5 4.75 15.5H0.75ZM4.74975 11.5C4.53708 11.5 4.359 11.4281 4.2155 11.2843C4.07183 11.1406 4 10.9625 4 10.75V9.5H0.75C0.5375 9.5 0.359417 9.42808 0.21575 9.28425C0.0719168 9.14042 0 8.96225 0 8.74975C0 8.53708 0.0719168 8.359 0.21575 8.2155C0.359417 8.07183 0.5375 8 0.75 8H4V6.75C4 6.5375 4.07192 6.35942 4.21575 6.21575C4.35958 6.07192 4.53775 6 4.75025 6C4.96292 6 5.141 6.07192 5.2845 6.21575C5.42817 6.35942 5.5 6.5375 5.5 6.75V10.75C5.5 10.9625 5.42808 11.1406 5.28425 11.2843C5.14042 11.4281 4.96225 11.5 4.74975 11.5ZM8.75 9.5C8.5375 9.5 8.35942 9.42808 8.21575 9.28425C8.07192 9.14042 8 8.96225 8 8.74975C8 8.53708 8.07192 8.359 8.21575 8.2155C8.35942 8.07183 8.5375 8 8.75 8H16.75C16.9625 8 17.1406 8.07192 17.2843 8.21575C17.4281 8.35958 17.5 8.53775 17.5 8.75025C17.5 8.96292 17.4281 9.141 17.2843 9.2845C17.1406 9.42817 16.9625 9.5 16.75 9.5H8.75ZM12.7498 5.5C12.5371 5.5 12.359 5.42808 12.2155 5.28425C12.0718 5.14058 12 4.9625 12 4.75V0.75C12 0.5375 12.0719 0.359417 12.2158 0.21575C12.3596 0.0719168 12.5378 0 12.7503 0C12.9629 0 13.141 0.0719168 13.2845 0.21575C13.4282 0.359417 13.5 0.5375 13.5 0.75V2H16.75C16.9625 2 17.1406 2.07192 17.2843 2.21575C17.4281 2.35958 17.5 2.53775 17.5 2.75025C17.5 2.96292 17.4281 3.141 17.2843 3.2845C17.1406 3.42817 16.9625 3.5 16.75 3.5H13.5V4.75C13.5 4.9625 13.4281 5.14058 13.2843 5.28425C13.1404 5.42808 12.9622 5.5 12.7498 5.5ZM0.75 3.5C0.5375 3.5 0.359417 3.42808 0.21575 3.28425C0.0719168 3.14042 0 2.96225 0 2.74975C0 2.53708 0.0719168 2.359 0.21575 2.2155C0.359417 2.07183 0.5375 2 0.75 2H8.75C8.9625 2 9.14058 2.07192 9.28425 2.21575C9.42808 2.35958 9.5 2.53775 9.5 2.75025C9.5 2.96292 9.42808 3.141 9.28425 3.2845C9.14058 3.42817 8.9625 3.5 8.75 3.5H0.75Z"
                          fill="#AAB2BD"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "16px",
                        padding: "16px",
                      }}
                    >
                      {userCards
                        .filter((card) => {
                          // Пропускаем карты с бонусами и энергией
                          if (
                            card.title.match(/^Бонус \d+/) ||
                            card.type === "energy_boost"
                          ) {
                            return false;
                          }
                          // Фильтруем по поисковому запросу
                          return card.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());
                        })
                        .reduce((uniqueCards, card) => {
                          // Находим существующую карту в аккумуляторе
                          const existingCard = uniqueCards.find(
                            (c) => c.id === card.id
                          );
                          if (existingCard) {
                            // Увеличиваем счетчик для существующей карты
                            existingCard.count = (existingCard.count || 1) + 1;
                            return uniqueCards;
                          } else {
                            // Добавляем новую карту со счетчиком 1
                            return [...uniqueCards, { ...card, count: 1 }];
                          }
                        }, [])
                        .map((card) => (
                          <div
                            key={card.id}
                            style={{ position: "relative", width: "100%" }}
                          >
                            <img
                              src={`https://api.zoomayor.io${card.image}`}
                              alt={card.title}
                              style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "8px",
                              }}
                            />
                            {card.count > 1 && (
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
                                {card.count}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
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
      <div
        ref={filterRef}
        className={`modal shop-filter ${activePopupFilter && "show"}`}
      >
        <div className="modal-wrapper">
          <h3 className="modal-title">Фильтр</h3>
          <div className="modal-filter__type">
            <h3 className="modal-title">Редкость</h3>
            <div className="modal-filter__buttons">
              <button
                className={`modal-btn-choose ${
                  sortDirection === "asc" ? "active" : ""
                }`}
                onClick={() => {
                  setSortDirection("asc");
                  handleSort("asc");
                }}
              >
                По возрастанию
              </button>
              <button
                className={`modal-btn-choose ${
                  sortDirection === "desc" ? "active" : ""
                }`}
                onClick={() => {
                  setSortDirection("desc");
                  handleSort("desc");
                }}
              >
                По убыванию
              </button>
            </div>
          </div>
          <div className="modal-nav">
            <button
              type="button"
              className="modal-btn"
              onClick={() => setActivePopupFilter(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export { routeSets };
export default SetsPage;
