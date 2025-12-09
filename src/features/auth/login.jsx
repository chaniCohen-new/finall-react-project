import React, { useState } from 'react';
import { loginUser } from './service.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setError, setMessage } from './authSlice.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuthLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const error = useSelector((state) => state.auth.error);    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(username, password);
            localStorage.setItem('token', data.token);
            dispatch(setToken({ token: data.token, user: data.user }));
            dispatch(setMessage(data.message));
            
            navigate('../users');
        } catch (err) {
            dispatch(setError(err.response ? err.response.data.message : 'Login failed'));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <form onSubmit={handleLogin} className="shadow p-4 rounded bg-light">
                        <h2 className="text-center">Login</h2>
                        <div className="form-group mb-3">
                            <input 
                                className="form-control" 
                                type="text" 
                                placeholder="Username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button className="btn btn-primary btn-block" type="submit">
                            Login
                        </button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        <div className="text-center mt-3">
                            <span>Don't have an account? </span>
                            <a href="/register">Sign Up</a> {/* קישור להרשמה */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthLogin;
