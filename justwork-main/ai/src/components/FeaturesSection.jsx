import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Sliders, Zap, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const allFeatures = [
    {
      icon: <Wand2 size={32} />,
      title: 'WhatsApp AI Agent Integration',
      description: 'Connect with our AI agents directly on WhatsApp. Send your product images and receive enhanced marketing visuals instantly through chat.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop', // AI/robot image
      bgGradient: '#F5F7FF'
    },
    {
      icon: <Sliders size={32} />,
      title: 'AI-Enhanced Marketing Images',
      description: 'Our advanced AI transforms ordinary product photos into stunning, conversion-optimized marketing images perfect for ads, social media, and e-commerce.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', // Marketing/analytics
      bgGradient: '#F8F9FB'
    },
    {
      icon: <Zap size={32} />,
      title: 'Instant Processing',
      description: 'Get your professionally enhanced images in seconds. No waiting for designers or complex software - just send and receive via WhatsApp.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop', // Fast technology
      bgGradient: '#FFF5F9'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Multiple Style Variations',
      description: 'Receive multiple AI-generated variations for each image. Choose from different styles, backgrounds, and compositions to match your brand.',
      image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=600&fit=crop', // Creative design
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
              <Reveal key={`${currentIndex}-${index}`} delay={index * 0.2}>
                <div
                  className={`feature-card ${isAnimating ? 'swapping' : ''}`}
                >
                  <div className="feature-content" style={{ background: feature.bgGradient }}>
                    <div className="icon-container">
                      <div className="icon">
                        {feature.icon}
                      </div>
                    </div>
                    <Reveal><h3>{feature.title}</h3></Reveal>
                    <Reveal delay={0.3}><p>{feature.description}</p></Reveal>
                  </div>
                  <div className="feature-image">
                    <img src={feature.image} alt={feature.title} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;