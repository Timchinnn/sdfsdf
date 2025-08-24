
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../axios-controller';
import styles from './EditModerator.module.css';
const EditModerator = () => {
      const [permissions, setPermissions] = useState([]);

  const { id } = useParams();
  const history = useHistory();
  const [moderator, setModerator] = useState({
    name: '',
    email: '',
    telegramLogin: '',
    description: ''
  });
  useEffect(() => {
    const fetchModerator = async () => {
      try {
        const response = await axios.get(`/moderators/${id}`);
        console.log(response.data)
        console.log(response.data.moderator.name)
setModerator(response.data.moderator);
        setPermissions(response.data.permissions);

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
  const handlePermissionChange = async (permissionId, assigned) => {
  try {
    if (assigned) {
      await axios.delete(`/moderators/${id}/permissions/${permissionId}`);
    } else {
      await axios.post(`/moderators/${id}/permissions/${permissionId}`);
    }
    // Обновляем состояние после успешного запроса
    setPermissions(permissions.map(p => 
      p.id === permissionId ? {...p, assigned: !assigned} : p
    ));
  } catch (error) {
    console.error('Error updating permission:', error);
    alert('Ошибка при обновлении прав доступа');
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
            value={moderator.name}
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
            value={moderator.telegramLogin}
            onChange={(e) => setModerator({...moderator, telegramLogin: e.target.value})}
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
        <div className={styles.formGroup}>
    <label>Права доступа:</label>
    <div className={styles.permissionsList}>
      {permissions.map(permission => (
        <div key={permission.id} className={styles.permissionItem}>
<input
  type="checkbox"
  id={`permission-${permission.id}`}
  name={`permission-${permission.id}`}
  checked={permission.assigned}
  onChange={() => handlePermissionChange(permission.id, permission.assigned)}
/>
          <label htmlFor={`permission-${permission.id}`}>
            {permission.name} - {permission.description}
          </label>
        </div>
      ))}
    </div>
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