import React, { useEffect, useRef, useState } from 'react';
import './CategorySection.css';

const CategorySection = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const categories = [
    {
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=400&fit=crop',
      label: 'Portrait',
      color: '#0066FF'
    },
    {
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop',
      label: 'Landscape',
      color: '#666666'
    },
    {
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=400&fit=crop',
      label: 'Old Photos',
      color: '#666666'
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
    <section className="categories" ref={sectionRef}>
      <div className="categories-container">
        <div className="cat-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              ref={(el) => (cardRefs.current[index] = el)}
              className={`cat-card ${visibleCards.includes(index) ? 'visible' : ''}`}
            >
              <div className="cat-image">
                <img src={category.image} alt={category.label} />
              </div>
              <div className="cat-label">
                <h4 style={{ color: category.color }}>{category.label}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
