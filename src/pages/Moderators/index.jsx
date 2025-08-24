import React, { useState } from 'react';
import styles from './Moderators.module.css';
import axios from '../../axios-controller';
const Moderators = () => {
  const [moderators, setModerators] = useState([]);
  const [newModerator, setNewModerator] = useState({
    name: '',
    email: '',
    telegram_login: '',
    password: '',
    description: ''
  });
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
            value={newModerator.password}
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
        {moderators.map(moderator => (
          <div key={moderator.id} className={styles.moderatorItem}>
            <h3>{moderator.name}</h3>
            <p>{moderator.email}</p>
            <p>{moderator.telegram_login}</p>
            <p>{moderator.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Moderators;