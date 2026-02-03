import {
    Box,
  } from '@mui/material';
  import HeroSection from './HeroSection';
  import FeaturesSection from './FeatureSection';
  import CoursesPreview from './CoursesPrivew';
  import TestimonialSection from './TestEmotionalSection';
  import CTASection from './CTASection';
  
  export default function Home() {
    return (
      <Box>
        <HeroSection />
        <FeaturesSection />
        <CoursesPreview />
        <TestimonialSection />
        <CTASection />
      </Box>
    );
  }