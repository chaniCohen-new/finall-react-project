import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

export default function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleScrollToFeatures = () => {
    const featuresElement = document.getElementById('features-section');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        minHeight: '600px',
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
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              שולט באנגלית בקלות! 🚀
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                mb: 3,
                opacity: 0.9,
                lineHeight: 1.8,
              }}
            >
              למד אנגלית עם שיטות חדשות ויעילות. הצטרף לאלפים שכבר שיפרו את
              השפה שלהם.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/lessons"
                sx={{
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: '#f0f0f0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                התחל עכשיו
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleScrollToFeatures}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                עוד על הקורסים
              </Button>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              perspective: '1000px',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '400px',
                height: '400px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '6rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-20px)' },
                },
              }}
            >
              🎓
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}