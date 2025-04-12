import React, { useEffect, useState } from "react";
import routeTasks from "./routes";
import MainSection from "components/MainSection";
import DefaultImg from "assets/img/free-icon-play-button-526510.png";
import DefaultImgTG from "assets/img/unnamed.png";
// import axios from "../../axios-controller";
import { adsService } from "../../services/api";
import { processReward } from "../../services/api";
import CoinIcon from "assets/img/coin-icon.svg";
import StarIcon from "assets/img/star-icon.svg";
import MobileNav from "components/MobileNav";
const TasksPage = () => {
  const [AdController, setAdController] = useState(null);
  const [ads, setAds] = useState([]); // Добавляем состояние для рекламы
  useEffect(() => {
    // Загружаем рекламу при монтировании компонента
    const fetchAds = async () => {
      try {
        const response = await adsService.getAllAds();
        setAds(response.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
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
      console.log("Результат показа рекламы:", result);

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
          <MainSection />
          <div className="tasks-block">
            <div className="tasks-head">
              <div className="section-content">
                <h2 className="section-content__title">Награды за задания</h2>
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
              {/* <li className="tasks-list__item">
                <div className="tasks-list__card block-style">
                  <div className="tasks-list__wrap f-center">
                    <div className="tasks-list__image">
                      <img src={DefaultImg} alt="" />
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
                    className="tasks-list__btn tasks-list__btn_done"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.65112 14.4541C5.2605 14.4541 4.97144 14.29 4.698 13.9541L0.651123 8.8916C0.455811 8.64941 0.369873 8.42285 0.369873 8.18848C0.369873 7.64941 0.768311 7.25879 1.31519 7.25879C1.65894 7.25879 1.89331 7.38379 2.11987 7.68848L5.61987 12.1807L12.4089 1.39941C12.6433 1.03223 12.8699 0.899414 13.2527 0.899414C13.7996 0.899414 14.1746 1.27441 14.1746 1.81348C14.1746 2.02441 14.1121 2.24316 13.948 2.49316L6.60425 13.9463C6.37769 14.2822 6.06519 14.4541 5.65112 14.4541Z"
                        fill="#F5F7FA"
                      />
                    </svg>
                  </button>
                </div>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
      <MobileNav />
    </section>
  );
};

export { routeTasks };

export default TasksPage;
