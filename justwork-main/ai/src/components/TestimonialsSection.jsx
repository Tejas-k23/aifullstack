import React from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      platform: 'E-commerce Seller',
      username: '@sarahshop',
      title: 'Online Store Owner',
      quote: 'AIZone\'s AI agents transformed our product photos overnight. Our ad conversions increased by 40% with these professional marketing images.',
      avatar: 'https://i.pravatar.cc/60?img=12'
    },
    {
      platform: 'D2C Brand',
      username: '@techgadgets',
      title: 'Electronics Retailer',
      quote: 'No more expensive photographers! AIZone delivers high-quality marketing visuals instantly via WhatsApp. Perfect for our fast-paced business.',
      avatar: 'https://i.pravatar.cc/60?img=33'
    },
    {
      platform: 'Fashion Brand',
      username: '@stylehub',
      title: 'Fashion Boutique',
      quote: 'The AI-enhanced images make our products look stunning. Our social media engagement has never been better since using AIZone.',
      avatar: 'https://i.pravatar.cc/60?img=47'
    },
    {
      platform: 'Local Business',
      username: '@craftcorner',
      title: 'Handmade Crafts Seller',
      quote: 'As a small business owner, AIZone helps me compete with big brands. Professional marketing images without the high costs!',
      avatar: 'https://i.pravatar.cc/60?img=51'
    },
    {
      platform: 'Startup Founder',
      username: '@innovateco',
      title: 'Tech Startup',
      quote: 'AIZone\'s WhatsApp integration is genius. We get marketing-ready images in seconds, keeping our team focused on growth.',
      avatar: 'https://i.pravatar.cc/60?img=68'
    },
    {
      platform: 'Marketing Agency',
      username: '@admasters',
      title: 'Digital Marketing Agency',
      quote: 'We use AIZone for all our client campaigns. The AI quality is outstanding and saves us hours of design work.',
      avatar: 'https://i.pravatar.cc/60?img=70'
    }
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <h2 className="testimonials-heading">Loved by thousands</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star"><i class="fa-sharp fa-solid fa-star"></i></span>
                  ))}
                </div>
                <span className="platform-label">{testimonial.platform}</span>
              </div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-user">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.username}
                  className="user-avatar"
                />
                <div className="user-info">
                  <span className="username">{testimonial.username}</span>
                  <span className="user-title">{testimonial.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
