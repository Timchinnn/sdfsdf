import React, { useState, useEffect } from 'react';
import { bonusService } from '../../services/api';
import styles from './BonusManagement.module.css';
import axios from "../../axios-controller";

const BonusManagement = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  // Check permissionss
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
//       } catch (error) {
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
        setBonuses(response.data);
      } catch (error) {
        console.error('Error fetching bonuses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBonuses();
  }, []);
  const handleDeactivate = async (id) => {
    try {
      await bonusService.deactivateBonus(id);
      setBonuses(prevBonuses => 
        prevBonuses.map(bonus => 
          bonus.id === id ? { ...bonus, is_active: false } : bonus
        )
      );
    } catch (error) {
      console.error('Error deactivating bonus:', error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.container} style={{ display: hasEditPermission ? 'block' : 'none' }}>
      <h2>Управление бонусами</h2>
      <div className={styles.bonusList}>
        {bonuses.map(bonus => (
          <div key={bonus.id} className={styles.bonusItem}>
            <div className={styles.bonusInfo}>
              <h3>{bonus.name || 'Без названия'}</h3>
              <p>Статус: {bonus.is_active ? 'Активен' : 'Неактивен'}</p>
              <p>Создан: {new Date(bonus.created_at).toLocaleDateString()}</p>
              {bonus.expires_at && (
                <p>Истекает: {new Date(bonus.expires_at).toLocaleDateString()}</p>
              )}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BonusManagement;