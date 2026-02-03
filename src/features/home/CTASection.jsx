import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Stack,
  } from '@mui/material';
  import { useState } from 'react';
  
  export default function CTASection() {
    const [email, setEmail] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      alert(`נרשמת בהצלחה: ${email}`);
      setEmail('');
    };
  
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 700,
            }}
          >
            התחל את הדרך שלך היום! 🚀
          </Typography>
  
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              mb: 4,
              opacity: 0.9,
              fontSize: '1.1rem',
            }}
          >
            קבל הנחה 20% על הקורס הראשון שלך עם הרשמה לניוזלטר
          </Typography>
  
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                placeholder="הכנס את האימייל שלך"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'white',
                    color: '#667eea',
                    '& fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    opacity: 0.7,
                    color: '#667eea',
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    background: '#f0f0f0',
                  },
                }}
              >
                קבל הנחה 20%
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
    );
  }