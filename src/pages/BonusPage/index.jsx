import React, { useState } from "react";
import routeBonus from "./routes";
import MainSection from "components/MainSection";
import { bonusCodeService } from "../../services/api";
import DefaultImg from "assets/img/default-img.png";
import CoinIcon from "assets/img/coin-icon.svg";
import StarIcon from "assets/img/star-icon.svg";
import MobileNav from "components/MobileNav";
const BonusPage = () => {
  const [code, setCode] = useState("");
  // Состояния для отображения информации о активированном коде и наградах
  const [activatedCode, setActivatedCode] = useState(null);
  const [rewardInfo, setRewardInfo] = useState(null);
  const tg = window.Telegram?.WebApp;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleActivateCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!tg || !tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        throw new Error("Telegram user data not found");
      }
      const telegram_id = tg.initDataUnsafe.user.id;
      const response = await bonusCodeService.activateCode(telegram_id, code);
      if (response.data.success) {
        tg.showPopup({
          title: "Успех!",
          message: "Бонус код успешно активирован",
          buttons: [{ type: "ok" }],
        });
        // Сохраняем значения кода и награды для отображения
        setActivatedCode(code);
        setRewardInfo(response.data.reward);
        setCode("");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Ошибка при активации кода");
      tg.showPopup({
        title: "Ошибка",
        message: error.response?.data?.error || "Ошибка при активации кода",
        buttons: [{ type: "ok" }],
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="bonus">
      <div className="container">
        <div className="tasks-inner">
          <MainSection />
          <div className="bonus-wrap">
            <div className="bonus-promo block-style">
              <div className="section-content">
                <h2 className="section-content__title">Код</h2>
                <p className="section-content__text">
                  Краткое описание, где найти код
                </p>
              </div>
              <div className="bonus-promo__code">
                <div className="bonus-promo__code-input">
                  <input
                    type="text"
                    name="promo"
                    placeholder="Введите код"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="button"
                  className="bonus-promo__code-btn"
                  onClick={handleActivateCode}
                  disabled={isLoading || !code}
                >
                  {isLoading ? "Активация..." : "Применить"}
                </button>
              </div>
            </div>
            {/* Отображение информации об активированном бонус-коде и наградах */}
            {activatedCode && rewardInfo && (
              <div
                className="activated-code-info block-style"
                style={{ marginTop: "20px", padding: "20px" }}
              >
                <h3>Бонус-код "{activatedCode}" активирован!</h3>
                <p>Полученные награды:</p>
                <ul>
                  {rewardInfo.type && (
                    <li>
                      <strong>Тип награды:</strong> {rewardInfo.type}
                    </li>
                  )}
                  {rewardInfo.value !== undefined && (
                    <li>
                      <strong>Значение награды:</strong> {rewardInfo.value}
                    </li>
                  )}
                  {rewardInfo.card_id && (
                    <li>
                      <strong>Награда - карта:</strong> ID {rewardInfo.card_id}
                    </li>
                  )}
                </ul>
              </div>
            )}
            <div className="bonus-more">
              <div className="friends-block__head f-center-jcsb">
                <h2 className="section-content__title">История</h2>
                <div className="friends-block__head-more">Смотреть всех</div>
              </div>
              <ul className="friends-list">
                <li className="friends-list__item">
                  <div className="friends-list__card block-style flex">
                    <div className="friends-list__image">
                      <img src={DefaultImg} alt="" />
                    </div>
                    <div className="friends-list__content">
                      <h3 className="friends-list__title">
                        Ko****ntin Konstant****olsky
                      </h3>
                      <p className="friends-list__code">
                        YHG43-343443-34433-343
                      </p>
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
                </li>
                <li className="friends-list__item">
                  <div className="friends-list__card block-style flex">
                    <div className="friends-list__image">
                      <img src={DefaultImg} alt="" />
                    </div>
                    <div className="friends-list__content">
                      <h3 className="friends-list__title">
                        Ko****ntin Konstant****olsky
                      </h3>
                      <p className="friends-list__code">
                        YHG43-343443-34433-343
                      </p>
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
                </li>
                <li className="friends-list__item">
                  <div className="friends-list__card block-style flex">
                    <div className="friends-list__image">
                      <img src={DefaultImg} alt="" />
                    </div>
                    <div className="friends-list__content">
                      <h3 className="friends-list__title">
                        Ko****ntin Konstant****olsky
                      </h3>
                      <p className="friends-list__code">
                        YHG43-343443-34433-343
                      </p>
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
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </section>
  );
};
export { routeBonus };
export default BonusPage;
