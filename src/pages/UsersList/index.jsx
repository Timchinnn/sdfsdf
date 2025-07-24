import React, { useState, useEffect } from "react";
import axios from "../../axios-controller";
import styles from "./UsersList.module.css";
import routeUsersList from "./routes";
import Spinner from "components/Spinner";
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('balance');
    const filteredUsers = users.filter(user => 
    user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/all-users');
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
  const handleBan = async (user) => {
    try {
      await axios.put(`/admin/ban-user/${user.telegram_id}`);
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.telegram_id === user.telegram_id
            ? { ...u, ban: !u.ban }
            : u
        )
      );
    } catch (err) {
      console.error('Ошибка при бане пользователя:', err);
      alert('Ошибка при бане пользователя');
    }
  };
  const handleDelete = async (user) => {
    try {
      await axios.put(`/admin/delete-user/${user.telegram_id}`);
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.telegram_id === user.telegram_id
            ? { ...u, deleted: !u.deleted }
            : u
        )
      );
    } catch (err) {
      console.error('Ошибка при удалении пользователя:', err);
      alert('Ошибка при удалении пользователя');
    }
  };
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'created_at') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  return (
    <div style={{background:'white', height:'100vh'}}>
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск по username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
            <div className={styles.tableContainer}> 
        <table className={styles.table}>
          <thead>
            <tr>
<th>ID</th>
              <th>Telegram ID</th>
              <th>Username</th>
              <th onClick={() => handleSort('balance')} className={`${styles.sortableHeader} ${sortField === 'balance' ? styles.active : ''}`}>
                Баланс {sortField === 'balance' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Опыт</th>
              <th onClick={() => handleSort('hourly_income')} className={`${styles.sortableHeader} ${sortField === 'hourly_income' ? styles.active : ''}`}>
                Доход в час {sortField === 'hourly_income' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('level')} className={`${styles.sortableHeader} ${sortField === 'level' ? styles.active : ''}`}>
                Уровень {sortField === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('referrals')} className={`${styles.sortableHeader} ${sortField === 'referrals' ? styles.active : ''}`}>
                Рефералы {sortField === 'referrals' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('created_at')} className={`${styles.sortableHeader} ${sortField === 'created_at' ? styles.active : ''}`}>
                Дата регистрации {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
{sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.telegram_id}</td>
                <td>{user.username || 'N/A'}</td>
                <td>{user.balance}</td>
                <td>{user.experience || 0}</td>
                <td>{user.hourly_income || 0}</td>
                <td>{user.level || 1}</td>
                <td>{user.referrals}</td>
                <td>{new Date(user.created_at).toLocaleString()}
</td>
                <td>
                  <button
                    onClick={() => handleBan(user)}
                    style={{
                      marginRight: '5px',
                      padding: '5px 10px',
                      background: user.ban ? '#666' : '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: user.ban ? 'not-allowed' : 'pointer'
                    }}
                    disabled={user.ban}
                  >
                    {user.ban ? 'Забанен' : 'Бан'}
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    style={{
                      padding: '5px 10px',
                      background: user.deleted ? '#666' : '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: user.deleted ? 'not-allowed' : 'pointer'
                    }}
                    disabled={user.deleted}
                  >
                    {user.deleted ? 'Удален' : 'Удалить'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};
export { routeUsersList };
export default UsersList;