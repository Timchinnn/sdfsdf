
import React, { useState, useEffect } from 'react';
import styles from './ReferralSystem.module.css';
import { useSelector } from 'react-redux';
import axios from '../../axios-controller';
import left from "assets/img/left.png";
import right from "assets/img/right.png";
const ReferralSystem = () => {
const [levels, setLevels] = useState([]);
const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);

  const [cards, setCards] = useState([]); // Добавляем состояние для карт
  const [newLevel, setNewLevel] = useState({
    name: '',
    description: '',
    friends_required: 0,
    card_reward: 0,
    coin_reward: 0
  });
  const [editingLevel, setEditingLevel] = useState(null);
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
    fetchCards(); // Добавляем загрузку карт
  }, []);
  const fetchCards = async () => {
    try {
      const response = await axios.get('/cards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };
 
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
const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = {
        ...editingLevel,
        card_reward: editingLevel.card_id // Use card_id instead of card_reward
      };
      await axios.put(`/referral-levels/${editingLevel.id}`, dataToUpdate);
      setEditingLevel(null);
      fetchLevels();
    } catch (error) {
      console.error('Error updating referral level:', error);
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
  const startEditing = (level) => {
    setEditingLevel({...level});
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
            {editingLevel && editingLevel.id === level.id ? (
<form onSubmit={handleEdit} className={styles.editForm}>
  <div className={styles.formGroup}>
    <label>{translations.name}:</label>
    <input 
      type="text"
      value={editingLevel.name}
      onChange={(e) => setEditingLevel({...editingLevel, name: e.target.value})}
      required
      placeholder={translations.name}
    />
  </div>
  <div className={styles.formGroup}>
    <label>{translations.description}:</label>
    <textarea
      value={editingLevel.description}
      onChange={(e) => setEditingLevel({...editingLevel, description: e.target.value})}
      required
      placeholder={translations.description}
    />
  </div>
  <div className={styles.formGroup}>
    <label>{translations.friendsRequired}:</label>
    <input
      type="number"
      value={editingLevel.friends_required}
      onChange={(e) => setEditingLevel({...editingLevel, friends_required: Number(e.target.value)})}
      required
    />
  </div>
<div className={styles.cardSelection}>
                  <h4>Выюери карту:</h4>
 
                  <div className={styles.cardGrid}>
                    <img
                      src={left}
                      className={styles.arrow}
                      onClick={() => {
                        if (currentAvailableIndex > 0) {
                          setCurrentAvailableIndex(currentAvailableIndex - 1);
                        }
                      }}
                      alt="Previous"
                    />
                    {cards.slice(currentAvailableIndex, currentAvailableIndex + 5).map(card => (
                      <div 
                        key={card.id}
                        className={`${styles.cardItem} ${editingLevel.card_id === card.id ? styles.selected : ''}`}
                        onClick={() => setEditingLevel({...editingLevel, card_id: card.id})}
                      >
                        <img 
                          src={`https://api.zoomayor.io${card.image}`}
                          alt={card.title}
                          className={styles.cardImage}
                        />
                        <p>{card.title}</p>
                      </div>
                    ))}
                    <img
                      src={right} 
                      className={styles.arrow}
                      onClick={() => {
                        if (currentAvailableIndex < cards.length - 5) {
                          setCurrentAvailableIndex(currentAvailableIndex + 1);
                        }
                      }}
                      alt="Next"
                    />
                  </div>
                </div>
  <div className={styles.formGroup}>
    <label>{translations.coinReward}:</label>
    <input
      type="number"
      value={editingLevel.coin_reward}
      onChange={(e) => setEditingLevel({...editingLevel, coin_reward: Number(e.target.value)})}
      required
    />
  </div>
  <div className={styles.buttonGroup}>
    <button type="submit" className={styles.saveButton}>{translations.save}</button>
    <button type="button" onClick={() => setEditingLevel(null)} className={styles.cancelButton}>
      {translations.cancel}
    </button>
  </div>
</form>
  
            ) : (
              <>
                <h3>{level.name}</h3>
                <p>{level.description}</p>
                <p>{translations.friendsRequired}: {level.friends_required}</p>
                <p>{translations.cardReward}: {level.card_reward}</p>
                <p>{translations.coinReward}: {level.coin_reward}</p>
                <button onClick={() => startEditing(level)}>{translations.editLevel}</button>
                <button onClick={() => handleDelete(level.id)}>{translations.deleteLevel}</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReferralSystem;