import styles from './Moderators.module.css';
import axios from '../../axios-controller';
import React, { useState, useEffect } from 'react';

const Moderators = () => {
  const [moderators, setModerators] = useState([]);
  const [newModerator, setNewModerator] = useState({
    name: '',
    email: '',
    telegram_login: '',
    password: '',
    description: ''
  });
    useEffect(() => {
    const fetchModerators = async () => {
      try {
        const response = await axios.get('/moderators');
        setModerators(response.data);
      } catch (err) {
        console.error('Ошибка при получении списка модераторов:', err);
        alert('Ошибка при получении списка модераторов');
      }
    };
    fetchModerators();
  }, []);
  const handleCreateModerator = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/moderators', newModerator);
      if (response.status === 201) {
        setModerators([...moderators, response.data]);
        setNewModerator({
          name: '',
          email: '',
          telegram_login: '',
          password: '',
          description: ''
        });
      }
    } catch (err) {
      console.error('Ошибка при создании модератора:', err);
      alert('Ошибка при создании модератора');
    }
  };
    const handleDeleteModerator = async (id) => {
    try {
      await axios.delete(`/moderators/${id}`);
      setModerators(moderators.filter(mod => mod.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении модератора:', err);
      alert('Ошибка при удалении модератора');
    }
  };
  const handleEditModerator = (moderator) => {
    setNewModerator({
      name: moderator.name,
      email: moderator.email,
      telegram_login: moderator.telegram_login,
      password: '',
      description: moderator.description || ''
    });
    // You can also add state to track editing mode and moderator ID
  };
  return (
    <div style={{color:'black'}} className={styles.moderatorsContainer}>
      <h2 style={{marginBottom: '20px'}}>Управление модераторами</h2>
      
      <form onSubmit={handleCreateModerator} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Имя:</label>
          <input
          className={styles.inputModer}
            type="text"
            value={newModerator.name}
            onChange={(e) => setNewModerator({...newModerator, name: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
                    className={styles.inputModer}

            type="email"
            value={newModerator.email}
            onChange={(e) => setNewModerator({...newModerator, email: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Telegram логин:</label>
          <input
                    className={styles.inputModer}

            type="text"
            value={newModerator.telegram_login}
            onChange={(e) => setNewModerator({...newModerator, telegram_login: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Пароль:</label>
          <input
          className={styles.passwordModer}
            type="password"
            onChange={(e) => setNewModerator({...newModerator, password: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Описание:</label>
          <textarea
                    className={styles.inputModer}

            value={newModerator.description}
            onChange={(e) => setNewModerator({...newModerator, description: e.target.value})}
          />
        </div>
        <button type="submit" className={styles.submitButtonModer}>
          Создать модератора
        </button>
      </form>
         <div className={styles.moderatorsList}>
        <h3 style={{    marginBottom: '10px'}}>Список модераторов</h3>
        {moderators.map(moderator => (
          <div key={moderator.id} className={styles.moderatorItem}>
            <div className={styles.moderatorInfo}>
              <p><strong>Имя:</strong> {moderator.name}</p>
              <p><strong>Email:</strong> {moderator.email}</p>
              <p><strong>Telegram:</strong> {moderator.telegram_login}</p>
              <p><strong>Описание:</strong> {moderator.description}</p>
            </div>
                    <div className={styles.moderatorActions}>
              <button 
                className={styles.editButton}
                onClick={() => handleEditModerator(moderator)}
              >
                Редактировать
              </button>
              <button
                className={styles.deleteButton} 
                onClick={() => handleDeleteModerator(moderator.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Moderators;