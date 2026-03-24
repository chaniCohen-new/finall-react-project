import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const LevelSelection = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const levels = [
    {
      id: 1,
      title: 'רמה 1',
      subtitle: 'מתחיל',
      description: 'בחר רמה זו אם אתה מתחיל.',
      icon: SchoolIcon,
      color: '#667eea',
    },
    {
      id: 2,
      title: 'רמה 2',
      subtitle: 'ביניים',
      description: 'בחר רמה זו אם יש לך ניסיון בסיסי.',
      icon: TrendingUpIcon,
      color: '#764ba2',
    },
    {
      id: 3,
      title: 'רמה 3',
      subtitle: 'מתקדם',
      description: 'בחר רמה זו אם אתה מתקדם.',
      icon: EmojiEventsIcon,
      color: '#f093fb',
    },
  ];

  const handleStart = async () => {
    if (selectedLevel) {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:5000/lessons/level/${selectedLevel}`
        );
        console.log(response.data);
        navigate(`/lessons/level/${selectedLevel}`);
      } catch (err) {
        setError('שגיאה בטעינת השיעורים. אנא נסה שוב.');
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            בחר את הרמה המתאימה לך 📚
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              mb: 3,
              opacity: 0.95,
              lineHeight: 1.8,
            }}
          >
            התחל את הנסיעה שלך ללימוד אנגלית עם הרמה שמתאימה ביותר לכישוריך
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
          {levels.map((level) => {
            const IconComponent = level.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={level.id}>
                <Card
                  onClick={() => setSelectedLevel(level.id)}
                  sx={{
                    background:
                      selectedLevel === level.id
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2))'
                        : 'rgba(255, 255, 255, 0.95)',
                    color: selectedLevel === level.id ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    backdropFilter: 'blur(10px)',
                    border:
                      selectedLevel === level.id
                        ? '2px solid white'
                        : `2px solid ${level.color}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow:
                        selectedLevel === level.id
                          ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                          : '0 15px 35px rgba(0, 0, 0, 0.2)',
                      background:
                        selectedLevel === level.id
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.3))'
                          : 'rgba(255, 255, 255, 1)',
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: level.color,
                      borderRadius: '0 0 0 50%',
                      opacity: 0.1,
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <IconComponent
                      sx={{
                        fontSize: '3rem',
                        mb: 2,
                        color:
                          selectedLevel === level.id ? 'white' : level.color,
                        transition: 'all 0.3s ease',
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {level.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.7,
                        mb: 2,
                        fontSize: '0.9rem',
                      }}
                    >
                      {level.subtitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.8,
                        lineHeight: 1.6,
                      }}
                    >
                      {level.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            disabled={!selectedLevel || loading}
            sx={{
              background: 'white',
              color: '#667eea',
              fontWeight: 700,
              px: 4,
              py: 1.8,
              fontSize: '1.1rem',
              '&:hover': {
                background: '#f0f0f0',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
              },
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              gap: 1,
            }}
            endIcon={loading ? <CircularProgress size={24} /> : <ArrowForwardIcon />}
          >
            {loading ? 'טוען...' : 'בואו נתחיל'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LevelSelection;