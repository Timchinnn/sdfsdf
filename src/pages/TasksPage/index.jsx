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
import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
// Определяем URL-ы для остальных изображений, которые используются в MainSection
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const TasksPage = () => {
  const [AdController, setAdController] = useState(null);
  const [ads, setAds] = useState([]); // Добавляем состояние для рекламы

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
    }, 2000);
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
  useEffect(() => {
    // Загружаем рекламу при монтировании компонента
    const fetchAds = async () => {
      try {
        const response = await adsService.getAllAds();
        setAds(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рекламы:", error);
      }
    };
    fetchAds();
    // Инициализация SDK рекламы
    const script = document.createElement("script");
    script.src = "https://sad.adsgram.ai/js/sad.min.js";
    script.async = true;
    script.onload = () => {
      const controller = window.Adsgram.init({
        blockId: "9521",
      });
      setAdController(controller);
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
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
            title: "Награда получена!",
            message: `Вы получили награду за просмотр рекламы!`,
            buttons: [
              {
                type: "ok",
                text: "Отлично!",
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error("Подробная ошибка:", error);
      // Показываем ошибку пользователю
      window.Telegram.WebApp.showPopup({
        title: "Ошибка",
        message: "Не удалось получить награду. Попробуйте позже.",
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
              <div className="tasks-block">
                <div className="tasks-head">
                  <div className="section-content">
                    <h2 className="section-content__title">
                      Награды за задания
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
                            Подписаться на телеграм канал https://t.me/zoomayor
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
                        Начать
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
                            <h3 className="tasks-list__title">{ad.title}</h3>
                            <p>{ad.description}</p>
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
                          Смотреть
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
