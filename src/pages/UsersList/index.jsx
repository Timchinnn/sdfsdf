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
        const response = await axios.get('/api/admin/all-users');
        setUsers(response.data);
        setLoading(false);
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
              <th>Last Active</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.telegram_id}</td>
                <td>{user.username || 'N/A'}</td>
                <td>{new Date(user.last_active).toLocaleString()}</td>
                <td>
                  <span className={`${styles.status} ${styles[user.status]}`}>
                    {user.status}
                  </span>
                </td>
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