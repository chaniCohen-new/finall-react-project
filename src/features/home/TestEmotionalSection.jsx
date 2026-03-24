import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
} from '@mui/material';

const testimonials = [
  {
    name: 'דויד כהן',
    role: 'מפתח תוכנה',
    text: 'הקורס שנה לי את הדרך שלי בלימוד אנגלית. עכשיו אני יכול לקרוא דוקומנטציה בקלות!',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    name: 'יניב לוי',
    role: 'מורה',
    text: 'שיטות הוראה מדהימות וחומר קורס איכותי מאוד. הממליץ בחום!',
    rating: 5,
    avatar: '👩‍🎓',
  },
  {
    name: 'שרה בן',
    role: 'עסקאית',
    text: 'הקורס העסקי עזר לי להתנהל בפגישות באנגלית בביטחון. ממש חיוני!',
    rating: 4.8,
    avatar: '👩‍💼',
  },
];

export default function TestimonialSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
          }}
        >
          מה התלמידים שלנו אומרים
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: '2rem',
                      bgcolor: 'transparent',
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>

                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />

                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}