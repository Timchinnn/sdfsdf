import React, { useEffect, useState } from "react";
import routeTasks from "./routes";
import MainSection from "components/MainSection";
import DefaultImg from "assets/img/free-icon-play-button-526510.png";
import DefaultImgTG from "assets/img/unnamed.png";
// import axios from "../../axios-controller";
import { adsService, userInitService } from "../../services/api";
import { processReward } from "../../services/api";
import CoinIcon from "assets/img/coin-icon.svg";
import StarIcon from "assets/img/star-icon.svg";
import MobileNav from "components/MobileNav";
import Spinner from "components/Spinner";
// Импортируем необходимые локальные изображения
import Avatar from "assets/img/avatar.png";
import { useSelector } from "react-redux";
import axios from "../../axios-controller";

import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
// Определяем URL-ы для остальных изображений, которые используются в MainSection
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const TasksPage = () => {
  const [AdController, setAdController] = useState(null);
  const [ads, setAds] = useState([]); // Добавляем состояние для рекламы

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
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [adControllerLoaded, setAdControllerLoaded] = useState(false);
  const [usernameLoaded, setUsernameLoaded] = useState(false);

  // Состояние для спиннера
  const [showSpinner, setShowSpinner] = useState(true);
    const [referralTasks, setReferralTasks] = useState([]);
  const [userReferrals, setUserReferrals] = useState(0);
   const [translations, setTranslations] = useState({
     sets: "Сет",
      tasks: "Задания", 
      bonus: "Бонус",
      level: "Уровень города",
      mayor: "/ Мэр",
    rewardReceived: "Награда получена!",
    rewardForAd: "Вы получили награду за просмотр рекламы!",
    excellent: "Отлично!",
    error: "Ошибка",
    rewardError: "Не удалось получить награду. Попробуйте позже.",
    taskRewards: "Награды за задания",
    subscribeToTelegram: "Подписаться на телеграм канал https://t.me/zoomayor",
    start: "Начать",
    watch: "Смотреть"
  });
  // Get language from Redux store
  useEffect(() => {
    const fetchReferralTasks = async () => {
      try {
        const response = await axios.get('/referral-levels');
        setReferralTasks(response.data);
      } catch (error) {
        console.error('Error fetching referral tasks:', error);
      }
    };
    const fetchUserReferrals = async () => {
      const tg = window.Telegram.WebApp;
      if (tg?.initDataUnsafe?.user?.id) {
        try {
          const response = await axios.get(`/user/${tg.initDataUnsafe.user.id}/referrals`);
          setUserReferrals(response.data.referrals?.length || 0);
        } catch (error) {
          console.error('Error fetching user referrals:', error);
        }
      }
    };
    fetchReferralTasks();
    fetchUserReferrals();
  }, []);
  const handleReferralReward = async (task) => {
    const tg = window.Telegram.WebApp;
    if (!tg?.initDataUnsafe?.user?.id) return;
    try {
      if (userReferrals >= task.friends_required) {
        const response = await processReward(tg.initDataUnsafe.user.id, null, {
          type: 'referral',
          task_id: task.id
        });
        if (response.success) {
          tg.showPopup({
            title: translations.rewardReceived,
            message: translations.rewardForAd,
            buttons: [{ type: "ok", text: translations.excellent }]
          });
        }
      }
    } catch (error) {
      console.error('Error processing referral reward:', error);
      tg.showPopup({
        title: translations.error,
        message: translations.rewardError,
        buttons: [{ type: "ok" }]
      });
    }
  };
  const language = useSelector((state) => state.language);
useEffect(() => {
    if (language === "ru") {
      setTranslations({
         sets: "Сет",
         tasks: "Задания", 
         bonus: "Бонус",
         level: "Уровень города",
         mayor: "/ Мэр",
        rewardReceived: "Награда получена!",
        rewardForAd: "Вы получили награду за просмотр рекламы!",
        excellent: "Отлично!",
        error: "Ошибка",
        rewardError: "Не удалось получить награду. Попробуйте позже.",
        taskRewards: "Награды за задания",
        subscribeToTelegram: "Подписаться на телеграм канал https://t.me/zoomayor",
        start: "Начать",
        watch: "Смотреть"
      });
    } else if (language === "en") {
      setTranslations({
         sets: "Set",
         tasks: "Tasks",
         bonus: "Bonus",
         level: "City Level", 
         mayor: "/ Mayor",
        rewardReceived: "Reward received!",
        rewardForAd: "You received a reward for watching the ad!",
        excellent: "Excellent!",
        error: "Error",
        rewardError: "Failed to receive reward. Please try again later.",
        taskRewards: "Task Rewards",
        subscribeToTelegram: "Subscribe to Telegram channel https://t.me/zoomayor",
        start: "Start",
        watch: "Watch"
      });
    } else if (language === "it") {
      setTranslations({
        sets: "Set",
        tasks: "Compiti",
        bonus: "Bonus",
        level: "Livello città",
        mayor: "/ Sindaco",
        rewardReceived: "Premio ricevuto!",
        rewardForAd: "Hai ricevuto un premio per aver guardato l'annuncio!",
        excellent: "Eccellente!",
        error: "Errore",
        rewardError: "Impossibile ricevere il premio. Riprova più tardi.",
        taskRewards: "Premi per le attività",
        subscribeToTelegram: "Iscriviti al canale Telegram https://t.me/zoomayor",
        start: "Inizia",
        watch: "Guarda"
      });
    } else if (language === "es") {
      setTranslations({
        sets: "Conjunto",
        tasks: "Tareas",
        bonus: "Bono",
        level: "Nivel de ciudad",
        mayor: "/ Alcalde",
        rewardReceived: "¡Recompensa recibida!",
        rewardForAd: "¡Has recibido una recompensa por ver el anuncio!",
        excellent: "¡Excelente!",
        error: "Error",
        rewardError: "No se pudo recibir la recompensa. Por favor, inténtalo más tarde.",
        taskRewards: "Recompensas de tareas",
        subscribeToTelegram: "Suscríbete al canal de Telegram https://t.me/zoomayor",
        start: "Comenzar",
        watch: "Ver"
      });
    } else if (language === "de") {
      setTranslations({
        sets: "Set",
        tasks: "Aufgaben",
        bonus: "Bonus",
        level: "Stadtlevel",
        mayor: "/ Bürgermeister",
        rewardReceived: "Belohnung erhalten!",
        rewardForAd: "Sie haben eine Belohnung für das Ansehen der Werbung erhalten!",
        excellent: "Ausgezeichnet!",
        error: "Fehler",
        rewardError: "Belohnung konnte nicht empfangen werden. Bitte versuchen Sie es später erneut.",
        taskRewards: "Aufgabenbelohnungen",
        subscribeToTelegram: "Abonniere den Telegram-Kanal https://t.me/zoomayor",
        start: "Starten",
        watch: "Ansehen"
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
  // Загрузка рекламы
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await adsService.getAllAds();
        setAds(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рекламы:", error);
      }
      setAdsLoaded(true);
    };
    fetchAds();
  }, []);
  // Инициализация SDK рекламы
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sad.adsgram.ai/js/sad.min.js";
    script.async = true;
    script.onload = () => {
      const controller = window.Adsgram.init({
        blockId: "9521",
      });
      setAdController(controller);
      setAdControllerLoaded(true);
    };
    script.onerror = () => {
      console.error("Ошибка при загрузке скрипта рекламы");
      setAdControllerLoaded(true); // Отмечаем как загруженный даже при ошибке, чтобы не блокировать UI
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  const [translations1, setTranslations1] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  
  useEffect(() => {
    const translateAdContent = async () => {
      if (ads.length > 0) {
        setIsTranslating(true);
        const translatedContent = {};
        for (const ad of ads) {
          translatedContent[ad.id] = await translateText(ad.title, language);
          translatedContent[`${ad.id}_desc`] = await translateText(ad.description, language);
        }
        setTranslations1(translatedContent);
        setIsTranslating(false);
      }
    };
    translateAdContent();
  }, [ads, language]);
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
  // Проверка загрузки всех данных и отключение спиннера
  useEffect(() => {
    if (
      userPhotoLoaded &&
      userCoinsLoaded &&
      userLevelLoaded &&
      adsLoaded &&
      adControllerLoaded &&
      usernameLoaded &&
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
    adsLoaded,
    adControllerLoaded,
    usernameLoaded,
    isTranslating,
  ]);
  const showRewardedAd = async (adId) => {
    try {
      const result = await AdController.show();
      if (result.done) {
        const tg = window.Telegram.WebApp;
        const telegram_id = tg.initDataUnsafe?.user?.id;
        if (!telegram_id) {
          throw new Error("Telegram ID не найден");
        }
        // Получаем данные о рекламе
        const clickedAd = ads.find((ad) => ad.id === adId);
        if (!clickedAd) {
          throw new Error("Реклама не найдена");
        }
        console.log("Отправляем запрос на начисление наград:", {
          telegram_id,
          adId,
          clickedAd,
        });
        // Используем новый метод
        const response = await adsService.processAdReward(telegram_id, adId);
        if (response.data.success) {
          // Показываем уведомление об успехе
          tg.showPopup({
            title: translations.rewardReceived,
            message: translations.rewardForAd,
            buttons: [
              {
                type: "ok",
                text: translations.excellent,
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error("Подробная ошибка:", error);
      // Показываем ошибку пользователю
      window.Telegram.WebApp.showPopup({
        title: translations.error,
        message: translations.rewardError,
        buttons: [
          {
            type: "ok",
            text: "Понятно",
          },
        ],
      });
    }
  };
  return (
    <section className="tasks">
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
              <div className="tasks-block">
                <div className="tasks-head">
                  <div className="section-content">
                    <h2 className="section-content__title">
                        {translations.taskRewards}
                    </h2>
                  </div>
                </div>
                <ul className="tasks-list">
                  <li className="tasks-list__item">
                    <div className="tasks-list__card block-style">
                      <div className="tasks-list__wrap f-center">
                        <div className="tasks-list__image">
                          <img
                            src={DefaultImgTG}
                            alt=""
                            style={{ height: "73%" }}
                          />
                        </div>
                        <div className="tasks-list__content">
                          <h3 className="tasks-list__title">
                              {translations.subscribeToTelegram}
                          </h3>
                          <ul className="friends-params f-center">
                            <li className="friends-params__item f-center">
                              <img src={StarIcon} alt="" />
                              500 EXP
                            </li>
                            <li className="friends-params__item f-center">
                              <img src={CoinIcon} alt="" />
                              2000
                            </li>
                          </ul>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="tasks-list__btn"
                        style={{ marginTop: "0" }}
                        onClick={() =>
                          window.open("https://t.me/zoomayor", "_blank")
                        }
                      >
                                                {translations.start}

                      </button>
                    </div>
                  </li>
                  {ads.map((ad) => (
                    <li key={ad.id} className="tasks-list__item">
                      <div className="tasks-list__card block-style">
                        <div className="tasks-list__wrap f-center">
                          <div
                            className="tasks-list__image"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={
                                ad.image_url
                                  ? `https://api.zoomayor.io${ad.image_url}`
                                  : DefaultImg
                              }
                              alt=""
                              style={{ height: "73%", borderRadius: "4px" }}
                            />
                          </div>
                          <div className="tasks-list__content">
                            <h3 className="tasks-list__title">{translations1[ad.id] || ad.title}</h3>
                            <p>{translations1[`${ad.id}_desc`] || ad.description}</p>
                            <ul className="friends-params f-center">
                              {ad.reward_value > 0 && (
                                <li className="friends-params__item f-center">
                                  <img src={CoinIcon} alt="" />
                                  {ad.reward_value}
                                </li>
                              )}
                              {ad.reward_experience > 0 && (
                                <li className="friends-params__item f-center">
                                  <img src={StarIcon} alt="" />
                                  {ad.reward_experience} EXP
                                </li>
                              )}
                              {ad.reward_energy > 0 && (
                                <li className="friends-params__item f-center">
                                  <span role="img" aria-label="energy">
                                    ⚡
                                  </span>
                                  {ad.reward_energy}
                                </li>
                              )}
                              {/* {ad.reward_card_id && (
                                <li className="friends-params__item f-center">
                                  <span role="img" aria-label="card">
                                    🎴
                                  </span>
                                  Карта
                                </li>
                              )} */}
                            </ul>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="tasks-list__btn"
                          style={{ marginTop: "0" }}
                          onClick={() => showRewardedAd(ad.id)}
                        >
                                                    {translations.watch}

                        </button>
                      </div>
                    </li>
                  ))}
             {referralTasks.map((task) => (
                    <li key={task.id} className="tasks-list__item">
                      <div className="tasks-list__card block-style">
                        <div className="tasks-list__wrap f-center">
                          <div className="tasks-list__image">
                            <img
                              src={DefaultImgTG}
                              alt=""
                              style={{ height: "73%" }}
                            />
                          </div>
                          <div className="tasks-list__content">
                            <h3 className="tasks-list__title">
                              Пригласите {task.friends_required} друзей
                            </h3>
                            <ul className="friends-params f-center">
                              {task.reward_experience > 0 && (
                                <li className="friends-params__item f-center">
                                  <img src={StarIcon} alt="" />
                                  {task.reward_experience} EXP
                                </li>
                              )}
                              {task.reward_coins > 0 && (
                                <li className="friends-params__item f-center">
                                  <img src={CoinIcon} alt="" />
                                  {task.reward_coins}
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <button
                          type="button"
                          // className={`tasks-list__btn ${
                          //   userReferrals >= task.friends_required ? "tasks-list__btn_done" : ""
                          // }`}
                          onClick={() => handleReferralReward(task)}
                          disabled={userReferrals < task.friends_required}
                        >
                          {userReferrals >= task.friends_required ? "Получить награду" : `${userReferrals}/${task.friends_required} друзей`}
                        </button>
                      </div>
                    </li>
                  ))}
  
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      <MobileNav />
    </section>
  );
};
export { routeTasks };
export default TasksPage;
