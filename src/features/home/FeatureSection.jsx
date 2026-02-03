import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
  } from '@mui/material';
  import SchoolIcon from '@mui/icons-material/School';
  import SpeedIcon from '@mui/icons-material/Speed';
  import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
  import PeopleIcon from '@mui/icons-material/People';
  
  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: '3rem', color: '#667eea' }} />,
      title: 'קורסים מקצועיים',
      description: 'קורסים מעוצבים על ידי מומחים עם שנות ניסיון בהוראת אנגלית',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: '3rem', color: '#764ba2' }} />,
      title: 'למד בקצב שלך',
      description: 'למד מהבית בזמן שמתאים לך, ללא לחץ או מגבלות זמן',
    },
    // {
    //   icon: <EmojiEventsIcon sx={{ fontSize: '3rem', color: '#f50057' }} />,
    //   title: 'סרטיפיקציה',
    //   description: 'קבל סרטיפיקט רשמי בסיום כל קורס להוספה לקורות חיים',
    // },
    // {
    //   icon: <PeopleIcon sx={{ fontSize: '3rem', color: '#4caf50' }} />,
    //   title: 'קהילה תומכת',
    //   description: 'הצטרף לקהילה של אלפי לומדים המעודדים זה את זה',
    // },
  ];
  
  export default function FeaturesSection() {
    return (
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            למה לבחור בנו?
          </Typography>
  
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <CardContent sx={{ px: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }