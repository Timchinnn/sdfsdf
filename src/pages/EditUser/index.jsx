
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../axios-controller';
import styles from './EditUser.module.css';
const EditUser = () => {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/user/${id}`, user);
      history.push('/users-list');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  if (loading) return <div>Загрузка...</div>;
  if (!user) return <div>Пользователь не найден</div>;
  return (
    <div className={styles.container}>
      <h2 style={{color:'black',marginBottom:'12px'}}>Редактирование пользователя</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          <label>Уровень:</label>
          <input
            type="number"
            value={user.level || 1}
            onChange={(e) => setUser({...user, level: Number(e.target.value)})}
          />
        </div>
         <div className={styles.formGroup}>
          <label>Карты пользователя:</label>
          <div className={styles.cardsGrid}>
            {user.cards && user.cards.map((card) => (
              <div key={card.id} className={styles.cardItem}>
                <img 
                  src={`https://api.zoomayor.io${card.image}`}
                  alt={card.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardInfo}>
                  <p>{card.title}</p>
                  <p>Опыт: {card.experience}</p>
                  <p>Доход в час: {card.hourly_income}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
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
      </form>
    </div>
  );
};
export default EditUser;