import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './BeforeAfterSection.css';

const BeforeAfterSection = () => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  const imagePairs = [
    {
      before: '/before1.png',
      after: '/after.png',
      subtitle: 'Product Photography'
    },
    {
      before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=700&fit=crop',
      after: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=700&fit=crop',
      subtitle: 'E-commerce Images'
    },
    {
      before: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&h=700&fit=crop',
      after: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=700&fit=crop',
      subtitle: 'Marketing Assets'
    }
  ];

  const currentPair = imagePairs[selectedIndex];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCardClick = (index) => {
    setSelectedIndex(index);
    setPosition(50);
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
    if (isDragging) {
      const handleMouseMoveEvent = (e) => {
        e.preventDefault();
        handleMove(e.clientX);
      };
      
      const handleMouseUpEvent = () => {
        setIsDragging(false);
      };

      const handleTouchMoveEvent = (e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      };

      const handleTouchEndEvent = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleMouseMoveEvent);
      document.addEventListener('mouseup', handleMouseUpEvent);
      document.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
      document.addEventListener('touchend', handleTouchEndEvent);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveEvent);
        document.removeEventListener('mouseup', handleMouseUpEvent);
        document.removeEventListener('touchmove', handleTouchMoveEvent);
        document.removeEventListener('touchend', handleTouchEndEvent);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <section className="compare" ref={sectionRef}>
      <div className="container">
        <div className={`compare-container ${isVisible ? 'visible' : ''}`}>
          <h2>Professional Results in Seconds</h2>
          <div 
            ref={containerRef}
            className="slider-container"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="slider-image before-image">
              <div className="label label-before">Before</div>
              <img 
                key={`before-${selectedIndex}`}
                src={currentPair.before} 
                alt="Before enhancement"
                className="compare-image"
              />
            </div>
            <div 
              className="slider-image after-image"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <div 
                className="label label-after"
                style={{ left: `${Math.max(20, Math.min(position - 15, 80))}%` }}
              >After</div>
              <img 
                key={`after-${selectedIndex}`}
                src={currentPair.after} 
                alt="After enhancement"
                className="compare-image"
              />
            </div>
            <div 
              className="slider-handle"
              style={{ left: `${position}%` }}
            >
              <div className="handle-circle">
                <ChevronLeft size={20} />
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
          <div className="compare-cards">
            {imagePairs.map((pair, index) => (
              <div
                key={index}
                className={`compare-card ${selectedIndex === index ? 'active' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="compare-card-image">
                  <img src={pair.before} alt={`Example ${index + 1}`} />
                </div>
                <p className="compare-card-subtitle">{pair.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
