import React, { useEffect, useRef, useState } from 'react';
import './IntegrationsSection.css';

const IntegrationsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Generate app icons with different colors
  const iconColors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
    '#EF4444', '#6366F1', '#06B6D4', '#84CC16', '#F97316'
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
    <section className="integrations" ref={sectionRef}>
      <div className="container">
        <div className={`integrations-container ${isVisible ? 'visible' : ''}`}>
        <div className="integrations-grid">
          <div className="integrations-diagram">
            <div className="diagram-background">
              {/* Converging SVG Lines using exact path shape */}
              <svg className="connector-svg" viewBox="0 0 1000 400" preserveAspectRatio="none">
                {/* Top row curves - 5 icons */}
                {iconColors.slice(0, 5).map((color, i) => {
                  // Left side (mirrored) - first 2 icons
                  if (i < 2) {
                    const translateX = 680 - (i * 180);
                    return (
                      <g key={`top-curve-${i}`} transform={`translate(${translateX}, 0) scale(-0.95, 1)`}>
                        <path
                          d="M250 200c0-125 250-50 250-200"
                          stroke={`${color}33`}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                        <path
                          className={isVisible ? 'animated-dash' : ''}
                          d="M250 200c0-125 250-50 250-200"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                          pathLength="100"
                          strokeDasharray="30 100"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      </g>
                    );
                  }
                  // Center icon
                  if (i === 2) {
                    return (
                      <g key={`top-curve-${i}`} transform="translate(500, 0) scale(1, 1)">
                        <path
                          d="M250 200c0-125 250-50 250-200"
                          stroke={`${color}33`}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                        <path
                          className={isVisible ? 'animated-dash' : ''}
                          d="M250 200c0-125 250-50 250-200"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                          pathLength="100"
                          strokeDasharray="30 100"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      </g>
                    );
                  }
                  // Right side - last 2 icons
                  const translateX = 320 + ((i - 3) * 180);
                  return (
                    <g key={`top-curve-${i}`} transform={`translate(${translateX}, 0) scale(0.95, 1)`}>
                      <path
                        d="M250 200c0-125 250-50 250-200"
                        stroke={`${color}33`}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="transparent"
                      />
                      <path
                        className={isVisible ? 'animated-dash' : ''}
                        d="M250 200c0-125 250-50 250-200"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="transparent"
                        pathLength="100"
                        strokeDasharray="30 100"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    </g>
                  );
                })}
                {/* Bottom row curves - 5 icons */}
                {iconColors.slice(5, 10).map((color, i) => {
                  // Left side (mirrored) - first 2 icons
                  if (i < 2) {
                    const translateX = 680 - (i * 180);
                    return (
                      <g key={`bottom-curve-${i}`} transform={`translate(${translateX}, 100) scale(-0.95, 1)`}>
                        <path
                          d="M250 200c0-125 250-50 250-200"
                          stroke={`${color}33`}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                        <path
                          className={isVisible ? 'animated-dash' : ''}
                          d="M250 200c0-125 250-50 250-200"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                          pathLength="100"
                          strokeDasharray="30 100"
                          style={{ animationDelay: `${(i + 5) * 0.2}s` }}
                        />
                      </g>
                    );
                  }
                  // Center icon
                  if (i === 2) {
                    return (
                      <g key={`bottom-curve-${i}`} transform="translate(500, 100) scale(1, 1)">
                        <path
                          d="M250 200c0-125 250-50 250-200"
                          stroke={`${color}33`}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                        <path
                          className={isVisible ? 'animated-dash' : ''}
                          d="M250 200c0-125 250-50 250-200"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          fill="transparent"
                          pathLength="100"
                          strokeDasharray="30 100"
                          style={{ animationDelay: `${(i + 5) * 0.2}s` }}
                        />
                      </g>
                    );
                  }
                  // Right side - last 2 icons
                  const translateX = 320 + ((i - 3) * 180);
                  return (
                    <g key={`bottom-curve-${i}`} transform={`translate(${translateX}, 100) scale(0.95, 1)`}>
                      <path
                        d="M250 200c0-125 250-50 250-200"
                        stroke={`${color}33`}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="transparent"
                      />
                      <path
                        className={isVisible ? 'animated-dash' : ''}
                        d="M250 200c0-125 250-50 250-200"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="transparent"
                        pathLength="100"
                        strokeDasharray="30 100"
                        style={{ animationDelay: `${(i + 5) * 0.2}s` }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Top row of icons */}
              <div className="icon-row icon-row-top">
                {iconColors.slice(0, 5).map((color, i) => (
                  <div key={`top-${i}`} className="app-icon" style={{ background: color }}>
                    {i === 0 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="white"/>
                      </svg>
                    ) : i === 1 ? (
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>G</span>
                    ) : i === 2 ? (
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>P</span>
                    ) : i === 3 ? (
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>C</span>
                    ) : (
                      <i className="fas fa-brain" style={{ fontSize: '20px', color: 'white' }}></i>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom row of icons */}
              <div className="icon-row icon-row-bottom">
                {iconColors.slice(5, 10).map((color, i) => (
                  <div key={`bottom-${i}`} className="app-icon" style={{ background: color }}>
                    {i === 0 ? (
                      <i className="fas fa-robot" style={{ fontSize: '20px', color: 'white' }}></i>
                    ) : i === 1 ? (
                      <i className="fas fa-magic" style={{ fontSize: '20px', color: 'white' }}></i>
                    ) : i === 2 ? (
                      <i className="fas fa-cogs" style={{ fontSize: '20px', color: 'white' }}></i>
                    ) : i === 3 ? (
                      <i className="fas fa-lightbulb" style={{ fontSize: '20px', color: 'white' }}></i>
                    ) : (
                      <i className="fas fa-code" style={{ fontSize: '20px', color: 'white' }}></i>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Central AI Card */}
              <div className="central-hub">
                <div className="hub-icon">
                  <i className="fab fa-whatsapp" style={{ fontSize: '40px', color: '#25D366' }}></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="integrations-content">
            <h2>Works with Your Favorite Tools</h2>
            <button className="integrations-btn">View all integrations</button>
            <blockquote className="testimonial">
              "ProductAI turned our product photography workflow around. We get professional images in minutes instead of days. Game changer for our D2C business."
            </blockquote>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <p className="author-name">Rahul Sharma, D2C Seller & Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
