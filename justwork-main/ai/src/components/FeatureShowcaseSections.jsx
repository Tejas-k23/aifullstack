import React from 'react';
import { Star } from 'lucide-react';
import Reveal from './Reveal';
import './FeatureShowcaseSections.css';

const FeatureShowcaseSections = () => {
  const FeatureContent = () => (
    <div className="feature-content-left">
      <Reveal>
        <span className="feature-label">AI Image Enhancement</span>
      </Reveal>
      <Reveal delay={0.3}>
        <h2 className="feature-heading">Transform ordinary photos into marketing masterpieces</h2>
      </Reveal>
      <Reveal delay={0.5}>
        <p className="feature-description">
          Our AI agents analyze your product images and automatically enhance them for maximum marketing impact, with professional lighting, backgrounds, and styling.
        </p>
      </Reveal>
      <div className="feature-divider"></div>
      <div className="feature-items">
        <Reveal delay={0.6}>
          <div className="feature-item">
            <Star size={20} className="star-icon" />
            <span>Automatic quality enhancement.</span>
          </div>
        </Reveal>
        <Reveal delay={0.7}>
          <div className="feature-item">
            <Star size={20} className="star-icon" />
            <span>Marketing-optimized compositions.</span>
          </div>
        </Reveal>
      </div>
    </div>
  );

  const FeatureImage = () => (
    <div className="feature-image-right">
      <div className="image-container">
        <div className="checkered-background"></div>
        <img
          src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=800&fit=crop"
          alt="AI-enhanced marketing image"
          className="feature-image"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Section 1 - Background Remove */}
      <section className="feature-showcase-section background-remove-section">
        <div className="container">
          <Reveal width="100%">
            <h2 className="section-heading-above">AIZone Pro Features</h2>
          </Reveal>
          <div className="feature-showcase-container">
            <div className="showcase-feature-card reverse">
              <FeatureContent />
              <FeatureImage />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="feature-showcase-container">
            <div className="showcase-feature-card">
              <FeatureContent />
              <FeatureImage />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="feature-showcase-container">
            <div className="showcase-feature-card reverse">
              <FeatureContent />
              <FeatureImage />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureShowcaseSections;
