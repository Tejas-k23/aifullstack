import React, { useEffect, useRef, useState } from 'react';
import { Wand2, Layers, Users } from 'lucide-react';
import './FeatureShowcase.css';

const FeatureShowcase = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const features = [
    {
      icon: <Wand2 size={48} />,
      title: 'Send Once, Get Results',
      description: 'Upload your product photo on WhatsApp and receive ad-ready images instantly. No waiting.',
      gradient: 'linear-gradient(135deg, #FFF5F9 0%, #F3E8FF 100%)',
      illustration: 'editor'
    },
    {
      icon: <Layers size={48} />,
      title: 'Multiple Variations',
      description: 'Get multiple design variations of your product in one request. Choose your favorite or use them all.',
      gradient: 'linear-gradient(135deg, #FFFCF5 0%, #FEF3C7 100%)',
      illustration: 'prototype'
    },
    {
      icon: <Users size={48} />,
      title: 'No Design Skills Needed',
      description: 'AI handles the design. You just send the photo. Professional results, every time.',
      gradient: 'linear-gradient(135deg, #F5F7FF 0%, #DBEAFE 100%)',
      illustration: 'collaboration'
    }
  ];

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => [...new Set([...prev, index])]);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);

  return (
    <section className="feature-showcase" ref={sectionRef}>
      <div className="feature-showcase-container">
        <div className="feature-showcase-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              ref={(el) => (cardRefs.current[index] = el)}
              className={`showcase-card ${visibleCards.includes(index) ? 'visible' : ''}`}
            >
              <div 
                className="showcase-illustration" 
                style={{ background: feature.gradient }}
              >
                {feature.illustration === 'editor' && (
                  <div className="editor-illustration">
                    <div className="toolbar">
                      <div className="toolbar-icon active"></div>
                      <div className="toolbar-icon"></div>
                      <div className="toolbar-icon"></div>
                      <div className="toolbar-icon"></div>
                    </div>
                    <div className="gradient-blob"></div>
                    <div className="cursor-hand">👆</div>
                  </div>
                )}
                {feature.illustration === 'prototype' && (
                  <div className="prototype-illustration">
                    <div className="proto-shape proto-rect"></div>
                    <div className="proto-shape proto-circle"></div>
                    <div className="proto-shape proto-rounded"></div>
                    <div className="proto-lines">
                      <div className="proto-line"></div>
                      <div className="proto-line"></div>
                    </div>
                  </div>
                )}
                {feature.illustration === 'collaboration' && (
                  <div className="collaboration-illustration">
                    <div className="collab-center">
                      <div className="collab-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="collab-avatars">
                      <div className="collab-avatar"></div>
                      <div className="collab-avatar"></div>
                      <div className="collab-avatar"></div>
                      <div className="collab-avatar"></div>
                      <div className="collab-avatar"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="showcase-content">
                <div className="showcase-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
