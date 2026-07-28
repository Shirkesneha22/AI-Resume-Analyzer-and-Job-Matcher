import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { TechStack } from '../components/landing/TechStack';
import { FAQ } from '../components/landing/FAQ';

export const Home = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <Features />
      <HowItWorks />
      <TechStack />
      <FAQ />
    </div>
  );
};
