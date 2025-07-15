import React, { useState, useEffect } from 'react';
import styles from "./AdminPanel.module.css";
import routeAdmin from "./route";
import { NavLink } from "react-router-dom";
import { routeCardManagement } from "pages/CardManagement";
import { routeShopManagement } from "pages/ShopManagement";
import axios from "../../axios-controller";

const AdminPanel = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPassword = "admin123"; // В реальном приложении храните хеш пароляd
    const [newUsers, setNewUsers] = useState([]);
      useEffect(() => {
    fetchNewUsers();
  }, []);
 const fetchNewUsers = async () => {
    try {
      const response = await axios.get('/admin/new-users');
      setNewUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Ошибка при получении новых пользователей:', error);
    }
  };
  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Неверный пароль");
    }
  };
  if (!isAuthenticated) {
    return (
      <div className={styles.contents}>
        <div className={styles.loginContainer}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            className={styles.passwordInput}
          />
          <button onClick={handleLogin} className={styles.loginButton}>
            Войти
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.contents}>
      <div className={styles.mainContents}>
        <div className={styles.mainContent}>
          <NavLink to={routeCardManagement()}>
            <div className={styles.content}>
              <p>Добавление/редактирование карт жители/город и наборов</p>
            </div>
          </NavLink>
        </div>
        <div className={styles.mainContent}>
          <NavLink to={routeShopManagement()}>
            <div className={styles.content}>
              <p>Добавление/редактирование содержимого магазина</p>
            </div>
          </NavLink>
        </div>
    <div className={styles.mainContent}>
        <div className={styles.content}>
          <h2>Новые пользователи за последние 24 часа ({newUsers.length})</h2>
          {newUsers.length > 0 ? (
            <ul>
              {newUsers.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          ) : (
            <p>Новых пользователей нет</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
export { routeAdmin };
export default AdminPanel;
