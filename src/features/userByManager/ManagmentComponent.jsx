import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000/'; // ודא שה-API_URL נכון

const AddUserModal = ({ show, handleClose, refreshUsers }) => {
    const [newUserData, setNewUserData] = useState({ username: '', password: '', email: '', phone: '', role: '' });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddUser = async ({ username, password, email, phone, role }) => {
        const token = localStorage.getItem('token'); // קבל את הטוקן
        console.log(`username: ${username}, password: ${password}, email: ${email}, phone: ${phone}, role: ${role}`);
        try {
            const response = await axios.post(
                `${API_URL}users`,
                { username, password, email, phone, role },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Response:', response.data); // הדפסת התגובה
            alert(response.data.message); // מראה הודעה להצלחה
        } catch (error) {
            console.error('Error:', error); // פרטי השגיאה
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    const handleSubmit = async () => {
        const { username, password, email, phone, role } = newUserData;
        if (!username || !password || !email || !phone || !role) {
            alert('נא למלא את כל השדות.'); // הודעה אם חסרים פרטים
            return;
        }

        try {
            await handleAddUser({ username, password, email, phone, role }); // שליחה של המידע המלא
            handleClose(); // סגירת המודאל
            refreshUsers(); // רענון הרשימה
        } catch (error) {
            setError(error.message); // להציג שגיאה אם יש
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>הוסף משתמש חדש</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="text-danger">{error}</div>}
                <input
                    type="text"
                    name="username"
                    placeholder="שם משתמש"
                    onChange={handleInputChange}
                    className="form-control mb-2"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="סיסמה"
                    onChange={handleInputChange}
                    className="form-control mb-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="אימייל"
                    onChange={handleInputChange}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="טלפון"
                    onChange={handleInputChange}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    name="role"
                    placeholder="תפקיד"
                    onChange={handleInputChange}
                    className="form-control mb-2"
                />
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>סגור</button>
                <button className="btn btn-primary" onClick={handleSubmit}>הוסף משתמש</button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUserModal;