import React, { useState, useEffect } from "react";
import styles from "./BonusCodeManagement.module.css";
import routeBonusCodeManagement from "./route";
import { bonusCodeService, cardsService } from "../../services/api";
import axios from "../../axios-controller";
import left from "assets/img/left.png";
import addimg from "assets/img/addimg.png";
import { useParams, useHistory } from "react-router-dom";

import right from "assets/img/right.png";
const BonusCodeManagement = () => {
  const { id } = useParams();
  const history = useHistory();
  const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [showAddCards, setShowAddCards] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [codes, setCodes] = useState([]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [codeCount, setCodeCount] = useState(1);
  const [availableCards, setAvailableCards] = useState([]); // Добавляем состояние для списка карт
  const [hasEditPermission, setHasEditPermission] = useState(false);
  // Check permissionsd
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const adminUsername = localStorage.getItem("adminUsername");
        if (adminUsername) {
          const response = await axios.get(
            `/moderators/permissions/${adminUsername}`
          );
          setHasEditPermission(
            response.data.permissions.some(
              (p) => p.permission_name === "Добавление и редактирование бонусов"
            )
          );
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
      }
    };
    checkPermissions();
  }, []);
  const [rewards, setRewards] = useState({
    coins: 0,
    experience: 0,
    energy: 0,
    cardId: "",
  });
  const [codeName, setCodeName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const downloadCodesAsTxt = () => {
    // if (generatedCodes.length === 0) {
    //   alert("Нет сгенерированных кодов для скачивания");
    //   return;
    // }
    const codesText = codes
      .map((codeData) => {
        return `Код: ${codeData.code}\nНазвание: ${codeData.name}\nСтатус: ${
          codeData.is_used ? "Использован" : "Активен"
        }\n${
          codeData.expiresAt
            ? `Истекает: ${new Date(codeData.expiresAt).toLocaleDateString()}\n`
            : ""
        }\n`;
      })

      .join("---\n");
    const blob = new Blob([codesText], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bonus-codes-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  // Загрузка существующих кодов
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await cardsService.getAllCards();
        setAvailableCards(response.data);
        setCards(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке карт:", error);
      }
    };
    fetchCards();
  }, []);
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await bonusCodeService.getAllBonusCodes(id);
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
  const saveCode = async (codeData) => {
    try {
      // Подготовка данных
      const payload = {
        code: codeData.code,
        name: codeData.name,
        reward_type: null,
        reward_value: null,
        reward_card_id: null,
        max_uses: 1, // Add default max_uses value
        expires_at: codeData.expiresAt || null,
        rewards: JSON.stringify(codeData.rewards),
      };
      // Определение типа награды (для обратной совместимости, если потребуется)
      if (codeData.rewards.coins > 0) {
        payload.reward_type = "coins";
        payload.reward_value = codeData.rewards.coins;
      } else if (codeData.rewards.experience > 0) {
        payload.reward_type = "experience";
        payload.reward_value = codeData.rewards.experience;
      } else if (codeData.rewards.energy > 0) {
        payload.reward_type = "energy";
        payload.reward_value = codeData.rewards.energy;
      } else if (codeData.rewards.cardId) {
        payload.reward_type = "card";
        payload.reward_card_id = codeData.rewards.cardId;
      }
      const response = await bonusCodeService.createBonusCode(payload);
      // Добавляем код в список существующих кодов
      setCodes((prevCodes) => [...prevCodes, response.data]);
      alert("Код успешно сохранен");
      // Удаляем сохранённый код из списка сгенерированных кодов
      setGeneratedCodes((prev) =>
        prev.filter((item) => item.code !== codeData.code)
      );
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
    <div
      className={styles.container}
      style={{ display: hasEditPermission ? "block" : "none" }}
    >
      <h2>Управление бонус-кодами</h2>
      <div>
        {" "}
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
                  checked={rewards.cardId !== ""}
                  onChange={(e) =>
                    setRewards({
                      ...rewards,
                      cardId: e.target.checked
                        ? rewards.cardId !== ""
                          ? rewards.cardId
                          : ""
                        : "",
                    })
                  }
                />
                <div className={styles.mainContent}>
                  {selectedCard ? (
                    <div className={styles.cardItem}>
                      <div className={styles.cardItemImg}>
                        <img
                          src={`https://api.zoomayor.io${selectedCard.image}`}
                          alt={selectedCard.title}
                        />
                      </div>
                      <div className={styles.cardInfo}>
                        <h3>{selectedCard.title}</h3>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCard(null);
                          setRewards({ ...rewards, cardId: "" });
                        }}
                        className={styles.deleteButton}
                      >
                        Удалить
                      </button>
                    </div>
                  ) : (
                    <div
                      className={styles.whiteBox}
                      onClick={() => setShowAddCards(!showAddCards)}
                    >
                      <div className={styles.whiteBoxImg}>
                        <img src={addimg} alt="#" style={{ height: "64px" }} />
                        <p>Выберите карту</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {showAddCards && !selectedCard && (
                <div>
                  <h3>Выберите карту:</h3>
                  <div className={styles.mainContent}>
                    <img
                      src={left}
                      className={styles.arrow}
                      onClick={() => {
                        currentAvailableIndex > 0 &&
                          setCurrentAvailableIndex(currentAvailableIndex - 1);
                      }}
                      alt="Previous"
                    />
                    {cards
                      .filter((card) => card.title.toLowerCase())
                      .slice(currentAvailableIndex, currentAvailableIndex + 3)
                      .map((card) => (
                        <div key={card.id} className={styles.cardItem}>
                          <div className={styles.cardItemImg}>
                            <img
                              src={`https://api.zoomayor.io${card.image}`}
                              alt={card.title}
                            />
                          </div>
                          <div className={styles.cardInfo}>
                            <h3>{card.title}</h3>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCard(card);
                              setRewards({ ...rewards, cardId: card.id });
                              setShowAddCards(false);
                            }}
                            className={styles.chooseCard}
                          >
                            Выбрать
                          </button>
                        </div>
                      ))}
                    <img
                      src={right}
                      className={styles.arrow}
                      onClick={() => {
                        currentAvailableIndex < cards.length - 3 &&
                          setCurrentAvailableIndex(currentAvailableIndex + 1);
                      }}
                      alt="Next"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <button onClick={generateBonusCode} className={styles.generateButton}>
            Сгенерировать коды
          </button>
          {id && (
            <button
              onClick={downloadCodesAsTxt}
              className={styles.generateButton}
              style={{ marginLeft: "10px" }}
            >
              Скачать коды в TXT
            </button>
          )}
        </div>
        {!id && (
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
        )}
        <div className={styles.inputGroup}>
          <label>Срок действия:</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
      </div>

      {/* <div className={styles.generatedCodes}>
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
      </div> */}
    </div>
  );
};
export { routeBonusCodeManagement };
export default BonusCodeManagement;
