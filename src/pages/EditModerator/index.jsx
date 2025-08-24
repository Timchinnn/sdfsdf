
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../axios-controller';
import styles from './EditModerator.module.css';
const EditModerator = () => {
  const { id } = useParams();
  const history = useHistory();
  const [moderator, setModerator] = useState({
    name: '',
    email: '',
    telegram_login: '',
    description: ''
  });
  useEffect(() => {
    const fetchModerator = async () => {
      try {
        const response = await axios.get(`/moderators/${id}`);
        console.log(response.data)
        setModerator(response.data);
      } catch (error) {
        console.error('Error fetching moderator:', error);
      }
    };
    fetchModerator();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/moderators/${id}`, moderator);
      history.push('/moderators');
    } catch (error) {
      console.error('Error updating moderator:', error);
    }
  };
  return (
    <div className={styles.editModeratorContainer} style={{color: 'black'}}>
      <h2>Редактирование модератора</h2>
      <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
          <label>Имя:</label>
          <input
            type="text"
            value={moderator.moderator.name}
            onChange={(e) => setModerator({...moderator, name: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email" 
            value={moderator.email}
            onChange={(e) => setModerator({...moderator, email: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Telegram логин:</label>
          <input
            type="text"
            value={moderator.telegram_login}
            onChange={(e) => setModerator({...moderator, telegram_login: e.target.value})}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Описание:</label>
          <textarea
            value={moderator.description}
            onChange={(e) => setModerator({...moderator, description: e.target.value})}
          />
        </div>
        {/* Add form fields for editing moderator data */}
        <button type="submit">Сохранить</button>
        <button type="button" onClick={() => history.push('/moderators')}>
          Отмена
        </button>
      </form>
    </div>
  );
};
export default EditModerator;