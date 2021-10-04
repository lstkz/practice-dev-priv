import React from 'react';
import { createGetServerSideProps, createSSRClient } from 'src/common/helper';
import { createUrl } from 'src/common/url';
import { ENABLE_CRYPTO } from 'src/config';
import { CryptoSection } from './CryptoSection';
import CTASection from './CTASection';
import { FAQSection } from './FAQSection';
import Footer from './Footer';
import HowItWorksSection from './HowItWorksSection';
import { MainSection } from './MainSection';
import { RoadmapSection } from './RoadmapSection';
// import { StatsSection } from './StatsSection';
// import TestimonialsSection from './TestimonialsSection';
import { WhatsPracticeDevSection } from './WhatsPracticeDevSection';

export function LandingPage() {
  return (
    <>
      <MainSection />
      <WhatsPracticeDevSection />
      <HowItWorksSection />
      {/* <StatsSection />
      <TestimonialsSection /> */}
      {ENABLE_CRYPTO && <CryptoSection />}
      <FAQSection />
      {ENABLE_CRYPTO && <RoadmapSection />}
      <CTASection />
      <Footer />
    </>
  );
}

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const api = createSSRClient(ctx);
  if (api.getToken()) {
    const query = ctx.resolvedUrl.split('?')[1];
    const base = createUrl({ name: 'modules' });
    return {
      redirect: {
        destination: query ? base + '?' + query : base,
      },
      props: {},
    };
  }
  return {
    props: {},
  };
});
