import React, { useState } from "react";
import styles from "./AdminPanel.module.css";
import routeAdmin from "./route";
import { NavLink } from "react-router-dom";
import { routeCardManagement } from "pages/CardManagement";
const AdminPanel = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPassword = "admin123"; // В реальном приложении храните хеш пароля
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
      </div>
    </div>
  );
};
export { routeAdmin };
export default AdminPanel;
