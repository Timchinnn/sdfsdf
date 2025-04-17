import React, { useState, useEffect } from "react";
import styles from "./BonusCodeManagement.module.css";
import routeBonusCodeManagement from "./route";
import { bonusCodeService, cardsService } from "../../services/api";
const BonusCodeManagement = () => {
  const [codes, setCodes] = useState([]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [codeCount, setCodeCount] = useState(1);
  const [availableCards, setAvailableCards] = useState([]); // Добавляем состояние для списка карт
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
    const fetchCards = async () => {
      try {
        const response = await cardsService.getAllCards();
        setAvailableCards(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке карт:", error);
      }
    };
    fetchCards();
  }, []);
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await bonusCodeService.getAllBonusCodes();
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
  const handleDelete = async (id) => {
    try {
      await bonusCodeService.deleteBonusCode(id);
      setCodes(codes.filter((code) => code.id !== id));
      alert("Код успешно удален");
    } catch (error) {
      console.error("Ошибка при удалении кода:", error);
      alert(
        `Ошибка при удалении кода: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };
  const saveCode = async (code) => {
    console.log("Начало сохранения кода:", code);

    try {
      // Подготовка данных
      const payload = {
        code: code.code,
        name: code.name,
        reward_type: null,
        reward_value: null,
        reward_card_id: null,
        expires_at: code.expiresAt || null,
      };
      // Определение типа награды
      if (code.rewards.coins > 0) {
        payload.reward_type = "coins";
        payload.reward_value = code.rewards.coins;
      } else if (code.rewards.experience > 0) {
        payload.reward_type = "experience";
        payload.reward_value = code.rewards.experience;
      } else if (code.rewards.energy > 0) {
        payload.reward_type = "energy";
        payload.reward_value = code.rewards.energy;
      } else if (code.rewards.cardId) {
        payload.reward_type = "card";
        payload.reward_card_id = code.rewards.cardId;
      }
      console.log("Отправляемые данные:", payload);
      const response = await bonusCodeService.createBonusCode(payload);
      console.log("Ответ сервера:", response.data);
      setCodes((prevCodes) => [...prevCodes, response.data]);
      alert("Код успешно сохранен");
    } catch (error) {
      console.error("Полная ошибка:", error);
      alert(
        `Ошибка при сохранении кода: ${
          error.response?.data?.error || error.message
        }`
      );
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
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={rewards.coins > 0}
                onChange={(e) =>
                  setRewards({
                    ...rewards,
                    coins: e.target.checked ? rewards.coins || 100 : 0,
                  })
                }
              />
              <label>Монеты:</label>
              <input
                type="number"
                placeholder="Монеты"
                value={rewards.coins}
                onChange={(e) =>
                  setRewards({ ...rewards, coins: parseInt(e.target.value) })
                }
                disabled={!rewards.coins}
              />
            </div>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={rewards.experience > 0}
                onChange={(e) =>
                  setRewards({
                    ...rewards,
                    experience: e.target.checked
                      ? rewards.experience || 100
                      : 0,
                  })
                }
              />
              <label>Опыт:</label>
              <input
                type="number"
                placeholder="Опыт"
                value={rewards.experience}
                onChange={(e) =>
                  setRewards({
                    ...rewards,
                    experience: parseInt(e.target.value),
                  })
                }
                disabled={!rewards.experience}
              />
            </div>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={rewards.energy > 0}
                onChange={(e) =>
                  setRewards({
                    ...rewards,
                    energy: e.target.checked ? rewards.energy || 10 : 0,
                  })
                }
              />
              <label>Энергия:</label>
              <input
                type="number"
                placeholder="Энергия"
                value={rewards.energy}
                onChange={(e) =>
                  setRewards({ ...rewards, energy: parseInt(e.target.value) })
                }
                disabled={!rewards.energy}
              />
            </div>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={selectedRewardTypes.card}
                onChange={(e) => {
                  setSelectedRewardTypes({
                    ...selectedRewardTypes,
                    card: e.target.checked,
                  });
                  if (!e.target.checked) {
                    setRewardValues({
                      ...rewardValues,
                      card: "",
                    });
                  }
                }}
              />
              <label>Карта:</label>
              <select
                value={rewardValues.card}
                onChange={(e) =>
                  setRewardValues({
                    ...rewardValues,
                    card: e.target.value,
                  })
                }
                disabled={!selectedRewardTypes.card}
              >
                <option value="">Выберите карту</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title}
                  </option>
                ))}
              </select>
            </div>
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
                <button
                  onClick={() => {
                    setGeneratedCodes(
                      generatedCodes.filter(
                        (code) => code.code !== codeData.code
                      )
                    );
                  }}
                  style={{ background: "#dc3545", color: "white" }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.existingCodes}>
        <h3>Существующие коды</h3>
        <div className={styles.codesList}>
          {codes.map((code) => (
            <div key={code.id} className={styles.codeItem}>
              <div className={styles.codeInfo}>
                <span>{code.name || "Без названия"}</span>
                <span>{code.code}</span>
                <span>
                  Статус: {code.is_used ? "Использован" : "Активен"}
                  {code.used_by && ` (${code.used_by})`}
                </span>
                <span>
                  {code.expires_at
                    ? `Истекает: ${new Date(
                        code.expires_at
                      ).toLocaleDateString()}`
                    : "Без срока действия"}
                </span>
              </div>
              <button
                onClick={() => handleDelete(code.id)}
                className={styles.deleteButton}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export { routeBonusCodeManagement };
export default BonusCodeManagement;
