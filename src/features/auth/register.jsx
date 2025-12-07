import React, { useState } from 'react';
import { registerUser } from './service.js'; 
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setError } from './authSlice.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const AuthRegister = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const error = useSelector((state) => state.auth.error);    

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await registerUser(username, password, email, phone, role);
            dispatch(setMessage(data.message));
            dispatch(setError('')); // לנקות שגיאות קודמות
        } catch (err) {
            dispatch(setError(err.response.data.message));
        }        
    };

    return (
        <div className="container">
            <form onSubmit={handleRegister} className="form">
                <h2>Register</h2>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="text" 
                        placeholder="Phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-control" 
                        type="text" 
                        placeholder="Role" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                    />
                </div>
                <button className="btn btn-primary btn-block" type="submit">
                    Register
                </button>
                {error && <div className="alert alert-danger">{error}</div>}
            </form>
        </div>
    );
};

export default AuthRegister;
