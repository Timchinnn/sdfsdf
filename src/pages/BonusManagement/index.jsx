import React, { useState, useEffect } from "react";
import { bonusService } from "../../services/api";
import styles from "./BonusManagement.module.css";
import axios from "../../axios-controller";
import { routeBonusCodeManagement } from "pages/BonusCodeManagement";
import { NavLink } from "react-router-dom";

const BonusManagement = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const [cardNames, setCardNames] = useState({});
  // Add function to fetch card name
  const getCardName = async (cardId) => {
    try {
      const response = await axios.get(`/cards/${cardId}`);
      setCardNames((prev) => ({ ...prev, [cardId]: response.data.title }));
    } catch (err) {
      console.error("Error fetching card name:", err);
      return cardId;
    }
  };
  // Check permissionssыc
  //   useEffect(() => {
  //     const checkPermissions = async () => {
  //       try {
  //         const adminUsername = localStorage.getItem('adminUsername');
  //         if (adminUsername) {
  //           const response = await axios.get(`/moderators/permissions/${adminUsername}`);
  //           setHasEditPermission(response.data.permissions.some(
  //             p => p.permission_name === 'Добавление и редактирование бонусов'
  //           ));
  //         }
  //       } catch (error) {e
  //         console.error("Error checking permissions:", error);
  //       }
  //     };
  //     checkPermissions();
  //   }, []);
  // Fetch bonuses
  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const response = await bonusService.getAllBonuses();
        console.log(response.data);
        setBonuses(response.data);
      } catch (error) {
        console.error("Error fetching bonuses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBonuses();
  }, []);
  const handleActivate = async (id) => {
    try {
      await bonusService.activateBonus(id);
      setBonuses((prevBonuses) =>
        prevBonuses.map((bonus) =>
          bonus.id === id ? { ...bonus, is_active: true } : bonus
        )
      );
    } catch (error) {
      console.error("Error activating bonus:", error);
    }
  };
  const handleDeactivate = async (id) => {
    try {
      await bonusService.deactivateBonus(id);
      setBonuses((prevBonuses) =>
        prevBonuses.map((bonus) =>
          bonus.id === id ? { ...bonus, is_active: false } : bonus
        )
      );
    } catch (error) {
      console.error("Error deactivating bonus:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await bonusService.deleteBonus(id);
      setBonuses(bonuses.filter((bonus) => bonus.id !== id));
    } catch (error) {
      console.error("Error deleting bonus:", error);
    }
  };
  useEffect(() => {
    bonuses.forEach((bonus) => {
      if (bonus.rewards) {
        try {
          const reward = JSON.parse(bonus.rewards[0]);
          if (reward.cardId && !cardNames[reward.cardId]) {
            getCardName(reward.cardId);
          }
        } catch (e) {
          console.error("Error parsing reward:", e);
        }
      }
    });
  }, [bonuses, cardNames]);
  if (loading) {
    return <div>Loadinsаg...</div>;
  }
  return (
    <div
      className={styles.container}
      style={{ display: hasEditPermission ? "block" : "none" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Управление бонусами</h2>
        <NavLink
          to="/bonus-code-management"
          style={{ marginBottom: "20px", display: "block" }}
        >
          <button
            className={styles.editButton}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            Создать бонус
          </button>
        </NavLink>
      </div>

      <div className={styles.bonusList}>
        {bonuses.map((bonus) => (
          <div key={bonus.id} className={styles.bonusItem}>
            <div className={styles.bonusInfo}>
              <div>
                {" "}
                <h3>{bonus.name || "Без названия"}</h3>
                <p>Статус: {bonus.is_active ? "Активен" : "Неактивен"}</p>
                {bonus.expires_at && (
                  <p>
                    Истекает: {new Date(bonus.expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className={styles.borderDesc}>
                <p>Описание: </p>
                <p>{bonus.description || "Без описания"}</p>
                <p>Создан:</p>
                <p>{new Date(bonus.created_at).toLocaleDateString()}</p>
                {bonus.start_date && bonus.end_date && (
                  <>
                    <p>Длительность:</p>
                    <p>
                      {Math.ceil(
                        (new Date(bonus.end_date) -
                          new Date(bonus.start_date)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      дней
                    </p>
                  </>
                )}
                {bonus.rewards &&
                  bonus.rewards[0] &&
                  (() => {
                    try {
                      const reward = JSON.parse(bonus.rewards[0]);
                      return (
                        <div>
                          <p>Награды:</p>
                          {reward.coins > 0 && <p>Монеты: {reward.coins}</p>}
                          {reward.experience > 0 && (
                            <p>Опыт: {reward.experience}</p>
                          )}
                          {reward.energy > 0 && <p>Энергия: {reward.energy}</p>}
                          {reward.cardId && (
                            <p>
                              Карта: {cardNames[reward.cardId] || "Загрузка..."}
                            </p>
                          )}
                        </div>
                      );
                    } catch (e) {
                      console.error("Error parsing reward:", e);
                      return null;
                    }
                  })()}
              </div>
              <div className={styles.borderDesc}>
                <p>Заметки: </p>
                <p>{bonus.note || "Без заметок"}</p>
              </div>
            </div>
            <div style={{ color: "black", marginBottom: "10px" }}>
              <p>Количество инвайт кодов</p>
              <p>
                {bonus.total_codes || 0}/{bonus.used_codes || 0}/
                {bonus.unused_codes || 0}{" "}
              </p>
              <p>создано/использовано/осталось</p>
            </div>
            <div className={styles.bonusActions}>
              {bonus.is_active && (
                <button
                  onClick={() => handleDeactivate(bonus.id)}
                  className={styles.deactivateButton}
                >
                  Деактивировать
                </button>
              )}
              <button
                onClick={() => handleDelete(bonus.id)}
                className={styles.deleteButton}
                style={{ marginLeft: "8px" }}
              >
                Удалить
              </button>
              <NavLink to={routeBonusCodeManagement(bonus.id)}>
                <button
                  className={styles.editButton}
                  style={{ marginLeft: "8px" }}
                >
                  Редактировать
                </button>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BonusManagement;
