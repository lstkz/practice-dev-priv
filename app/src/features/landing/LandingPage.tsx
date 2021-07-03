import React from 'react';
import CTASection from './CTASection';
import { FAQSection } from './FAQSection';
import Footer from './Footer';
import HowItWorksSection from './HowItWorksSection';
import { MainSection } from './MainSection';
import { StatsSection } from './StatsSection';
import TestimonialsSection from './TestimonialsSection';
import { WhatsPracticeDevSection } from './WhatsPracticeDevSection';

export function LandingPage() {
  return (
    <>
      <MainSection />
      <WhatsPracticeDevSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
