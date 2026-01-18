import React, { useState, useEffect, useRef } from 'react';
import './StackedCards.css';

const StackedCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  const personas = [
    {
      title: 'Free Plan',
      description: 'Perfect to try. 3 credits/month. Ideal for testing the service.',
      bg: '#0A0A0A',
      textColor: '#fff',
      rotation: 2.5,
      zIndex: 3
    },
    {
      title: 'Starter Plan',
      description: 'For small sellers. 30 credits/month. Start generating professional product ads daily.',
      bg: '#FFFFFF',
      textColor: '#000',
      rotation: -1.5,
      zIndex: 2
    },
    {
      title: 'Pro Plan',
      description: 'For agencies & high-volume sellers. 200+ credits/month. Bulk generation at amazing rates.',
      bg: '#FF5722',
      textColor: '#fff',
      rotation: 2.5,
      zIndex: 1
    },
    {
      title: 'Enterprise',
      description: 'Custom credits and dedicated support. Perfect for large teams.',
      bg: '#FFE5D9',
      textColor: '#000',
      rotation: -1.5,
      zIndex: 0
    }
  ];

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

  return (
    <section className="stacked-cards" id="pricing" ref={sectionRef}>
      <div className={`stacked-cards-container ${isVisible ? 'visible' : ''}`}>
        <div className="cards-wrapper">
          {personas.map((persona, index) => {
            // Calculate vertical offset for stacking (40-50% overlap)
            // Cards are approximately 680px tall (600px content + 80px padding)
            // Overlap by 50% means each card is offset by ~340px
            const verticalOffset = index * 240; // Each card offset by 240px for stacking
            const horizontalOffset = index * 30; // Slight horizontal offset for visibility
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                className={`persona-card ${isVisible ? 'visible' : ''}`}
                style={{
                  backgroundColor: persona.bg,
                  color: persona.textColor,
                  top: `${verticalOffset}px`,
                  left: `${horizontalOffset}px`,
                  transform: isHovered 
                    ? 'translate(0, 0) scale(1.05) rotate(0deg)'
                    : isVisible 
                      ? `translate(0, 0) rotate(${persona.rotation}deg)`
                      : 'translate(0, 0) rotate(0deg)',
                  zIndex: isHovered ? 10 : persona.zIndex,
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="persona-content">
                  <div className="persona-text">
                    <h3>{persona.title}</h3>
                    {index < 3 && persona.description && <p>{persona.description}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StackedCards;
