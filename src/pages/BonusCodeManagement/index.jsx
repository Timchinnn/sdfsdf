import React, { useState, useEffect } from "react";
import styles from "./BonusCodeManagement.module.css";
import routeBonusCodeManagement from "./route";
import axios from "../../axios-controller";
const BonusCodeManagement = () => {
  const [codes, setCodes] = useState([]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [codeCount, setCodeCount] = useState(1);
  const [rewards, setRewards] = useState({
    coins: 0,
    experience: 0,
    energy: 0,
    cardId: "",
  });
  const [codeName, setCodeName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  // Загрузка существующих кодов
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await axios.get("/api/bonus-codes");
        setCodes(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке кодов:", error);
      }
    };
    fetchCodes();
  }, []);
  // Генерация нового кода
  const generateBonusCode = () => {
    const newCodes = Array(parseInt(codeCount))
      .fill()
      .map(() => ({
        code: Math.random().toString(36).substring(7).toUpperCase(),
        rewards,
        name: codeName,
        expiresAt,
        createdAt: new Date().toISOString(),
      }));
    setGeneratedCodes([...generatedCodes, ...newCodes]);
  };
  // Копирование кода в буфер обмена
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Код скопирован в буфер обмена");
  };
  // Сохранение кода
  const saveCode = async (code) => {
    try {
      const response = await axios.post("/api/bonus-codes", {
        code: code.code,
        reward_type: Object.keys(code.rewards).find(
          (key) => code.rewards[key] > 0
        ),
        reward_value:
          code.rewards[
            Object.keys(code.rewards).find((key) => code.rewards[key] > 0)
          ],
        expires_at: code.expiresAt,
      });
      setCodes([...codes, response.data]);
      alert("Код успешно сохранен");
    } catch (error) {
      console.error("Ошибка при сохранении кода:", error);
      alert("Ошибка при сохранении кода");
    }
  };
  return (
    <div className={styles.container}>
      <h2>Управление бонус-кодами</h2>
      <div className={styles.generatorSection}>
        <h3>Генератор кодов</h3>
        <div className={styles.inputGroup}>
          <label>Название кода:</label>
          <input
            type="text"
            value={codeName}
            onChange={(e) => setCodeName(e.target.value)}
            placeholder="Введите название кода"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Количество кодов:</label>
          <input
            type="number"
            value={codeCount}
            onChange={(e) => setCodeCount(e.target.value)}
            min="1"
            max="100"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Срок действия:</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
        <div className={styles.rewardsSection}>
          <h4>Награды</h4>
          <div className={styles.rewardInputs}>
            <input
              type="number"
              placeholder="Монеты"
              value={rewards.coins}
              onChange={(e) =>
                setRewards({ ...rewards, coins: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Опыт"
              value={rewards.experience}
              onChange={(e) =>
                setRewards({ ...rewards, experience: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Энергия"
              value={rewards.energy}
              onChange={(e) =>
                setRewards({ ...rewards, energy: parseInt(e.target.value) })
              }
            />
            <input
              type="text"
              placeholder="ID карты"
              value={rewards.cardId}
              onChange={(e) =>
                setRewards({ ...rewards, cardId: e.target.value })
              }
            />
          </div>
        </div>
        <button onClick={generateBonusCode} className={styles.generateButton}>
          Сгенерировать коды
        </button>
      </div>
      <div className={styles.generatedCodes}>
        <h3>Сгенерированные коды</h3>
        <div className={styles.codesList}>
          {generatedCodes.map((codeData, index) => (
            <div key={index} className={styles.codeItem}>
              <div className={styles.codeInfo}>
                <span>{codeData.name}</span>
                <span>{codeData.code}</span>
                <span>{new Date(codeData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.codeActions}>
                <button onClick={() => copyToClipboard(codeData.code)}>
                  Копировать
                </button>
                <button onClick={() => saveCode(codeData)}>Сохранить</button>
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
