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
  const [shortInviteCodes, setShortInviteCodes] = useState(false); // Add state for trackingd
  const { id } = useParams();
  const [bonusStatus, setBonusStatus] = useState(null);

  const [description, setDescription] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isMultiUse, setIsMultiUse] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
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
    const fetchBonusStatus = async () => {
      try {
        const response = await axios.get(`/bonuses/${id}/status`);
        setBonusStatus(response.data.is_active);
      } catch (err) {
        console.error("Error fetching bonus status:", err);
      }
    };
    if (id) {
      fetchBonusStatus();
    }
  }, [id]);
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
    const codesToDownload = id ? codes : generatedCodes;
    if (codesToDownload.length === 0) {
      alert("Нет кодов для скачивания");
      return;
    }
    const codesText = codesToDownload
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
        console.log(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке кодов:", error);
      }
    };
    fetchCodes();
  }, []);
  // Генерация нового кода

  // Копирование кода в буфер обмена
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Код скопирован в буфер обмена");
  };
  // Сохранение кода
  const handleActivateBonus = async () => {
    try {
      const response = await axios.put(`/bonuses/${id}/activate`, {
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      setBonusStatus(true);
    } catch (err) {
      console.error("Error activating bonus:", err);
    }
  };
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
  const generateBonusCode = () => {
    const newCodes = Array(parseInt(codeCount))
      .fill()
      .map(() => ({
        code: Math.random().toString(36).substring(7).toUpperCase(),
        name: codeName,
        rewards,
        expiresAt,
        createdAt: new Date().toISOString(),
      }));
    setGeneratedCodes([...generatedCodes, ...newCodes]);
  };
  const saveCode = async (codes) => {
    try {
      // Prepare codes data for bulk insert
      const payload = {
        codes: codes.map((codeData) => ({
          code: codeData.code,
          name: codeData.name,
          description: description,
          note: adminNotes,
          reward_type: null,
          reward_value: null,
          reward_card_id: null,
          max_uses: 1,
          expires_at: expiresAt || null,
          rewards: JSON.stringify(codeData.rewards),
        })),
      };
      console.log(payload);
      // Set reward type and value based on first code's rewards
      // (assuming all codes in batch have same rewards)
      if (codes[0].rewards.coins > 0) {
        payload.codes = payload.codes.map((code) => ({
          ...code,
          reward_type: "coins",
          reward_value: codes[0].rewards.coins,
        }));
      } else if (codes[0].rewards.experience > 0) {
        payload.codes = payload.codes.map((code) => ({
          ...code,
          reward_type: "experience",
          reward_value: codes[0].rewards.experience,
        }));
      } else if (codes[0].rewards.energy > 0) {
        payload.codes = payload.codes.map((code) => ({
          ...code,
          reward_type: "energy",
          reward_value: codes[0].rewards.energy,
        }));
      } else if (codes[0].rewards.cardId) {
        payload.codes = payload.codes.map((code) => ({
          ...code,
          reward_type: "card",
          reward_card_id: codes[0].rewards.cardId,
        }));
      }
      const response = await bonusCodeService.createBonusCodes(payload);

      // Add codes to existing codes list
      setCodes((prevCodes) => [...prevCodes, ...response.data.codes]);
      // Remove saved codes from generated codes
      const savedCodeIds = new Set(response.data.codes.map((c) => c.code));
      setGeneratedCodes((prev) =>
        prev.filter((code) => !savedCodeIds.has(code.code))
      );
    } catch (error) {
      console.error("Error saving codes:", error);
      alert(
        `Error saving codes: ${error.response?.data?.error || error.message}`
      );
    }
  };
  const handleSaveCode = async () => {
    try {
      if (!shortInviteCodes) {
        // For regular invite codes, generate and save codes in bulk
        const newCodes = Array(parseInt(codeCount))
          .fill()
          .map(() => ({
            code: Math.random().toString(36).substring(7).toUpperCase(),
            name: codeName,
            description: description,
            note: adminNotes,
            rewards,
            expiresAt,
            createdAt: new Date().toISOString(),
          }));
        setGeneratedCodes([...generatedCodes, ...newCodes]);
        await saveCode(newCodes);
      } else {
        // For short invite codes
        const max_uses = isLimited
          ? parseInt(codeCount)
          : isMultiUse
          ? 1000000
          : 1;
        const payload = {
          code: codeName,
          name: codeName,
          description: description,
          note: adminNotes,
          reward_type:
            rewards.coins > 0
              ? "coins"
              : rewards.experience > 0
              ? "experience"
              : rewards.energy > 0
              ? "energy"
              : rewards.cardId
              ? "card"
              : null,
          reward_value:
            rewards.coins || rewards.experience || rewards.energy || null,
          reward_card_id: rewards.cardId || null,
          max_uses: max_uses,
          expires_at: expiresAt || null,
          rewards: JSON.stringify(rewards),
        };
        await bonusCodeService.createBonusCode(payload);
      }
      // Clear form after successful save
      setCodeName("");
      setRewards({
        coins: 0,
        experience: 0,
        energy: 0,
        cardId: "",
      });
      setExpiresAt("");
      alert("Код успешно сохранен");
    } catch (error) {
      console.error("Error saving code:", error);
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
      <div className={styles.sectionMain}>
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
          <div className={styles.inputGroup}>
            <label>Описание:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание бонус-кода"
              className={styles.textarea}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Заметки администратора:</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Внутренние заметки (видны только администраторам)"
              className={styles.textarea}
            />
          </div>
          <div className={styles.inputGroup}>
            <label style={{ marginBottom: "14px" }}>
              Срок окончания (дата и время):
            </label>
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
        </div>
        <div>
          {!id && (
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={!shortInviteCodes}
                onChange={(e) => {
                  setShortInviteCodes(false);
                  setIsMultiUse(false);
                  setIsLimited(false);
                }}
              />
              <h3>Обычные инвайт коды</h3>
            </div>
          )}
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
          )}{" "}
          {!id && (
            <>
              <button
                onClick={generateBonusCode}
                className={styles.generateButton}
              >
                Сгенерировать коды
              </button>
              {generatedCodes.length > 0 && (
                <button
                  onClick={downloadCodesAsTxt}
                  className={styles.generateButton}
                  style={{ marginTop: "10px" }}
                >
                  Скачать коды в TXT
                </button>
              )}
            </>
          )}
          {id && (
            <button
              className={styles.chooseCard}
              style={{ width: "184px", height: "47px", marginLeft: "10px" }}
              onClick={downloadCodesAsTxt}
            >
              Скачать коды в TXT
            </button>
          )}
        </div>
        {!id && (
          <div className={styles.inputGroup}>
            <div className={styles.rewardItem}>
              <input
                type="checkbox"
                checked={shortInviteCodes}
                onChange={(e) => {
                  setShortInviteCodes(true); // Set short codes to true when checked
                }}
              />
              <h3>Короткие инвайт коды</h3>
            </div>
            <div className={styles.inputGroup}>
              <label>Короткий инвайт код:</label>
              <input
                type="text"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                disabled={!shortInviteCodes}
                placeholder="Введите короткий инвайт код"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p>Многоразовый код</p>
              {!id && (
                <div className={styles.rewardItem}>
                  <input
                    type="checkbox"
                    checked={isMultiUse}
                    onChange={(e) => {
                      setIsMultiUse(e.target.checked);
                      if (e.target.checked) {
                        setIsLimited(false);
                        setShortInviteCodes(true);
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p>Ограниченый код</p>
              {!id && (
                <div
                  className={styles.rewardItem}
                  style={{ marginBottom: "0px" }}
                >
                  <input
                    type="checkbox"
                    checked={isLimited}
                    onChange={(e) => {
                      setIsLimited(e.target.checked);
                      if (e.target.checked) {
                        setIsMultiUse(false);
                        setShortInviteCodes(true);
                      }
                    }}
                  />
                  {!id && (
                    <div
                      className={styles.rewardItem}
                      style={{ marginBottom: "0px" }}
                    >
                      <input
                        type="number"
                        value={codeCount}
                        onChange={(e) => setCodeCount(e.target.value)}
                        min="1"
                        max="1000"
                        disabled={!isLimited}
                        style={{ width: "100px" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <label style={{ marginBottom: "14px" }}>Срок действия:</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        )}
      </div>
      <div>
        {bonusStatus !== null && !bonusStatus && (
          <button
            className={styles.chooseCard}
            style={{ width: "184px", height: "47px" }}
            onClick={handleActivateBonus}
          >
            Активировать бонус
          </button>
        )}
        <button
          className={styles.chooseCard}
          style={{ width: "184px", height: "47px" }}
          onClick={handleSaveCode}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};
export { routeBonusCodeManagement };
export default BonusCodeManagement;
