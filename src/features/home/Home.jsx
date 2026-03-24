import {
    Box,
  } from '@mui/material';
  import HeroSection from './HeroSection';
  import FeaturesSection from './FeatureSection';
  import TestimonialSection from './TestEmotionalSection';
  import CTASection from './CTASection';
  
  export default function Home() {
    return (
      <>
        <HeroSection />
        <div id="features-section">
          <FeaturesSection />
        </div>
        <TestimonialSection />
        <CTASection></CTASection>
      </>
    );
  }
  