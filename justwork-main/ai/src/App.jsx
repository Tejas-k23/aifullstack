import React from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import FeaturesSection from './components/FeaturesSection';
import BeforeAfterSection from './components/BeforeAfterSection';
import IntegrationsSection from './components/IntegrationsSection';
import BenefitsSection from './components/BenefitsSection';
import FeatureShowcaseSections from './components/FeatureShowcaseSections';
import LogoMarqueeSection from './components/LogoMarqueeSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navigation />
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <BeforeAfterSection />
      <IntegrationsSection />
      <BenefitsSection />
      <FeatureShowcaseSections />
      <LogoMarqueeSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

export default App;
