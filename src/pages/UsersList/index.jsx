import React, { useState, useEffect } from "react";
import axios from "../../axios-controller";
import styles from "./UsersList.module.css";
import routeUsersList from "./routes";
import Spinner from "components/Spinner";
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/all-users');
        setUsers(response.data);
        setLoading(false);
        console.log(response.data)
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  if (loading) {
    return <Spinner loading={true} size={50} />;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Users List</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
             <tr>
              <th>ID</th>
              <th>Telegram ID</th>
              <th>Username</th>
              <th>Баланс</th>
              <th>Опыт</th>
              <th>Доход в час</th>
              <th>Уровень</th>
              <th>Рефералы</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.telegram_id}</td>
                <td>{user.username || 'N/A'}</td>
                <td>{user.balance}</td>
                <td>{user.experience || 0}</td>
                <td>{user.hourly_income || 0}</td>
                <td>{user.level || 1}</td>
                <td>{user.referrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export { routeUsersList };
export default UsersList;