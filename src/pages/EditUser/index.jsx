
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../axios-controller';
import styles from './EditUser.module.css';
import left from "assets/img/left.png";
import right from "assets/img/right.png";
const EditUser = () => {
  const { id, userId } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortBy, setSortBy] = useState("none");
    const [userActions, setUserActions] = useState([]);


useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/user/${id}`);
        console.log(response.data)
        setUser(response.data);
        
        // Получаем уровень пользователя
        const levelResponse = await axios.get(`/user/${id}/level`);
        if (levelResponse.data && levelResponse.data.level) {
          setUser(prev => ({...prev, level: levelResponse.data.level}));
        }
        // Получаем карты пользователя
        const cardsResponse = await axios.get(`/user/${id}/cards`);
        if (cardsResponse.data) {
          setUser(prev => ({...prev, cards: cardsResponse.data}));
        }
        // Получаем рефералов пользователя
        const referralsResponse = await axios.get(`/user/${id}/referrals`);
        console.log(referralsResponse)
        if (referralsResponse.data && referralsResponse.data.referrals) {
          setUser(prev => ({
            ...prev, 
            referral_users: referralsResponse.data.referrals,
            referrals: referralsResponse.data.referrals.length
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);
    useEffect(() => {
    const fetchUserActions = async () => {
      try {
        const response = await axios.get(`/user-actions/${userId}`);
        setUserActions(response.data);
        console.log(response.data)
        console.log(id)
      } catch (error) {
        console.error('Ошибка при получении действий пользователя:', error);
      }
    };
    fetchUserActions();
  }, [id]);
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Update user experience if changed
    if (user.experience !== undefined) {
      await axios.put(`/user/${id}/experience`, {
        experience: Number(user.experience)
      });
    }
    // Update user balance if changed
    if (user.coins !== undefined) {
      await axios.put(`/user/${id}/balance`, {
        balance: Number(user.coins)
      });
    }
    // Update user chance range if changedв
    if (user.min_chance !== undefined && user.max_chance !== undefined) {
      await axios.put(`/user/${id}/chance`, {
        min_chance: Number(user.min_chance),
        max_chance: Number(user.max_chance)
      });
    }
    history.push('/users-list');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
if (loading) return <div>Загрузка...</div>;
  if (!user) return <div>Пользователь не найден</div>;
  const sortCards = (cards) => {
    if (sortBy === "none") return cards;
    
    return [...cards].sort((a, b) => {
      if (sortBy === "price") {
        return a.price - b.price;
      } else if (sortBy === "rarity") {
        return a.rarity - b.rarity;
      }
      return 0;
    });
  };
  return (
    <div className={styles.container}>
      <h2 style={{color:'black',marginBottom:'30px'}}>Редактирование пользователя</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
      <div style={{display:'flex',flexDirection:'column'}}>
        <div className={styles.formGroup}>
          <label>Username:</label>
          <input
            type="text"
            value={user.username || ''}
            onChange={(e) => setUser({...user, username: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Баланс:</label>
          <input
            type="number"
            value={user.coins || 0}
            onChange={(e) => setUser({...user, balance: Number(e.target.value)})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Опыт:</label>
          <input
            type="number"
            value={user.experience || 0}
            onChange={(e) => setUser({...user, experience: Number(e.target.value)})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Доходность в час:</label>
          <input
            type="number"
            value={user.hourly_income || 0}
            onChange={(e) => setUser({...user, hourly_income: Number(e.target.value)})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Общее количество карт:</label>
           <input 
            type="number"
            value={user?.cards?.filter(card => 
              !card.title.match(/^Бонус \d+/) && 
              card.type !== "energy_boost"
            ).length || 0}
            onChange={(e) => setUser({...user, experience: Number(e.target.value)})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Уровень:</label>
          <input
            type="number"
            value={user.level || 1}
            onChange={(e) => setUser({...user, level: Number(e.target.value)})}
          />
        </div>
        </div>
           <div className={styles.formGroup}>
          <label>Минимальный шанс:</label>
          <input
            type="number"
            value={user.min_chance || ''}
            onChange={(e) => {
              const value = Math.max(0, Math.min(parseFloat(e.target.value) || 0, 100));
              setUser({...user, min_chance: value})
            }}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Максимальный шанс:</label>
          <input
            type="number" 
            value={user.max_chance || ''}
            onChange={(e) => {
              const value = Math.max(0, Math.min(parseFloat(e.target.value) || 0, 100));
              setUser({...user, max_chance: value})
            }}
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      <div className={styles.formGroup}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск по названию карты"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="none">Без сортировки</option>
            <option value="price">По цене</option>
            <option value="rarity">По редкости</option>
          </select>
        </div>
          <label>Карты пользователя:</label>
       <div className={styles.mainContent}>
            <img
              src={left}
              className={styles.arrow}
              onClick={() => currentPage > 0 && setCurrentPage(prev => prev - 1)}
              alt="Previous"
            />
{sortCards(user?.cards?.filter((card, index, self) => 
  index === self.findIndex((c) => c.id === card.id) && 
  card.type !== "energy_boost" &&
  !card.title.match(/^Бонус \d+/) &&
  card.title.toLowerCase().includes(searchQuery.toLowerCase())
)).slice(currentPage * 5, (currentPage + 1) * 5)
            .map((card) => (
              <div key={card.id} className={styles.cardItem}>
                <div className={styles.cardItemImg}>
                  <img
                    src={`https://api.zoomayor.io${card.image}`}
                    alt={card.title}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3 style={{color:'black'}}>{card.title}</h3>
                </div>
              </div>
            ))}
            <img
              src={right}
              className={styles.arrow}
              onClick={() => {
                const uniqueCards = user?.cards?.filter((card, index, self) => 
                  index === self.findIndex((c) => c.id === card.id)
                );
                if (currentPage < Math.ceil(uniqueCards.length / 5) - 1) {
                  setCurrentPage(prev => prev + 1);
                }
              }}
              alt="Next"
            />
          </div>
       </div>

  
            </form>         
      <div className={styles.formGroup}>
        <label>Общее количество рефералов:</label>
        <input
          type="number" 
          value={user?.referrals || 0}
          readOnly
        />
      </div>
      <div className={styles.formGroup} style={{color:'black'}}>
        <label>Список рефералов:</label>
        <table className={styles.referralsTable}>
          <thead>
            <tr>
              <th>Никнейм</th>
              <th>Дата приглашения</th>
              <th>Уровень</th>
            </tr>
          </thead>
          <tbody>
            {user?.referral_users?.map((referral) => (
              <tr key={referral.id}>
                <td>{referral.username}</td>
                <td>{new Date(referral.registered_via_referral_date).toLocaleDateString()}</td>
                <td>{referral.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>         <div className={styles.formGroup}>
          <label>Последние действия пользователя:</label>
  <div className={styles.actionsList}>
            <table className={styles.actionsTable}>
              <thead>
                <tr style={{color:'black'}}>
                  <th>Дата</th>
                  <th>Действие</th>
                                    <th>Награда</th>

                  <th>Детали</th>
                </tr>
              </thead>
              <tbody>
  {userActions.map((action, index) => {
                  // Маппинг типов действий на русский язык
                  const actionTypeMap = {
                    'ad_reward_claimed': 'Получена награда за рекламу',
                    'bonus_code_activated': 'Активирован бонус-код',
                    'card_opened': 'Открыта карточка'
                  };
                  // Форматирование даты
                  const date = new Date(action.created_at);
                  const formattedDate = date.toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
let details = '-';
let rewards = [];
if (action.reward_data) {
  if (action.action_type === 'card_opened') {
    details = `Карта: ${action.reward_data.card_title}`;
    if (action.reward_data.reward_value) {
      rewards.push(`${action.reward_data.reward_value} монет`);
    }
    if (action.reward_data.reward_experience) {
      rewards.push(`${action.reward_data.reward_experience} опыта`);
    }
    if (action.reward_data.reward_energy) {
      rewards.push(`${action.reward_data.reward_energy} энергии`);
    }
  } else if (action.action_type === 'bonus_code_activated') {
    details = 'Активирован бонус-код';
    if (action.reward_data.reward_value) {
      rewards.push(`${action.reward_data.reward_value} монет`);
    }
  } else {
    if (action.reward_data.reward_value) rewards.push(`${action.reward_data.reward_value} монет`);
    if (action.reward_data.reward_experience) rewards.push(`${action.reward_data.reward_experience} опыта`);
    if (action.reward_data.reward_energy) rewards.push(`${action.reward_data.reward_energy} энергии`);
  }
}
                  return (
                    <tr key={index}>
                    <td>{formattedDate}</td>
                      <td>{actionTypeMap[action.action_type] || action.action_type}</td>
<td>{rewards.join(', ') || '-'}</td>
                      <td>{details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
  
        </div>       <div className={styles.buttonGroup}>
         <button type="submit" className={styles.saveButton} onClick={handleSubmit}>
            Сохранить
          </button>
          <button 
            type="button" 
            onClick={() => history.push('/users-list')}
            className={styles.cancelButton}
          >
            Отмена
          </button>
        </div>
    </div>
  );
};
export default EditUser;