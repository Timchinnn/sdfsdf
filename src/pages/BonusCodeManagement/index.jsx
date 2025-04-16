import React from "react";
import styles from "./BonusCodeManagement.module.css";
import routeBonusCodeManagement from "./routes";
import axios from "../../axios-controller";
const BonusCodeManagement = () => {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState({
    code: "",
    reward_type: "coins",
    reward_value: "",
    reward_card_id: "",
    expires_at: "",
  });
  const [cards, setCards] = useState([]);
  useEffect(() => {
    fetchCodes();
    fetchCards();
  }, []);
  const fetchCodes = async () => {
    try {
      const response = await axios.get("/api/bonus-codes");
      setCodes(response.data);
    } catch (error) {
      console.error("Error fetching codes:", error);
    }
  };
  const fetchCards = async () => {
    try {
      const response = await axios.get("/cards");
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/bonus-codes", newCode);
      setNewCode({
        code: "",
        reward_type: "coins",
        reward_value: "",
        reward_card_id: "",
        expires_at: "",
      });
      fetchCodes();
    } catch (error) {
      console.error("Error creating bonus code:", error);
    }
  };
  const handleTestCode = async (code, telegram_id = "123456789") => {
    console.log(1);
    try {
      const response = await axios.post("/api/bonus-codes/activate", {
        code,
        telegram_id,
      });
      alert(
        `Код успешно активирован! Награда: ${JSON.stringify(
          response.data.reward
        )}`
      );
    } catch (error) {
      alert(error.response?.data?.error || "Ошибка при активации кода");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.generatorSection}>
        <h2>Создать бонус-код</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Код:</label>
            <input
              type="text"
              value={newCode.code}
              onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Тип награды:</label>
            <select
              value={newCode.reward_type}
              onChange={(e) =>
                setNewCode({ ...newCode, reward_type: e.target.value })
              }
            >
              <option value="coins">Монеты</option>
              <option value="card">Карта</option>
              <option value="energy">Энергия</option>
              <option value="experience">Опыт</option>
            </select>
          </div>
          {newCode.reward_type === "card" ? (
            <div className={styles.inputGroup}>
              <label>Выберите карту:</label>
              <select
                value={newCode.reward_card_id}
                onChange={(e) =>
                  setNewCode({ ...newCode, reward_card_id: e.target.value })
                }
              >
                <option value="">Выберите карту</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label>Значение награды:</label>
              <input
                type="number"
                value={newCode.reward_value}
                onChange={(e) =>
                  setNewCode({ ...newCode, reward_value: e.target.value })
                }
                required
              />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label>Срок действия (необязательно):</label>
            <input
              type="datetime-local"
              value={newCode.expires_at}
              onChange={(e) =>
                setNewCode({ ...newCode, expires_at: e.target.value })
              }
            />
          </div>
          <button type="submit" className={styles.generateButton}>
            Создать код
          </button>
        </form>
      </div>
      <div className={styles.generatedCodes}>
        <h2>Существующие коды</h2>
        <div className={styles.codesList}>
          {codes.map((code) => (
            <div key={code.id} className={styles.codeItem}>
              <div className={styles.codeInfo}>
                <span>{code.code}</span>
                <span>
                  {code.reward_type === "card"
                    ? `Карта: ${
                        cards.find((c) => c.id === code.reward_card_id)
                          ?.title || code.reward_card_id
                      }`
                    : `${code.reward_type}: ${code.reward_value}`}
                </span>
                <span>{code.is_used ? "Использован" : "Активен"}</span>
              </div>
              <div className={styles.codeActions}>
                <button onClick={() => handleTestCode(code.code)}>
                  Тестировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export { routeBonusCodeManagement };
export default BonusCodeManagement;
