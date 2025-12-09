import React, { useEffect, useState } from 'react';
import { fetchUsers } from './service.js'; // יש לוודא שהנתיב נכון
import 'bootstrap/dist/css/bootstrap.min.css';

const UserManagementComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData); // עדכון מצב המשתמשים
            } catch (err) {
                setError('שגיאה בטעינת משתמשים'); // עדכון מצב השגיאה
            } finally {
                setLoading(false); // סיום הטעינה
            }
        };

        loadUsers(); // קריאה לפונקציה
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mt-4" style={{ direction: 'ltr', textAlign: 'left' }}>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2>ניהול משתמשים</h2>
                <button className="btn btn-primary">הוסף משתמש</button>
            </header>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="חפש משתמשים..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {loading && <div>טוען...</div>}
            {error && <div className="text-danger">{error}</div>}

            <div className="table-responsive mb-4">
                <table className="table table-striped table-bordered shadow">
                    <thead className="thead-dark">
                        <tr>
                            <th>שם משתמש</th>
                            <th>אימייל</th>
                            <th>תפקיד</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm mr-2">✏️ עריכה</button>
                                        <button className="btn btn-danger btn-sm">🗑️ מחיקה</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">לא נמצאו משתמשים</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementComponent;
