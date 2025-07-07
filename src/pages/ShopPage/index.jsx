import React, { useState, useRef, useEffect } from "react";
import routeShop from "./routes";
import MainSection from "components/MainSection";
import DefaultImg from "assets/img/default-img.png";
import MoneyImg from "assets/img/money.png";
import EnergytImg from "assets/img/energy.png";
import CoinIcon from "assets/img/coin-icon.svg";
import {
  peopleService,
  shopSetService,
  shopCardService,
  userInitService,
} from "services/api";
import MobileNav from "components/MobileNav";
import CardShopPopup from "components/CardShopPopup";
import ShopPopupCarousel from "components/ShopPopupCarousel";
import ShirtShopPopup from "components/ShirtShopPopup";
import axios from "../../axios-controller";
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
const ShopPage = () => {
  const cardBackStyle = useSelector((state) => state.cardBack);
  const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "";
  const isSpecialUser =
    tgUserId === 7241281378 ||
    tgUserId === 467518658 ||
    tgUserId === 6243418179 ||
    tgUserId === 6568811367 ||
    tgUserId === 6391586511;
  console.log("tgUserId:", tgUserId);
  console.log("isSpecialUser:", isSpecialUser);
  const [activePopup, setActivePopup] = useState(false);
  const [activePopupCarousel, setActivePopupCarousel] = useState(false);
  const [activePopupFilter, setActivePopupFilter] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [shopCards, setShopCards] = useState([]);
  const [shopSets, setShopSets] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const imageQuality = useSelector((state) => state.imageQuality);
  const [responseTime, setResponseTime] = useState(null);
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
  const [shopCardsLoaded, setShopCardsLoaded] = useState(false);
  const [shopSetsLoaded, setShopSetsLoaded] = useState(false);
  const [shirtsLoaded, setShirtsLoaded] = useState(false);
  const [responseTimeLoaded, setResponseTimeLoaded] = useState(false);
  const [usernameLoaded, setUsernameLoaded] = useState(false);
  const [filteredItemsLoaded, setFilteredItemsLoaded] = useState(false);
  // Состояние для спиннера
  const [showSpinner, setShowSpinner] = useState(true);
  const [translations1, setTranslations1] = useState({});

   const [translations, setTranslations] = useState({
          sets: "Сет",
          tasks: "Задания", 
          bonus: "Бонус",
          level: "Уровень города",
          mayor: "/ Мэр",
          comingSoon: "Скоро",
          shop: 'Магазин',
  
        });
        // Get language from Redux store
        const language = useSelector((state) => state.language);
        
          useEffect(() => {
            if (language === "ru") {
              setTranslations({
                      sets: "Сет",
          tasks: "Задания", 
          bonus: "Бонус",
          level: "Уровень города",
          mayor: "/ Мэр",
                              comingSoon: "Скоро",
                                        shop: 'Магазин',

  
              });
            } else if (language === "en") {
              setTranslations({
                sets: "Set",
                tasks: "Tasks",
                bonus: "Bonus",
                level: "City Level", 
                mayor: "/ Mayor",
                              comingSoon: "Coming Soon",
                                        shop: 'Shop',

                
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
      setResponseTimeLoaded(true);
    };
    measureResponseTime();
  }, []);
  // Загрузка карт магазина
  useEffect(() => {
    const fetchShopCards = async () => {
      try {
        const response = await shopCardService.getAllShopCards();
        setShopCards(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке карт магазина:", error);
      }
      setShopCardsLoaded(true);
    };
    fetchShopCards();
  }, []);
  // Загрузка рубашек
  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await axios.get("/shirts");
        setShirts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рубашек:", error);
      }
      setShirtsLoaded(true);
    };
    fetchShirts();
  }, []);
  // Загрузка наборов магазина
  useEffect(() => {
    const fetchShopSets = async () => {
      try {
        const response = await shopSetService.getAllShopSets();
        setShopSets(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке наборов:", error);
      }
      setShopSetsLoaded(true);
    };
    fetchShopSets();
  }, []);
  // Фильтрация элементов после загрузки всех данных
  useEffect(() => {
    if (shopCardsLoaded && shopSetsLoaded && shirtsLoaded) {
      const fetchPhotos = async () => {
        try {
          // Fetch all items
          const allItems = [
            ...shopCards.map((card) => ({
              id: card.card_id,
              title: card.name,
              price: card.price,
              type: "cards",
              image: card.image_url || DefaultImg,
            })),
            ...shopSets.map((set) => ({
              id: set.id,
              title: set.name,
              price: set.price,
              type: "sets",
              image: set.image_url || DefaultImg,
            })),
            ...shirts.map((shirt) => ({
              id: shirt.id,
              title: shirt.name,
              price: shirt.price,
              type: "shirts",
              image: shirt.image_url || DefaultImg,
            })),
          ];
          setFilteredItems(allItems); // Set all items by default
          setFilteredItemsLoaded(true);
        } catch (error) {
          console.error(error);
          setFilteredItemsLoaded(true);
        }
      };
      fetchPhotos();
    }
  }, [
    shopSets,
    shirts,
    shopCards,
    shopCardsLoaded,
    shopSetsLoaded,
    shirtsLoaded,
  ]);
  // Проверка загрузки всех данных и отключение спиннера
    const translateText = async (text, targetLang) => {
    try {
      const response = await axios.post("/translate", {
        texts: [text],
        targetLanguageCode: targetLang,
      });
      if (response.data && response.data[0]) {
        return response.data[0].text;
      }
      return text;
    } catch (error) {
      console.error("Ошибка при переводе:", error);
      return text;
    }
  };
  useEffect(() => {
    const translateSetNames = async () => {
      if (shopSets.length > 0 && shopCards.length > 0 && shirts.length > 0) {
        setIsTranslating(true);
        const translatedNames = {};
        
        // Translate set names
        for (const set of shopSets) {
          translatedNames[`set_${set.id}`] = await translateText(set.name, language);
        }
        
        // Translate card names
        for (const card of shopCards) {
          translatedNames[`card_${card.id}`] = await translateText(card.name, language);
        }
        
        // Translate shirt names
        for (const shirt of shirts) {
          translatedNames[`shirt_${shirt.id}`] = await translateText(shirt.name, language);
        }
        
        setTranslations1(translatedNames);
        console.log(translatedNames)
        console.log(translations1)
        setIsTranslating(false);
      }
    };
    translateSetNames();
  }, [shopSets, shopCards, shirts, language]);
    const [isTranslating, setIsTranslating] = useState(false);
  
  useEffect(() => {
    if (
      userPhotoLoaded &&
      userCoinsLoaded &&
      userLevelLoaded &&
      shopCardsLoaded &&
      shopSetsLoaded &&
      shirtsLoaded &&
      responseTimeLoaded &&
      usernameLoaded &&
      filteredItemsLoaded&&
      !isTranslating
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
    shopCardsLoaded,
    shopSetsLoaded,
    shirtsLoaded,
    responseTimeLoaded,
    usernameLoaded,
    filteredItemsLoaded,isTranslating,
  ]);
  // Добавить функцию getImageUrl
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") return imageUrl;
    if (
      imageUrl === DefaultImg ||
      imageUrl === MoneyImg ||
      imageUrl === EnergytImg
    )
      return imageUrl;
    if (imageUrl.startsWith("http")) return imageUrl;
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
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    const allItems = [
      ...shopCards.map((card) => ({
        id: card.card_id,
        title: card.name,
        price: card.price,
        type: "cards",
        image: card.image_url || DefaultImg,
      })),
      ...shopSets.map((set) => ({
        id: set.id,
        title: set.name,
        price: set.price,
        type: "sets",
        image: set.image_url || DefaultImg,
      })),
      ...shirts.map((shirt) => ({
        id: shirt.id,
        title: shirt.name,
        price: shirt.price,
        type: "shirts",
        image: shirt.image_url || DefaultImg,
      })),
    ];
    const filtered = allItems.filter(
      (item) =>
        item.title &&
        item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredItems(filtered);
  };
  const handleOpenPopup = (item) => {
    document.documentElement.classList.add("fixed");
    setActivePopup(true);
    // Создаем копию объекта с обработанным URL изображения
    setSelectedId({
      ...item,
      image: getImageUrl(item.image),
    });
  };
  const handleClosePopup = () => {
    document.documentElement.classList.remove("fixed");
    setActivePopup(false);
  };
  const handleOpenPopupCarousel = () => {
    document.documentElement.classList.add("fixed");
    setActivePopupCarousel(true);
  };
  const handleClosePopupCarousel = () => {
    document.documentElement.classList.remove("fixed");
    setActivePopupCarousel(false);
  };
  const handleBuySet = async (setId) => {
    try {
      const response = await axios.get(`/shop-sets/${setId}`);
      const set = response.data;
      const cardsResponse = await axios.get(`/shop-sets/${setId}/cards`);
      const setCards = cardsResponse.data;
      document.documentElement.classList.add("fixed");
      setActivePopupCarousel(true);
      setSelectedId({
        id: set.id,
        title: set.name,
        description: `Набор из ${setCards.length} карт`,
        price: set.price,
        image: set.image_url
          ? `https://api.zoomayor.io${set.image_url}`
          : DefaultImg,
        cards: setCards,
      });
    } catch (error) {
      console.error("Ошибка при получении информации о наборе:", error);
    }
  };
  // Фильтрация по цене и типу
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [filterType, setFilterType] = useState("all");
  const handlePriceFromChange = (e) => {
    setPriceFrom(e.target.value);
  };
  const handlePriceToChange = (e) => {
    setPriceTo(e.target.value);
  };
  const handleFilter = () => {
    // Получаем все элементы
    const allItems = [
      ...shopCards.map((card) => ({
        id: card.card_id,
        title: card.name,
        price: card.price,
        type: "cards",
        image: card.image_url || DefaultImg,
      })),
      ...shopSets.map((set) => ({
        id: set.id,
        title: set.name,
        price: set.price,
        type: "sets",
        image: set.image_url || DefaultImg,
      })),
      ...shirts.map((shirt) => ({
        id: shirt.id,
        title: shirt.name,
        price: shirt.price,
        type: "shirts",
        image: shirt.image_url || DefaultImg,
      })),
    ];
    // Применяем фильтры только если они заданы
    const filtered = allItems.filter((item) => {
      const priceMatches =
        (!priceFrom || item.price >= Number(priceFrom)) &&
        (!priceTo || item.price <= Number(priceTo));
      const typeMatches = filterType === "all" || item.type === filterType;
      return priceMatches && typeMatches;
    });
    setFilteredItems(filtered);
    setActivePopupFilter(false);
  };
  const handleReset = () => {
    setPriceFrom("");
    setPriceTo("");
    setFilteredItems(filteredItems);
    setActivePopupFilter(false);
  };
  // Ref и обработчик кликов вне модального окна фильтра
  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        document.documentElement.classList.remove("fixed");
        setActivePopupFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleOpenFilter = () => {
    document.documentElement.classList.add("fixed");
    setActivePopupFilter(true);
  };
  return (
    <section className="shop">
      <div className="container">
        <div className="shop-inner">
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
              <div className="shop-block">
                <h2 className="section-content__title shop-block__title">
                                  {translations.shop}

                </h2>
                {isSpecialUser ? (
                  <>
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
                    <div className="shop-category">
                      <div className="shop-category__item block-style">
                        {filteredItems.filter((item) => item.type === "sets")
                          .length > 0 && (
                          <h2 className="section-content__title">
                            Наборы карт
                          </h2>
                        )}
                        <ul
                          className="shop-list f-jcsb"
                          style={
                            filteredItems.filter((item) => item.type === "sets")
                              .length > 0
                              ? { marginBottom: "24px" }
                              : { display: "none" }
                          }
                        >
                          {filteredItems
                            .filter((item) => item.type === "sets")
                            .map((set) => (
                              <li key={set.id} className="shop-list__item">
                                <div className="shop-list__card">
                                  <div
                                    className="shop-list__image"
                                    onClick={() => handleBuySet(set.id)}
                                  >
                                    <img
                                      style={{ width: "100% !important" }}
                                      src={getImageUrl(set.image)}
                                      alt={set.title}
                                      className="shop-card__Img1"
                                    />
                                  </div>
                                  <h3 className="shop-list__title">
{translations1[`set_${set.id}`] || set.name}
                                  </h3>
                                  <div className="shop-list__price f-center">
                                    <img src={CoinIcon} alt="" />
                                    {Math.floor(set.price)}
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                        {filteredItems.filter((item) => item.type === "cards")
                          .length > 0 && (
                          <h2 className="section-content__title">Карты</h2>
                        )}
                        <ul
                          className="shop-list f-jcsb"
                          style={
                            filteredItems.filter(
                              (item) => item.type === "cards"
                            ).length > 0
                              ? { marginBottom: "24px" }
                              : { display: "none" }
                          }
                        >
                          {filteredItems
                            .filter((item) => item.type === "cards")
                            .map((card) => (
                              <li key={card.id} className="shop-list__item">
                                <div className="shop-list__card">
                                  <div
                                    className="shop-list__image"
                                    onClick={() => handleOpenPopup(card)}
                                  >
                                    <img
                                      src={getImageUrl(card.image)}
                                      alt={card.title}
                                      className="shop-card__Img1"
                                    />
                                  </div>
                                  <div className="shop-list__content">
 <h3 className="shop-list__title">
                                        {translations1[`card_${card.id}`] || card.title}
                                    </h3>
                                    <div className="shop-list__price f-center">
                                      <img src={CoinIcon} alt="" />
                                      {Math.floor(card.price)}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                        {filteredItems.filter((item) => item.type === "shirts")
                          .length > 0 && (
                          <h2 className="section-content__title">
                            Рубашки карт
                          </h2>
                        )}
                        <ul
                          className="shop-list f-jcsb"
                          style={
                            filteredItems.filter(
                              (item) => item.type === "shirts"
                            ).length > 0
                              ? { marginBottom: "24px" }
                              : { display: "none" }
                          }
                        >
                          {filteredItems
                            .filter((item) => item.type === "shirts")
                            .map((shirt) => (
                              <li key={shirt.id} className="shop-list__item">
                                <div className="shop-list__card">
                                  <div
                                    className="shop-list__image"
                                    onClick={() =>
                                      handleOpenPopup({
                                        ...shirt,
                                        type: "shirt",
                                        id: shirt.id,
                                        name: shirt.title,
                                        image: getImageUrl(shirt.image), // Используем image_url вместо image
                                      })
                                    }
                                  >
                                    <img
                                      src={getImageUrl(shirt.image)}
                                      alt={shirt.title}
                                    />
                                  </div>
                                  <div className="shop-list__content">
                                    <h3 className="shop-list__title">
{translations1[`shirt_${shirt.id}`] || shirt.title}
                                    </h3>
                                    <div className="shop-list__price f-center">
                                      <img src={CoinIcon} alt="" />
                                      {Math.floor(shirt.price)}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="block-style"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      marginTop: "6px",
                    }}
                  >
                    Скоро
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div
        ref={filterRef}
        className={`modal shop-filter ${activePopupFilter && "show"}`}
      >
        <div className="modal-wrapper">
          <h3 className="modal-title">Фильтр</h3>
          <div className="modal-filter__type">
            <h3 className="modal-title">Тип</h3>
            <div
              className="modal-filter__buttons"
              style={{
                marginBottom: "15px",
                marginTop: "15px",
              }}
            >
              <button
                className={`modal-btn-choose ${
                  filterType === "all" ? "active" : ""
                }`}
                onClick={() => setFilterType("all")}
              >
                Все
              </button>
              <div>
                <button
                  className={`modal-btn-choose ${
                    filterType === "sets" ? "active" : ""
                  }`}
                  style={{
                    marginBottom: "0",
                    width: "32%",
                  }}
                  onClick={() => setFilterType("sets")}
                >
                  Наборы
                </button>
                <button
                  style={{
                    marginBottom: "0",
                    width: "32%",
                  }}
                  className={`modal-btn-choose ${
                    filterType === "cards" ? "active" : ""
                  }`}
                  onClick={() => setFilterType("cards")}
                >
                  Карты
                </button>
                <button
                  style={{
                    marginBottom: "0",
                    width: "32%",
                  }}
                  className={`modal-btn-choose ${
                    filterType === "shirts" ? "active" : ""
                  }`}
                  onClick={() => setFilterType("shirts")}
                >
                  Рубашки
                </button>
              </div>
            </div>
          </div>
          <h3 className="modal-title">Стоимость карты</h3>
          <div className="modal-range f-center-jcsb">
            <div className="modal-range__item">
              <div className="modal-form__input">
                <input
                  type="number"
                  value={priceFrom}
                  onChange={handlePriceFromChange}
                  placeholder="От"
                />
              </div>
            </div>
            <div className="modal-range__item">
              <div className="modal-form__input">
                <input
                  type="number"
                  value={priceTo}
                  onChange={handlePriceToChange}
                  placeholder="До"
                />
              </div>
            </div>
          </div>
          <div className="modal-nav">
            <button type="button" className="modal-btn" onClick={handleFilter}>
              Показать
            </button>
            <button
              type="button"
              className="modal-btn modal-btn_default"
              onClick={handleReset}
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
      {activePopup && selectedId?.type === "shirt" ? (
        <ShirtShopPopup
          active={activePopup}
          setActivePopup={setActivePopup}
          handleClosePopup={handleClosePopup}
          selectedPhoto={selectedId}
        />
      ) : (
        activePopup && (
          <CardShopPopup
            active={activePopup}
            setActivePopup={setActivePopup}
            handleClosePopup={handleClosePopup}
            selectedPhoto={selectedId}
          />
        )
      )}
      {activePopupCarousel && (
        <ShopPopupCarousel
          active={activePopupCarousel}
          setActivePopup={setActivePopupCarousel}
          handleClosePopup={handleClosePopupCarousel}
          selectedSet={selectedId}
        />
      )}
      <MobileNav />
    </section>
  );
};
export { routeShop };
export default ShopPage;
