
import React, { useState, useEffect } from 'react';
import styles from './ReferralSystem.module.css';
import { useSelector } from 'react-redux';
import axios from '../../axios-controller';
const ReferralSystem = () => {
  const [levels, setLevels] = useState([]);
  const [newLevel, setNewLevel] = useState({
    name: '',
    description: '',
    friends_required: 0,
    card_reward: 0,
    coin_reward: 0
  });
  const [translations, setTranslations] = useState({
    title: 'Реферальная система',
    addLevel: 'Добавить уровень',
    editLevel: 'Редактировать уровень',
    deleteLevel: 'Удалить уровень',
    name: 'Название',
    description: 'Описание',
    friendsRequired: 'Требуется друзей',
    cardReward: 'Награда картами',
    coinReward: 'Награда монетами',
    save: 'Сохранить',
    cancel: 'Отмена'
  });
  const language = useSelector((state) => state.language);
  useEffect(() => {
    if (language === 'en') {
      setTranslations({
        title: 'Referral System',
        addLevel: 'Add Level',
        editLevel: 'Edit Level',
        deleteLevel: 'Delete Level',
        name: 'Name',
        description: 'Description',
        friendsRequired: 'Friends Required',
        cardReward: 'Card Reward',
        coinReward: 'Coin Reward',
        save: 'Save',
        cancel: 'Cancel'
      });
    }
  }, [language]);
  useEffect(() => {
    fetchLevels();
  }, []);
  const fetchLevels = async () => {
    try {
      const response = await axios.get('/referral-levels');
      setLevels(response.data);
    } catch (error) {
      console.error('Error fetching referral levels:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/referral-levels', newLevel);
      setNewLevel({
        name: '',
        description: '',
        friends_required: 0,
        card_reward: 0,
        coin_reward: 0
      });
      fetchLevels();
    } catch (error) {
      console.error('Error creating referral level:', error);
    }
  };
  const handleEdit = async (level) => {
  try {
    const updatedLevel = {
      name: level.name,
      description: level.description, 
      friends_required: level.friends_required,
      card_reward: level.card_reward,
      coin_reward: level.coin_reward
    };
    await axios.put(`/api/referral-levels/${level.id}`, updatedLevel);
    fetchLevels();
  } catch (error) {
    console.error('Error editing referral level:', error);
  }
};
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/referral-levels/${id}`);
      fetchLevels();
    } catch (error) {
      console.error('Error deleting referral level:', error);
    }
  };
  return (
    <div className={styles.container}>
      <h2>{translations.title}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>{translations.name}:</label>
          <input
            type="text"
            value={newLevel.name}
            onChange={(e) => setNewLevel({...newLevel, name: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>{translations.description}:</label>
          <textarea
            value={newLevel.description}
            onChange={(e) => setNewLevel({...newLevel, description: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>{translations.friendsRequired}:</label>
          <input
            type="number"
            value={newLevel.friends_required}
            onChange={(e) => setNewLevel({...newLevel, friends_required: Number(e.target.value)})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>{translations.cardReward}:</label>
          <input
            type="number"
            value={newLevel.card_reward}
            onChange={(e) => setNewLevel({...newLevel, card_reward: Number(e.target.value)})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>{translations.coinReward}:</label>
          <input
            type="number"
            value={newLevel.coin_reward}
            onChange={(e) => setNewLevel({...newLevel, coin_reward: Number(e.target.value)})}
            required
          />
        </div>
        <button type="submit">{translations.save}</button>
      </form>
      <div className={styles.levelsList}>
        {levels.map(level => (
          <div key={level.id} className={styles.levelItem}>
            <h3>{level.name}</h3>
            <p>{level.description}</p>
            <p>{translations.friendsRequired}: {level.friends_required}</p>
            <p>{translations.cardReward}: {level.card_reward}</p>
            <p>{translations.coinReward}: {level.coin_reward}</p>
<button onClick={() => handleEdit(level)}>{translations.editLevel}</button>
<button onClick={() => handleDelete(level.id)}>{translations.deleteLevel}</button>          </div>
        ))}
      </div>
    </div>
  );
};
export default ReferralSystem;