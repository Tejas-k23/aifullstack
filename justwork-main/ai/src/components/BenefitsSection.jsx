import React, { useState, useEffect } from 'react';
import { Wand2, Palette, Smartphone, Share2 } from 'lucide-react';
import './BenefitsSection.css';

const BenefitsSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mobileImages = ['/mobileinside1.jpeg', '/mobileinside2.jpeg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mobileImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [mobileImages.length]);

  const benefits = [
    {
      position: 'left-top',
      icon: <Wand2 size={32} />,
      title: 'Smart Editing',
      subtext: 'Powerful tools that make editing fast and effortless.',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)'
    },
    {
      position: 'left-bottom',
      icon: <Palette size={32} />,
      title: 'Creative Freedom',
      subtext: 'Filters overlays to unlock endless creative possibilities.',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    },
    {
      position: 'right-top',
      icon: <Smartphone size={32} />,
      title: 'Made for Mobile',
      subtext: 'Optimized for speed and editing anytime, anywhere.',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
    },
    {
      position: 'right-bottom',
      icon: <Share2 size={32} />,
      title: 'Share Instantly',
      subtext: 'Export high-quality images and share with one click.',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
    }
  ];

  return (
    <section className="benefits-section" id="benefits">
      <div className="container">
        <div className="benefits-container">
        <h2 className="benefits-heading">Benefits at a glance</h2>
        
        <div className="benefits-layout">
          {/* Left Side Benefits */}
          <div className="benefits-left">
            {benefits
              .filter(benefit => benefit.position.startsWith('left'))
              .map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div 
                    className="benefit-icon-wrapper"
                    style={{ background: benefit.gradient }}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-subtext">{benefit.subtext}</p>
                </div>
              ))}
          </div>

          {/* Center iPhone Mockup */}
          <div className="phone-mockup-container">
            <div className="iphone-mockup">
              <div className="iphone-frame">
                <div className="iphone-notch"></div>
                <div className="iphone-screen">
                  <div className="photo-display">
                    {mobileImages.map((image, index) => (
                      <img 
                        key={index}
                        src={image}
                        alt={`App Interface ${index + 1}`}
                        className={`editing-photo ${index === currentImageIndex ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Benefits */}
          <div className="benefits-right">
            {benefits
              .filter(benefit => benefit.position.startsWith('right'))
              .map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div 
                    className="benefit-icon-wrapper"
                    style={{ background: benefit.gradient }}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-subtext">{benefit.subtext}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
