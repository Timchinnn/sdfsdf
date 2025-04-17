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
  const [history, setHistory] = useState([]);
  const tg = window.Telegram?.WebApp;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchHistory = async () => {
      if (tg?.initDataUnsafe?.user?.id) {
        try {
          const response = await bonusCodeService.getHistory(
            tg.initDataUnsafe.user.id
          );
          setHistory(response.data);
        } catch (err) {
          console.error("Error fetching history:", err);
        }
      }
    };
    fetchHistory();
  }, []);
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
        // Обновляем историю после активации
        const historyResponse = await bonusCodeService.getHistory(telegram_id);
        setHistory(historyResponse.data);

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
                <h2 className="section-content__title">История активаций</h2>
              </div>
              <ul className="friends-list">
                {history.map((item) => (
                  <li key={item.id} className="friends-list__item">
                    <div className="friends-list__card block-style flex">
                      <div className="friends-list__content">
                        <h3 className="friends-list__title">
                          {item.name || "Бонус код"}
                        </h3>
                        <p className="friends-list__code">{item.code}</p>
                        <ul className="friends-params f-center">
                          {item.reward_type === "coins" && (
                            <li className="friends-params__item f-center">
                              <img src={CoinIcon} alt="" />
                              {item.reward_value}
                            </li>
                          )}
                          {item.reward_type === "experience" && (
                            <li className="friends-params__item f-center">
                              <img src={StarIcon} alt="" />
                              {item.reward_value} EXP
                            </li>
                          )}
                        </ul>
                        <p className="friends-list__date">
                          Активирован:{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
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
