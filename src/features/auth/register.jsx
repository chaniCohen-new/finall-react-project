import React, { useState } from 'react';
import { registerUser } from './service.js';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setError } from './authSlice.js';
import { useNavigate } from 'react-router-dom';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AuthRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const error = useSelector((state) => state.auth.error);
  const message = useSelector((state) => state.auth.message);

  // ✅ בדיקת עוצמת סיסמה
  const checkPasswordStrength = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push('לפחות 8 תווים');
    if (!/[A-Z]/.test(pwd)) errors.push('אות גדולה אחת');
    if (!/[a-z]/.test(pwd)) errors.push('אות קטנה אחת');
    if (!/[0-9]/.test(pwd)) errors.push('ספרה אחת');
    if (!/[!@#$%^&*]/.test(pwd)) errors.push('תו מיוחד (!@#$%^&*)');
    return errors;
  };

  // ✅ Validation בצד הקליינט
  const validateRegister = () => {
    if (!username.trim()) {
      dispatch(setError('❌ שם משתמש חובה'));
      return false;
    }

    if (username.length < 3) {
      dispatch(setError('❌ שם משתמש חייב להיות לפחות 3 תווים'));
      return false;
    }

    if (!email.trim()) {
      dispatch(setError('❌ אימייל חובה'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(setError('❌ אימייל לא תקין'));
      return false;
    }

    if (!password.trim()) {
      dispatch(setError('❌ סיסמה חובה'));
      return false;
    }

    // ✅ בדיקת דרישות סיסמה
    const pwdErrors = checkPasswordStrength(password);
    if (pwdErrors.length > 0) {
      setPasswordErrors(pwdErrors);
      dispatch(setError('❌ סיסמה חלשה - ראה דרישות'));
      return false;
    }

    if (password !== confirmPassword) {
      dispatch(setError('❌ הסיסמאות לא תואמות'));
      setPasswordErrors([]);
      return false;
    }

    if (phone && phone.length < 9) {
      dispatch(setError('❌ מספר טלפון לא תקין'));
      return false;
    }

    setPasswordErrors([]);
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateRegister()) {
      return;
    }

    setLoading(true);
    dispatch(setError(''));
    dispatch(setMessage(''));

    try {
      const data = await registerUser(username, password, email, phone, role);

      dispatch(setMessage('✅ ' + (data.message || 'הרשמה בהצלחה!')));
      dispatch(setError(''));
      setPasswordErrors([]);

      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      setPhone('');
      setRole('user');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);

    } catch (err) {
      setLoading(false);

      let errorMsg = 'הרשמה נכשלה';
      let pwdErrors = [];

      // ✅ טיפול בשגיאות סיסמה מהשרת
      if (err.response?.data?.passwordErrors) {
        pwdErrors = err.response.data.passwordErrors;
        setPasswordErrors(pwdErrors);
        errorMsg = '❌ ' + (err.response.data.message || 'סיסמה חלשה');
      } else if (err.response?.status === 409) {
        errorMsg = '❌ משתמש או אימייל כבר קיימים';
        setPasswordErrors([]);
      } else if (err.response?.data?.message) {
        errorMsg = '❌ ' + err.response.data.message;
        setPasswordErrors([]);
      } else if (err.message) {
        errorMsg = '❌ ' + err.message;
        setPasswordErrors([]);
      }

      console.error('Register error:', err);
      dispatch(setError(errorMsg));
    }
  };

  // ✅ בדיקה בזמן אמת של סיסמה
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);

    if (pwd.trim()) {
      const errors = checkPasswordStrength(pwd);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }

    dispatch(setError(''));
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    mb: 2,
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: '32px', color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Create Account
                </Typography>
                <Typography variant="body1" sx={{ color: '#999' }}>
                  Join thousands learning English
                </Typography>
              </Box>

              <form onSubmit={handleRegister}>
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
                  label="Username"
                  placeholder="Choose a username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    dispatch(setError(''));
                  }}
                  disabled={loading}
                  required
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#f5576c',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    dispatch(setError(''));
                  }}
                  disabled={loading}
                  required
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#f5576c',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                    },
                  }}
                />

                {/* ✅ Password Field עם בדיקה בזמן אמת */}
                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Create a strong password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  required
                  error={passwordErrors.length > 0}
                  helperText={
                    passwordErrors.length > 0
                      ? `❌ ${passwordErrors.length} דרישה לא בעמידה`
                      : password.length > 0
                      ? '✅ סיסמה עומדת בדרישות'
                      : ''
                  }
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#f5576c',
                      },
                      borderColor:
                        passwordErrors.length > 0
                          ? '#d32f2f'
                          : password.length > 0
                          ? '#4caf50'
                          : undefined,
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                    },
                  }}
                />

                {/* ✅ רשימת דרישות סיסמה */}
                {password.length > 0 && (
                  <Box
                    sx={{
                      mb: 2.5,
                      p: 1.5,
                      background: '#f5f5f5',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', mb: 1 }}>
                      📋 דרישות:
                    </Typography>
                    <List sx={{ py: 0 }}>
                      {[
                        { test: password.length >= 8, label: '8 תווים' },
                        { test: /[A-Z]/.test(password), label: 'אות גדולה (A-Z)' },
                        { test: /[a-z]/.test(password), label: 'אות קטנה (a-z)' },
                        { test: /[0-9]/.test(password), label: 'ספרה (0-9)' },
                        { test: /[!@#$%^&*]/.test(password), label: 'תו מיוחד (!@#$%^&*)' },
                      ].map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0.3, px: 0, display: 'flex', gap: 1 }}>
                          <ListItemIcon sx={{ minWidth: 'auto' }}>
                            {item.test ? (
                              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '18px' }} />
                            ) : (
                              <CancelIcon sx={{ color: '#d32f2f', fontSize: '18px' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={item.label} sx={{ my: 0 }} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    dispatch(setError(''));
                  }}
                  disabled={loading}
                  required
                  error={confirmPassword.length > 0 && password !== confirmPassword}
                  helperText={
                    confirmPassword.length > 0 && password !== confirmPassword
                      ? '❌ הסיסמאות לא תואמות'
                      : confirmPassword.length > 0 && password === confirmPassword
                      ? '✅ הסיסמאות תואמות'
                      : ''
                  }
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#f5576c',
                      },
                      borderColor:
                        confirmPassword.length > 0 && password !== confirmPassword
                          ? '#d32f2f'
                          : confirmPassword.length > 0 && password === confirmPassword
                          ? '#4caf50'
                          : undefined,
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone (Optional)"
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    dispatch(setError(''));
                  }}
                  disabled={loading}
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#f5576c',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                    },
                  }}
                />

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  disabled={loading || passwordErrors.length > 0}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px',
                    py: 1.5,
                    borderRadius: '12px',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(245, 87, 108, 0.4)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    },
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
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
                    Already have an account?{' '}
                    <Link
                      href="/"
                      sx={{
                        color: '#f5576c',
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    By signing up, you agree to our Terms of Service
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

export default AuthRegister;