import React from "react";
import routeBonus from "./routes";
import MainSection from "components/MainSection";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleActivateCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const tg = window.Telegram.WebApp;
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
          {/* <div
            className="block-style"
            style={{ textAlign: "center", padding: "20px", marginTop: "6px" }}
          >
            Скоро
          </div> */}
          <div className="bonus-wrap">
            <div className="bonus-promo block-style">
              <div className="section-content">
                <h2 className="section-content__title">Код</h2>
                <p className="section-content__text">
                  Краткое описание, буквально в 2-3 строки, где найти код
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
