import React from 'react';
import './LogoMarqueeSection.css';

const LogoMarqueeSection = () => {
  const logos = [
    {
      id: 1,
      type: 'star-circle',
      text: 'Logoipsum'
    },
    {
      id: 2,
      type: 'hashtag',
      text: 'logoipsum'
    },
    {
      id: 3,
      type: 'lightning',
      text: 'Logoip'
    },
    {
      id: 4,
      type: 'letter-m',
      text: 'm'
    },
    {
      id: 5,
      type: 'star-circle',
      text: 'Logoipsum'
    },
    {
      id: 6,
      type: 'hashtag',
      text: 'logoipsum'
    },
    {
      id: 7,
      type: 'lightning',
      text: 'Logoip'
    },
    {
      id: 8,
      type: 'letter-m',
      text: 'm'
    }
  ];

  const renderLogo = (logo) => {
    switch (logo.type) {
      case 'star-circle':
        return (
          <div className="logo-item logo-star-circle">
            <div className="logo-circle">
              <span className="star-icon">★</span>
            </div>
            <span className="logo-text">{logo.text}</span>
          </div>
        );
      case 'hashtag':
        return (
          <div className="logo-item logo-hashtag">
            <span className="hashtag-icon">#</span>
            <span className="logo-text">{logo.text}</span>
          </div>
        );
      case 'lightning':
        return (
          <div className="logo-item logo-lightning">
            <div className="logo-circle">
              <span className="lightning-icon">⚡</span>
            </div>
            <span className="logo-text">{logo.text}</span>
          </div>
        );
      case 'letter-m':
        return (
          <div className="logo-item logo-letter">
            <span className="letter-m">{logo.text}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="logo-marquee-section">
      <div className="container">
        <div className="logo-marquee-container">
        <h2 className="logo-marquee-heading">Trusted by top companies</h2>
        <div className="logo-marquee-wrapper">
          <div className="logo-marquee-track">
            {/* First set of logos */}
            {logos.map((logo) => (
              <div key={`first-${logo.id}`} className="logo-wrapper">
                {renderLogo(logo)}
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {logos.map((logo) => (
              <div key={`second-${logo.id}`} className="logo-wrapper">
                {renderLogo(logo)}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default LogoMarqueeSection;
