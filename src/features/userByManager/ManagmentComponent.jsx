import React, { useEffect, useState } from 'react';
import { fetchUsers, handleAddUser, deleteUser, updateUser } from './service.js'; // ודא שהנתיב נכון
import AddUserModal from './AddUserModal.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate } from 'react-router-dom';

const UserManagementComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // נשתמש במשתנה חדש למי שנבחר לעריכה

    const token = localStorage.getItem('token'); // ודא שה-token מוגדר כאן

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

    const refreshUsers = async () => {
        const usersData = await fetchUsers();
        setUsers(usersData);
    };

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId, token); // העבר את ה-token כאן
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId)); // עדכון המצב
        } catch (error) {
            console.error('שגיאה במחיקת המשתמש:', error.message); // הדפס שגיאה לקונסול
        }
    };

    const handleEdit = (userId) => {
        const userToEdit = users.find(user => user._id === userId); // מצא את המשתמש הנכון
        setSelectedUser(userToEdit); // שמור את המשתמש הנבחר לעריכה
        setShowModal(true); // פתח את המודאל לעריכה
    };



    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mt-4" style={{ direction: 'ltr', textAlign: 'left' }}>
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-center">ניהול משתמשים</h2>
                <button className="btn btn-primary" onClick={() => { setSelectedUser(null); setShowModal(true); }}>הוסף משתמש</button>
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
                            <th className="text-center" style={{ minWidth: '100px' }}>אימייל</th>
                            <th>תפקיד</th>
                            <th className="text-center" style={{ minWidth: '50px' }}>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(user._id)}>✏️ עריכה</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>🗑️ מחיקה</button>
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

            {/* מודאל להזנת פרטי המשתמש החדש או לעדכון */}
            <AddUserModal
                show={showModal}
                handleClose={() => { setShowModal(false); setSelectedUser(null); }}
                refreshUsers={refreshUsers}
                setUsers={setUsers} // הוספת הזו כאן
                userData={selectedUser}
            />
        </div>
    );
};

export default UserManagementComponent;