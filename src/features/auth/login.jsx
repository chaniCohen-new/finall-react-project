import React, { useState } from 'react';
import { loginUser } from './service.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setError, setMessage } from './authSlice.js';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoginIcon from '@mui/icons-material/Login';
import LockIcon from '@mui/icons-material/Lock';

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const error = useSelector((state) => state.auth.error);
  const message = useSelector((state) => state.auth.message);

  // ✅ Validation בצד הקליינט
  const validateLogin = () => {
    if (!username.trim()) {
      dispatch(setError('❌ שם משתמש או אימייל חובה'));
      return false;
    }
    if (!password.trim()) {
      dispatch(setError('❌ סיסמה חובה'));
      return false;
    }
    if (password.length < 3) {
      dispatch(setError('❌ סיסמה לא תקינה'));
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // ✅ בדיקה בצד הקליינט
    if (!validateLogin()) {
      return;
    }

    setLoading(true);
    dispatch(setError(''));
    dispatch(setMessage(''));

    try {
      const data = await loginUser(username, password);
      
      if (!data || !data.token) {
        throw new Error('No token received from server');
      }

      const userString = JSON.stringify(data.user);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', userString);
      dispatch(setToken({ token: data.token, user: userString }));
      dispatch(setMessage('✅ ' + (data.message || 'התחברות בהצלחה!')));

      const userDecoded = jwtDecode(data.token);
      const userRole = userDecoded.role;

      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (userRole === 'user') {
          navigate('/home', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 500);

    } catch (err) {
      setLoading(false);
      
      // ✅ הצגת שגיאה ברורה מהשרת
      let errorMsg = 'התחברות נכשלה';
      
      if (err.response?.status === 401) {
        errorMsg = '❌ שם משתמש או סיסמה לא נכונים';
      } else if (err.response?.data?.message) {
        errorMsg = '❌ ' + err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = '❌ ' + err.response.data.error;
      } else if (err.message) {
        errorMsg = '❌ ' + err.message;
      }
      
      console.error('Login error:', err);
      dispatch(setError(errorMsg));
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          bottom: '-50px',
          left: '-50px',
        },
      }}
    >
      <Container maxWidth="sm">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                animation: 'slideUp 0.6s ease-out',
                '@keyframes slideUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    mb: 2,
                  }}
                >
                  <LoginIcon sx={{ fontSize: '32px', color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ color: '#999' }}>
                  Sign in to your account and continue learning
                </Typography>
              </Box>

              <form onSubmit={handleLogin}>
                {message && (
                  <Alert
                    severity="success"
                    onClose={() => dispatch(setMessage(''))}
                    sx={{ mb: 3, borderRadius: '12px' }}
                  >
                    {message}
                  </Alert>
                )}

                {error && (
                  <Alert
                    severity="error"
                    onClose={() => dispatch(setError(''))}
                    sx={{ mb: 3, borderRadius: '12px' }}
                  >
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Username or Email"
                  placeholder="Enter your username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    dispatch(setError('')); // ✅ נקה שגיאה בעת כתיבה
                  }}
                  disabled={loading}
                  required
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '16px',
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: '#667eea' }}>
                        👤
                      </Box>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    dispatch(setError('')); // ✅ נקה שגיאה בעת כתיבה
                  }}
                  disabled={loading}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '16px',
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: '#667eea' }}>
                        <LockIcon />
                      </Box>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px',
                    py: 1.5,
                    borderRadius: '12px',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    },
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Divider */}
                <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                  <Typography sx={{ mx: 2, color: '#999', fontSize: '14px' }}>
                    or
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                </Box>

                {/* Footer */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      sx={{
                        color: '#667eea',
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    By signing in, you agree to our Terms of Service
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthLogin;