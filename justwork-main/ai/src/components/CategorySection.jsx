import React, { useEffect, useRef, useState } from 'react';
import './CategorySection.css';

const CategorySection = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const categories = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      label: 'E-commerce',
      color: '#0066FF'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
      label: 'Fashion',
      color: '#666666'
    },
    {
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      label: 'Food & Beverage',
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
