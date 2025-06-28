import React, { useState, useEffect } from "react";
import { userInitService } from "services/api";
import routeFriends from "./routes";
import MainSection from "components/MainSection";
import DefaultImg from "assets/img/default-img.png";
import StarIcon from "assets/img/star-icon.svg";
import CoinIcon from "assets/img/coin-icon.svg";
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
const FriendsPage = () => {
  // copy text
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState([]);

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
    }, 3000);
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
    const fetchReferralData = async () => {
      try {
        const tg = window.Telegram.WebApp;
        if (tg && tg.initDataUnsafe?.user?.id) {
          const telegram_id = tg.initDataUnsafe.user.id;
          // Get referral code
          const codeResponse = await userInitService.getReferralCode(
            telegram_id
          );
          setReferralCode(codeResponse.data.referral_code);
          // Get referrals list
          const referralsResponse = await userInitService.getReferrals(
            telegram_id
          );
          // console.log(referralsResponse);
          setReferrals(referralsResponse.data.referrals);
        }
      } catch (error) {
        console.error("Error fetching referral");
      }
    };
    fetchReferralData();
  }, []);
  const copyToClipboard = () => {
    const referralUrl = `t.me/ZooMayorbot?start=${referralCode}`;
    navigator.clipboard
      .writeText(referralUrl)
      .then(() => {
        // Open Telegram with the referral link
        window.open(`https://${referralUrl}`, "_blank");
      })
      .catch((err) => {
        console.error("Ошибка копирования: ", err);
      });
  };
  return (
    <section className="friends">
      <div className="container">
        <div className="friends-inner">
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
              <div className="friends-referal block-style">
                <div className="section-content">
                  <h2 className="section-content__title">
                    Реферальная система
                  </h2>
                  <p className="section-content__text">
                    копируйте ссылку и отправьте другу
                  </p>
                </div>
                <div className="friends-referal__url">
                  <input
                    type="text"
                    name="url"
                    value={`t.me/zoooparkweb_bot?start=${referralCode}`}
                    readOnly
                  />
                  <button
                    type="button"
                    className="friends-referal__copy"
                    onClick={copyToClipboard}
                  >
                    <svg
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.60644 0.450684H11.4219C13.2065 0.450684 14.0283 1.33887 14.0283 3.07373V3.15674L6.62402 3.15674C4.25 3.15674 3.01318 4.38525 3.01318 6.74268L3.01318 13.873H2.60645C0.863281 13.873 0 13.0181 0 11.2998V3.02393C0 1.30567 0.86328 0.450684 2.60644 0.450684ZM18.2902 16.964C18.876 16.3782 18.876 15.4354 18.876 13.5498V8.28357C18.876 6.39795 18.876 5.45514 18.2902 4.86935C17.7044 4.28357 16.7616 4.28357 14.876 4.28357L8.13306 4.28357C6.24744 4.28357 5.30463 4.28357 4.71884 4.86936C4.13306 5.45514 4.13306 6.39795 4.13306 8.28357L4.13306 13.5498C4.13306 15.4354 4.13306 16.3782 4.71884 16.964C5.30463 17.5498 6.24744 17.5498 8.13306 17.5498H14.876C16.7616 17.5498 17.7044 17.5498 18.2902 16.964Z"
                        fill="#AAB2BD"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  className="friends-referal__btn"
                  onClick={copyToClipboard}
                >
                  Пригласить
                </button>
              </div>
              <div className="friends-block">
                <div className="friends-block__head f-center-jcsb">
                  <h2 className="section-content__title">Ваши друзья</h2>
                  <div className="friends-block__head-more">Смотреть всех</div>
                </div>
                <ul className="friends-list">
                  {Array.isArray(referrals) &&
                    referrals.map((referral) => (
                      <li key={referral.id} className="friends-list__item">
                        <div className="friends-list__card block-style flex">
                          <div className="friends-list__image">
                            <img
                              src={referral.photo_url || DefaultImg}
                              alt=""
                            />
                          </div>
                          <div className="friends-list__content">
                            <h3 className="friends-list__title">
                              {referral.username}
                            </h3>
                            <p className="friends-list__date">
                              {referral.joinDate}
                            </p>
                            <ul className="friends-params f-center">
                              <li className="friends-params__item f-center">
                                <img src={StarIcon} alt="" />
                                200 EXP
                              </li>
                              <li className="friends-params__item f-center">
                                <img src={CoinIcon} alt="" />
                                5000
                              </li>
                            </ul>
                          </div>
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
export { routeFriends };
export default FriendsPage;
