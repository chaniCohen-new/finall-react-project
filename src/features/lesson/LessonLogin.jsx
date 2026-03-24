import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
Box,
Container,
Typography,
Button,
Card,
CardContent,
Grid,
useMediaQuery,
Alert,
CircularProgress,
Chip,
Fade,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookIcon from '@mui/icons-material/Book';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const CourseComponent = () => {
const [lessons, setLessons] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const { level } = useParams();
const navigate = useNavigate();
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

useEffect(() => {
console.log("Current level:", level);
setLoading(true);
setError(null);

axios.get(`http://localhost:5000/lessons/level/level ${level}`)
.then(response => {
console.log(response.data);
setLessons(response.data);
})
.catch(error => {
console.error("There was an error fetching the lessons!", error);
setError('שגיאה בטעינת השיעורים. אנא נסה שוב.');
})
.finally(() => {
setLoading(false);
});
}, [level]);

const handleStartClick = (lessonId) => {
navigate(`/words/${lessonId}`);
};

const handlePracticeClick = (lessonId) => {
navigate(`/quiz/${lessonId}`);
};

const getLevelColor = (levelNum) => {
const colors = {
1: { main: '#667eea', light: 'rgba(102, 126, 234, 0.1)', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
2: { main: '#764ba2', light: 'rgba(118, 75, 162, 0.1)', gradient: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)' },
3: { main: '#f093fb', light: 'rgba(240, 147, 251, 0.1)', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
};
return colors[levelNum] || colors[1];
};

const getLevelTitle = (levelNum) => {
const titles = {
1: 'מתחילים',
2: 'ביניים',
3: 'מתקדמים',
};
return titles[levelNum] || 'לימוד';
};

const levelColor = getLevelColor(level);

if (loading) {
return (
<Box
sx={{
background: levelColor.gradient,
minHeight: '100vh',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
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
<Box sx={{ textAlign: 'center', color: 'white' }}>
<CircularProgress sx={{ color: 'white' }} size={80} />
<Typography sx={{ mt: 2, fontWeight: 600 }}>טוען שיעורים...</Typography>
</Box>
</Box>
);
}

return (
<Box
sx={{
background: levelColor.gradient,
color: 'white',
py: { xs: 6, md: 10 },
minHeight: '100vh',
position: 'relative',
overflow: 'hidden',
'&::before': {
content: '""',
position: 'absolute',
width: '500px',
height: '500px',
background: 'rgba(255, 255, 255, 0.08)',
borderRadius: '50%',
top: '-150px',
right: '-150px',
},
'&::after': {
content: '""',
position: 'absolute',
width: '350px',
height: '350px',
background: 'rgba(255, 255, 255, 0.04)',
borderRadius: '50%',
bottom: '-100px',
left: '-100px',
},
}}
>
<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
<Fade in={true} timeout={500}>
<Box sx={{ mb: 6 }}>
<Button
  endIcon={<ArrowBackIcon sx={{ transform: 'scaleX(-1)' }} />}
  onClick={() => navigate('/lessons')}
  sx={{
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    mb: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateX(5px)',
    },
  }}
>
  חזור
</Button>

<Box
sx={{
display: 'flex',
alignItems: 'center',
gap: 2,
mb: 2,
}}
>
<BookIcon sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }} />
<Box>
<Typography
variant="h3"
sx={{
fontWeight: 900,
textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
fontSize: { xs: '2rem', md: '3rem' },
mb: 0.5,
}}
>
נושאים ללימוד
</Typography>
<Typography
variant="h6"
sx={{
opacity: 0.95,
fontWeight: 500,
fontSize: { xs: '0.9rem', md: '1.1rem' },
}}
>
רמה: <strong>{getLevelTitle(level)}</strong>
</Typography>
</Box>
</Box>
</Box>
</Fade>

{error && (
<Alert
severity="error"
sx={{
mb: 4,
background: 'rgba(255, 255, 255, 0.15)',
color: 'white',
backdropFilter: 'blur(10px)',
border: '1px solid rgba(255, 255, 255, 0.3)',
borderRadius: '12px',
'& .MuiAlert-icon': {
color: 'white',
},
}}
>
{error}
</Alert>
)}

{lessons.length === 0 && !error && (
<Alert
severity="warning"
sx={{
mb: 4,
background: 'rgba(255, 255, 255, 0.15)',
color: 'white',
backdropFilter: 'blur(10px)',
border: '1px solid rgba(255, 255, 255, 0.3)',
borderRadius: '12px',
'& .MuiAlert-icon': {
color: '#fff9c4',
},
}}
>
<Box>
<Typography sx={{ fontWeight: 700, mb: 1 }}>
📚 אין שיעורים זמינים ברמה זו כרגע
</Typography>
<Typography sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
אנא בדוק שהשרת פועל כראוי וכי הנתונים הנכונים נטענו לבסיס הנתונים.
</Typography>
</Box>
</Alert>
)}

{lessons.length > 0 && (
<Box sx={{ mb: 3 }}>
<Chip
icon={<LocalFireDepartmentIcon />}
label={`${lessons.length} שיעורים זמינים`}
sx={{
background: 'rgba(255, 255, 255, 0.2)',
color: 'white',
fontWeight: 600,
fontSize: '1rem',
py: 2.5,
px: 2,
backdropFilter: 'blur(10px)',
border: '1px solid rgba(255, 255, 255, 0.3)',
}}
/>
</Box>
)}

<Grid container spacing={3}>
{lessons.map((lesson, index) => (
<Grid item xs={12} sm={6} md={4} key={lesson._id}>
<Fade in={true} timeout={300 + index * 100}>
<Card
sx={{
background: 'rgba(255, 255, 255, 0.95)',
color: '#333',
height: '100%',
display: 'flex',
flexDirection: 'column',
transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
position: 'relative',
overflow: 'hidden',
backdropFilter: 'blur(10px)',
border: '1px solid rgba(255, 255, 255, 0.2)',
'&::before': {
content: '""',
position: 'absolute',
top: 0,
right: 0,
width: '140px',
height: '140px',
background: levelColor.light,
borderRadius: '0 0 0 50%',
transition: 'all 0.4s ease',
},
'&::after': {
content: '""',
position: 'absolute',
bottom: 0,
left: 0,
width: '80px',
height: '80px',
background: 'rgba(255, 255, 255, 0.05)',
borderRadius: '50% 0 0 0',
},
'&:hover': {
transform: 'translateY(-12px)',
boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
'&::before': {
width: '160px',
height: '160px',
},
},
}}
>
<CardContent sx={{ position: 'relative', zIndex: 2, flexGrow: 1 }}>
<Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
<Chip
label={`שיעור ${index + 1}`}
size="small"
sx={{
background: levelColor.main,
color: 'white',
fontWeight: 700,
fontSize: '0.85rem',
}}
/>
<Typography sx={{ fontSize: '1.5rem' }}>
{index === 0 ? '⭐' : index === 1 ? '✨' : '🎯'}
</Typography>
</Box>

<Typography
variant="h5"
sx={{
fontWeight: 800,
mb: 1.5,
color: levelColor.main,
fontSize: { xs: '1.2rem', md: '1.4rem' },
}}
>
{lesson.category}
</Typography>

<Typography
variant="body2"
sx={{
opacity: 0.6,
mb: 2,
lineHeight: 1.7,
fontSize: '0.95rem',
}}
>
רמה: {lesson.level}
</Typography>
</CardContent>

<Box
sx={{
display: 'flex',
gap: 1,
p: 2,
borderTop: '1px solid rgba(0, 0, 0, 0.08)',
position: 'relative',
zIndex: 2,
background: 'rgba(255, 255, 255, 0.5)',
}}
>
<Button
variant="contained"
fullWidth
startIcon={<PlayArrowIcon />}
onClick={() => handleStartClick(lesson._id)}
sx={{
background: levelColor.main,
fontWeight: 700,
fontSize: '0.9rem',
py: 1.2,
textTransform: 'none',
transition: 'all 0.3s ease',
'&:hover': {
background: levelColor.main,
opacity: 0.88,
transform: 'scale(1.05)',
boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
},
}}
>
בואו נתחיל
</Button>
<Button
variant="outlined"
fullWidth
startIcon={<AssignmentIcon />}
onClick={() => handlePracticeClick(lesson._id)}
sx={{
color: levelColor.main,
borderColor: levelColor.main,
borderWidth: 2,
fontWeight: 700,
fontSize: '0.9rem',
py: 1.2,
textTransform: 'none',
transition: 'all 0.3s ease',
'&:hover': {
background: levelColor.light,
borderColor: levelColor.main,
borderWidth: 2,
transform: 'scale(1.05)',
},
}}
>
בואו נתרגל
</Button>
</Box>
</Card>
</Fade>
</Grid>
))}
</Grid>

{lessons.length > 0 && (
<Box
sx={{
mt: 8,
p: 3,
background: 'rgba(255, 255, 255, 0.1)',
backdropFilter: 'blur(10px)',
borderRadius: '16px',
border: '1px solid rgba(255, 255, 255, 0.2)',
textAlign: 'center',
}}
>
<Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
💡 <strong>טיפ:</strong> התחל עם השיעור הראשון וקדם בהדרגה לשיעורים מתקדמים יותר!
</Typography>
</Box>
)}
</Container>
</Box>
);
};

export default CourseComponent;
