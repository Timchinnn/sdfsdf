import React, { useState, useEffect } from "react";
import styles from "./ShopManagement.module.css";
import routeShopManagement from "./route";
const ShopManagement = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    // Fetch shop items
    const fetchItems = async () => {
      try {
        // Add API call here
        // const response = await shopService.getItems();
        // setItems(response.data);
      } catch (error) {
        console.error("Error fetching shop items:", error);
      }
    };
    fetchItems();
  }, []);
  return (
    <div className={styles.container}>
      <h2>Управление содержимым магазина</h2>
      <div className={styles.content}>
        <button className={styles.addButton}>Добавить товар</button>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <img src={item.image} alt={item.title} />
              <div className={styles.itemInfo}>
                <h3>{item.title}</h3>
                <p>{item.price} монет</p>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.editButton}>Редактировать</button>
                <button className={styles.deleteButton}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export { routeShopManagement };
export default ShopManagement;
