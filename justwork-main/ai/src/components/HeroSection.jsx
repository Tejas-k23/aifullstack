import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mobileImages = ['/mobileinside1.jpeg', '/mobileinside2.jpeg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mobileImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [mobileImages.length]);

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1>AI Product Ads on WhatsApp</h1>
            <p>Send a product photo on WhatsApp. Get a professional marketing image in seconds.</p>
            <a href="#download" className="btn-primary">Try Free (3 Credits)</a>
            <div className="social-proof">
              <div className="avatars">
                <img src="https://i.pravatar.cc/40?img=1" alt="User" />
                <img src="https://i.pravatar.cc/40?img=2" alt="User" />
                <img src="https://i.pravatar.cc/40?img=3" alt="User" />
                <img src="https://i.pravatar.cc/40?img=4" alt="User" />
              </div>
              <span>5,000+ Sellers Using ProductAI</span>
            </div>
            <div className="awards">
              <div className="award-badge">
                <span className="laurel">⚡</span>
                <span>Trusted by D2C Sellers</span>
              </div>
              <div className="award-badge">
                <span className="laurel">✨</span>
                <span>Ad-Quality Images in Seconds</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="phone-mockup">
              <div className="phone-images-container">
                {mobileImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`App Interface ${index + 1}`}
                    className={`phone-image ${index === currentImageIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
