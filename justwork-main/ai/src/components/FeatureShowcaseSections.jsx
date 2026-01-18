import React from 'react';
import { Star } from 'lucide-react';
import './FeatureShowcaseSections.css';

const FeatureShowcaseSections = () => {
  return (
    <>
      {/* Section 1 - Background Remove */}
      <section className="feature-showcase-section background-remove-section">
        <div className="container">
          <h2 className="section-heading-above">Pixeltouch pro features</h2>
          <div className="feature-showcase-container">
            <div className="showcase-feature-card">
              <div className="feature-content-left">
                <span className="feature-label">Background Remove</span>
                <h2 className="feature-heading">Instant background removal with us</h2>
                <p className="feature-description">
                  Our AI background remover quickly isolates your subject, giving you a sharp, professional every time.
                </p>
                <div className="feature-divider"></div>
                <div className="feature-items">
                  <div className="feature-item">
                    <Star size={20} className="star-icon" />
                    <span>Remove clutter in seconds.</span>
                  </div>
                  <div className="feature-item">
                    <Star size={20} className="star-icon" />
                    <span>Get clean edges instantly.</span>
                  </div>
                </div>
              </div>
              <div className="feature-image-right">
                <div className="image-container">
                  <div className="checkered-background"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop" 
                    alt="Person in light pink sweatshirt with removed background"
                    className="feature-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="feature-showcase-container">
            <div className="showcase-feature-card">
              <div className="feature-content-left">
                <span className="feature-label">Background Remove</span>
                <h2 className="feature-heading">Instant background removal with us</h2>
                <p className="feature-description">
                  Our AI background remover quickly isolates your subject, giving you a sharp, professional every time.
                </p>
                <div className="feature-divider"></div>
                <div className="feature-items">
                  <div className="feature-item">
                    <Star size={20} className="star-icon" />
                    <span>Remove clutter in seconds.</span>
                  </div>
                  <div className="feature-item">
                    <Star size={20} className="star-icon" />
                    <span>Get clean edges instantly.</span>
                  </div>
                </div>
              </div>
              <div className="feature-image-right">
                <div className="image-container">
                  <div className="checkered-background"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop" 
                    alt="Person in light pink sweatshirt with removed background"
                    className="feature-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="feature-showcase-container">
            <div className="showcase-feature-card">
              <div className="feature-content-left">
                <span className="feature-label">Background Remove</span>
                <h2 className="feature-heading">Instant background removal with us</h2>
                <p className="feature-description">
                  Our AI background remover quickly isolates your subject, giving you a sharp, professional every time.
                </p>
                <div className="feature-divider"></div>
                <div className="feature-items">
                  <div className="feature-item">
                    <Star size={20} className="star-icon" />
                    <span>Remove clutter in seconds.</span>
                  </div>
                  <div className="feature-item">
                    <Star size={20} className="star-icon" />
                    <span>Get clean edges instantly.</span>
                  </div>
                </div>
              </div>
              <div className="feature-image-right">
                <div className="image-container">
                  <div className="checkered-background"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop" 
                    alt="Person in light pink sweatshirt with removed background"
                    className="feature-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureShowcaseSections;
