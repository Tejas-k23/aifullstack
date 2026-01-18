import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Sliders, Zap, Sparkles } from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const allFeatures = [
    {
      icon: <Wand2 size={32} />,
      title: 'WhatsApp Native Integration',
      description: 'Send product images directly on WhatsApp. No apps, no logins. Just snap, send, and get professional ads instantly.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      bgGradient: '#F5F7FF'
    },
    {
      icon: <Sliders size={32} />,
      title: 'AI-Quality Marketing Images',
      description: 'Our AI generates stunning, campaign-ready images that look professionally designed. Perfect for Instagram, website, and ads.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
      bgGradient: '#F8F9FB'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast Processing',
      description: 'Get your professional marketing images in seconds. No waiting, no delays. Instant results for your business needs.',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop',
      bgGradient: '#FFF5F9'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Multiple Design Variations',
      description: 'Receive multiple design options for each product. Choose your favorite style or use them all across different platforms.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop',
      bgGradient: '#F0FDF4'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Show 2 cards at a time, rotate through all features
  const getVisibleFeatures = () => {
    return [
      allFeatures[currentIndex % allFeatures.length],
      allFeatures[(currentIndex + 1) % allFeatures.length]
    ];
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % allFeatures.length);
        setIsAnimating(false);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible, allFeatures.length]);

  const visibleFeatures = getVisibleFeatures();

  return (
    <section className="features" id="features" ref={sectionRef}>
      <div className="container">
        <div className={`features-container ${isVisible ? 'visible' : ''}`}>
          <div className="feature-grid">
          {visibleFeatures.map((feature, index) => (
            <div 
              key={`${currentIndex}-${index}`}
              className={`feature-card ${isAnimating ? 'swapping' : ''}`}
            >
              <div className="feature-content" style={{ background: feature.bgGradient }}>
                <div className="icon-container">
                  <div className="icon">
                    {feature.icon}
                  </div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className="feature-image">
                <img src={feature.image} alt={feature.title} />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;