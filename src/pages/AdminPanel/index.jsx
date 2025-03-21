import React from "react";
import styles from "./AdminPanel.module.css";
import routeAdmin from "./route";
import { NavLink } from "react-router-dom";
import { routeCardManagement } from "pages/CardManagement";
const AdminPanel = () => {
  return (
    <div className={styles.contents}>
      <div className={styles.mainContents}>
        <div className={styles.mainContent}>
          <NavLink to={routeCardManagement()}>
            <div className={styles.content}>
              <p>Добавление/редактирование карт жители/город и наборов </p>
            </div>
          </NavLink>
        </div>
        <div className={styles.mainContent}></div>
        <div className={styles.mainContent}></div>
        <div className={styles.mainContent}></div>
      </div>
    </div>
  );
};
export { routeAdmin };

export default AdminPanel;
