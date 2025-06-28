import React, { useState, useEffect } from "react";
import routeSets from "./routes";
import MainSection from "components/MainSection";
import Spinner from "components/Spinner"; // Добавляем импорт спиннера
import { userInitService } from "services/api"; // Импортируем сервис для API
import MobileNav from "components/MobileNav";
// Импортируем необходимые локальные изображения
import Avatar from "assets/img/avatar.png";
import TimeIcon from "assets/img/time-icon.svg";
import MoneyIcon from "assets/img/money-icon.svg";
// Определяем URL-ы для остальных изображений
const cardImg = "https://image.tw1.ru/image/card.webp";
const taskImg = "https://image.tw1.ru/image/vopros.webp";
const bonusImg = "https://image.tw1.ru/image/sunduk.webp";
const SetsPage = () => {
  // Добавляем состояния для спиннера и загрузки данных
  const [showSpinner, setShowSpinner] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState("");
  const [currentExp, setCurrentExp] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(1000);
  const [userAvatar, setUserAvatar] = useState(null);
  // Эффект для загрузки данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      const tg = window.Telegram.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        try {
          const telegram_id = tg.initDataUnsafe.user.id;

          // Получаем данные пользователя
          const userResponse = await userInitService.getUser(telegram_id);
          if (userResponse.data && userResponse.data.coins) {
            setCoins(userResponse.data.coins);
          }

          // Получаем почасовой доход
          const hourlyIncomeResponse = await userInitService.getHourlyIncome(
            telegram_id
          );
          if (
            hourlyIncomeResponse.data &&
            hourlyIncomeResponse.data.hourly_income
          ) {
            setHourlyIncome(hourlyIncomeResponse.data.hourly_income);
          }

          // Получаем уровень пользователя
          const levelResponse = await userInitService.getUserLevel(telegram_id);
          setLevel(levelResponse.data.level);
          setCurrentExp(levelResponse.data.currentExperience);
          setExpForNextLevel(levelResponse.data.experienceToNextLevel);

          // Устанавливаем аватар пользователя
          const userPhoto = tg.initDataUnsafe.user.photo_url;
          if (userPhoto) {
            setUserAvatar(userPhoto);
          }

          // Данные загружены
          setUserDataLoaded(true);

          // Скрываем спиннер после небольшой задержки
          setTimeout(() => {
            setShowSpinner(false);
          }, 1000);
        } catch (error) {
          console.error("Error fetching userf");
          setShowSpinner(false);
        }
      } else {
        setShowSpinner(false);
      }
    };

    fetchUserData();
  }, []);
  // Добавляем эффект для загрузки фото пользователя, аналогично MainPage
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
          console.error("Error initializing user photo:", error);
          setUserAvatar(null);
        }
      }
    };

    if (userDataLoaded) {
      initializeUserPhoto();
    }
  }, [userDataLoaded]);
  return (
    <section className="sets">
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
                defaultAvatar={Avatar} // Передаем дефолтное изображение
                timeIcon={TimeIcon}
                moneyIcon={MoneyIcon}
                cardImg={cardImg}
                taskImg={taskImg}
                bonusImg={bonusImg}
              />
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
              {/* Здесь будет остальной контент после раскомментирования */}
            </>
          )}
        </div>
      </div>
      <MobileNav />
    </section>
  );
};
export { routeSets };
export default SetsPage;
