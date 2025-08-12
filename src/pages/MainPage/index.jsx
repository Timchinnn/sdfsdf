import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../axios-controller";

import { userInitService, cardBackService } from "services/api";
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
  const [userChanceRange, setUserChanceRange] = useState({ min_chance: null, max_chance: null });

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
        
        // Добавляем слушатель события
        const handleCardBackChange = () => {
            loadCardBack();
        };
        window.addEventListener('cardBackChanged', handleCardBackChange);
        
        loadCardBack();
        
        return () => {
            window.removeEventListener('cardBackChanged', handleCardBackChange);
        };
    }, []);
  // Update translations when language changes
  // Проверка и получение наград за рефералов
useEffect(() => {
  const checkReferralRewards = async () => {
    try {
      const tg = window.Telegram.WebApp;
      if (tg?.initDataUnsafe?.user?.id) {
        const telegram_id = tg.initDataUnsafe.user.id;
        
        // Получаем количество рефералов пользователя
        const referralsResponse = await userInitService.getReferrals(telegram_id);
        const referralsCount = referralsResponse.data.referrals.length;
        // Получаем все уровни реферальной системы
        const levelsResponse = await axios.get('/referral-levels');
        const levels = levelsResponse.data;
        // Проверяем каждый уровень
        for (const level of levels) {
          if (referralsCount >= level.friends_required) {
            // Проверяем, получал ли пользователь награду за этот уровень
            const claimedResponse = await axios.get(
              `/user/${telegram_id}/referral-level/${level.id}/claimed`
            );
            
            if (!claimedResponse.data.claimed) {
              // Получаем награды за уровень
              const rewardsResponse = await axios.get(`/referral-levels/${level.id}/rewards`);
              const rewards = rewardsResponse.data;
              // Начисляем награды пользователю
              if (rewards.coin_reward > 0) {
                await axios.post(`/user/${telegram_id}/add-coins`, {
                  amount: rewards.coin_reward
                });
              }
              
              if (rewards.card_reward) {
                await axios.post(`/user/${telegram_id}/add-card`, {
                  card_id: rewards.card_reward
                });
              }
              // Отмечаем уровень как полученный
              await axios.post(`/user/${telegram_id}/referral-level/${level.id}/claim`);
              // Показываем уведомление пользователю
              tg.showPopup({
                title: "Награда получена!",
                message: `Вы получили награду за достижение ${level.friends_required} рефералов!`,
                buttons: [{ type: "ok" }]
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при проверке наград за рефералов:", error);
    }
  };
  checkReferralRewards();
}, []);
  useEffect(() => {
    const loadUserChanceRange = async () => {
      const tg = window.Telegram.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const telegram_id = tg.initDataUnsafe.user.id;
        try {
          const response = await userInitService.getUser(telegram_id);
          // Предполагаем, что в response.data есть min_chance и max_chance
          const { min_chance, max_chance } = response.data;
          setUserChanceRange({ min_chance, max_chance });
        } catch (error) {
          console.error("Ошибка при получении диапазона шансов:", error);
        }
      }
    };
    loadUserChanceRange();
  }, []);
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
        slowConnectionMessage: "Обнаружено медленное соединение. Качество изображений будет снижено для улучшения производительности."
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
        slowConnectionMessage: "A slow connection has been detected. The image quality will be reduced to improve performance."
      });
    } else if (language === "it") {
      setTranslations({
        sets: "Set",
        tasks: "Compiti",
        bonus: "Bonus",
        level: "Livello città",
        mayor: "/ Sindaco",
        collect: "Raccogli",
        slowConnectionTitle: "Attenzione",
        slowConnectionMessage: "È stata rilevata una connessione lenta. La qualità dell'immagine verrà ridotta per migliorare le prestazioni."
      });
    } else if (language === "es") {
      setTranslations({
        sets: "Conjunto",
        tasks: "Tareas",
        bonus: "Bono",
        level: "Nivel de ciudad",
        mayor: "/ Alcalde",
        collect: "Recoger",
        slowConnectionTitle: "Atención",
        slowConnectionMessage: "Se ha detectado una conexión lenta. La calidad de la imagen se reducirá para mejorar el rendimiento."
      });
    } else if (language === "de") {
      setTranslations({
        sets: "Set",
        tasks: "Aufgaben",
        bonus: "Bonus",
        level: "Stadtlevel",
        mayor: "/ Bürgermeister",
        collect: "Sammeln",
        slowConnectionTitle: "Achtung",
        slowConnectionMessage: "Eine langsame Verbindung wurde erkannt. Die Bildqualität wird reduziert, um die Leistung zu verbessern."
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
                  userChanceRange={userChanceRange}

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
