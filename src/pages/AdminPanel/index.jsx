import React, { useState, useEffect } from 'react';
import styles from "./AdminPanel.module.css";
import routeAdmin from "./route";
import { NavLink } from "react-router-dom";
import { routeCardManagement } from "pages/CardManagement";
import { routeShopManagement } from "pages/ShopManagement";
import axios from "../../axios-controller";

const AdminPanel = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPassword = "admin123"; // В реальном приложении храните хеш пароля
    const [newCards, setNewCards] = useState([]);

    const [newUsers, setNewUsers] = useState([]);
  useEffect(() => {
    fetchNewUsers();
    fetchNewCards();
  }, []);
  //   useEffect(() => {
  //   const testCreateModerator = async () => {
  //     try {
  //       const testData = {
  //         name: "Test Moderator",
  //         password: "test123",
  //         email: "test@example.com", 
  //         telegram_login: "@testmod",
  //         description: "Test moderator account"
  //       };
  //       const response = await axios.post("/moderators", testData);
        
  //       if (response.status === 201) {
  //         console.log("Test moderator created successfully:", response.data);
  //       }
  //     } catch (err) {
  //       console.error("Error creating test moderator:", err);
  //     }
  //   };
  //   testCreateModerator();
  // }, []);
 const fetchNewUsers = async () => {
    try {
      const response = await axios.get('/admin/new-users');
      setNewUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Ошибка при получении новых пользователей:', error);
    }
  };
    const fetchNewCards = async () => {
    try {
      const response = await axios.get('/admin/new-cards');
      setNewCards(response.data);
            console.log(response.data)

    } catch (error) {
      console.error('Ошибка при получении новых карт:', error);
    }
  };
const handleLogin = async () => {
    try {
      const response = await axios.post('/moderators/login', {
        username: username,
        password: password
      });
      setIsAuthenticated(true);
    } catch (error) {
      alert("Неверный логин или пароль");
    }
  };
  if (!isAuthenticated) {
    return (
   <div className={styles.contents}>
        <div className={styles.loginContainer}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите логин"
            className={styles.loginAdminInput}
          />
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
          <p>Новые пользователи за последние 24 часа ({newUsers.length})</p>

        </div>
      </div>
             <div className={styles.mainContent}>
          <div className={styles.content}>
            <p>Открытые карты за последние 24 часа ({newCards.length})</p>

          </div>
        </div>
                <div className={styles.mainContent}>
          <NavLink to="/users-list">
            <div className={styles.content}>
              <p>Список пользователей</p>
            </div>
          </NavLink>
        </div>
                        <div className={styles.mainContent}>
          <NavLink to="/adsmanagement">
            <div className={styles.content}>
              <p>Управление рекламой</p>
            </div>
          </NavLink>
        </div>
          <div className={styles.mainContent}>
          <NavLink to="/referral-system">
            <div className={styles.content}>
              <p>Реферальная система</p>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export { routeAdmin };
export default AdminPanel;
