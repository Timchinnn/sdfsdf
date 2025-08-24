import styles from './Moderators.module.css';
import axios from '../../axios-controller';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Moderators = () => {
    const history = useHistory();

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
  const handleEdit = (moderatorId) => {
    history.push(`/edit-moderator/${moderatorId}`);
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
            <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Telegram</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {moderators.map((moderator) => (
                <tr key={moderator.id}>
                  <td>{moderator.id}</td>
                  <td>{moderator.name}</td>
                  <td>{moderator.email}</td>
                  <td>{moderator.telegram_login}</td>
                  <td>{moderator.description}</td>
                  <td style={{    display: 'flex',
    flexDirection: 'column',
    width: '140px'}}>
                    <button 
                      onClick={() => handleDeleteModerator(moderator.id)}
                      className={styles.deleteButton}
                      style={{marginBottom:'10px'}}
                    >
                      Удалить
                    </button>
                                       <button
                  onClick={() => handleEdit(moderator.id)}
                       className={styles.editButton}
                     >
                       Редактировать
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};
export default Moderators;