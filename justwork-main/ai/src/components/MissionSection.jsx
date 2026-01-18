import React, { useState, useEffect, useRef } from 'react';
import './MissionSection.css';

const stats = [
  { value: 50000, suffix: '+', label: 'Images Generated' },
  { value: 95, suffix: '%', label: 'Seller Satisfaction' },
  { value: 10, suffix: '+', label: 'Countries Operating In' }
];

const MissionSection = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const [displayValues, setDisplayValues] = useState([0, 0, 0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasAnimated(true);
          } else {
            setHasAnimated(false);
            setDisplayValues([0, 0, 0]);
          }
        });
      },
      { threshold: 0.3 }
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
    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTextVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (textRef.current) {
      textObserver.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        textObserver.unobserve(textRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 2000; // Faster animation (2 seconds)
    const startTime = Date.now();
    const targetValues = stats.map(stat => stat.value);

    // Calculate jump sizes based on target values
    const jumpSizes = targetValues.map((target) => {
      if (target >= 10000) return Math.max(2000, Math.floor(target / 25)); // For 50000, jump by 2000
      if (target >= 100) return Math.max(10, Math.floor(target / 10)); // For 95, jump by 10
      return Math.max(2, Math.floor(target / 5)); // For 10, jump by 2
    });

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setDisplayValues(
        targetValues.map((target, index) => {
          const current = Math.floor(target * easeOutQuart);
          const jumpSize = jumpSizes[index];
          // Round down to nearest jump size to create jumping effect
          const jumped = Math.floor(current / jumpSize) * jumpSize;
          return Math.min(jumped, target); // Ensure we don't exceed target
        })
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValues(targetValues);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated]);

  return (
    <section className="mission" id="about" ref={sectionRef}>
      <div className="container">
        <div className="mission-container">
          <p ref={textRef} className={`mission-text ${isTextVisible ? 'visible' : ''}`}>
            We're on a mission to help small businesses create <span className="highlight">professional marketing images</span> without design skills. With <span className="highlight">AI-powered</span> generation and WhatsApp convenience, ProductAI turns product photos into ad-ready visuals in seconds.
          </p>
          <div className="stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat">
                <h3>
                  {displayValues[index].toLocaleString()}{stat.suffix}
                </h3>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <h2 className="section-heading">How it works</h2>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
