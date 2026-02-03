// import {
//     Box,
//     Container,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     CardActions,
//     Button,
//     Chip,
//     Rating,
//   } from '@mui/material';
//   import { Link as RouterLink } from 'react-router-dom';
  
//   const courses = [
//     {
//       id: 1,
//       title: 'אנגלית בסיסית',
//       level: 'מתחילים',
//       students: 1243,
//       rating: 4.8,
//       price: 99,
//       color: '#667eea',
//     },
//     {
//       id: 2,
//       title: 'אנגלית ביתונית',
//       level: 'בינוני',
//       students: 856,
//       rating: 4.7,
//       price: 149,
//       color: '#764ba2',
//     },
//     {
//       id: 3,
//       title: 'אנגלית עסקית',
//       level: 'מתקדם',
//       students: 523,
//       rating: 4.9,
//       price: 199,
//       color: '#f50057',
//     },
//   ];
  
  export default function CoursesPreview() {
//     return (
//       <Box sx={{ py: { xs: 6, md: 10 } }}>
//         <Container maxWidth="lg">
//           <Typography
//             variant="h2"
//             sx={{
//               textAlign: 'center',
//               mb: 6,
//               fontWeight: 700,
//             }}
//           >
//             הקורסים שלנו
//           </Typography>
  
//           <Grid container spacing={4}>
//             {courses.map((course) => (
//               <Grid item xs={12} md={4} key={course.id}>
//                 <Card
//                   sx={{
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     border: `2px solid ${course.color}`,
//                     borderRadius: '16px',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       boxShadow: `0 12px 40px ${course.color}33`,
//                       transform: 'translateY(-12px)',
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       height: '120px',
//                       background: `linear-gradient(135deg, ${course.color}22, ${course.color}11)`,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontSize: '3rem',
//                     }}
//                   >
//                     📖
//                   </Box>
  
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
//                       {course.title}
//                     </Typography>
  
//                     <Chip
//                       label={course.level}
//                       size="small"
//                       sx={{
//                         mb: 2,
//                         background: course.color,
//                         color: 'white',
//                         fontWeight: 600,
//                       }}
//                     />
  
//                     <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
//                       <Typography variant="body2" color="text.secondary">
//                         👥 {course.students} תלמידים
//                       </Typography>
//                     </Box>
  
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                       <Rating value={course.rating} readOnly size="small" />
//                       <Typography variant="body2" color="text.secondary">
//                         {course.rating}
//                       </Typography>
//                     </Box>
  
//                     <Typography
//                       variant="h5"
//                       sx={{
//                         fontWeight: 700,
//                         color: course.color,
//                       }}
//                     >
//                       ₪{course.price}
//                     </Typography>
//                   </CardContent>
  
//                   <CardActions>
//                     <Button
//                       fullWidth
//                       variant="contained"
//                       component={RouterLink}
//                       to="/courses"
//                       sx={{
//                         background: `linear-gradient(135deg, ${course.color}, ${course.color}dd)`,
//                         fontWeight: 700,
//                         py: 1.5,
//                       }}
//                     >
//                       הירשם עכשיו
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>
//     );
  }