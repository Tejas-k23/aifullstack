import React from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      platform: 'Android User',
      username: '@marcobooks',
      title: 'Bookstagram Creator',
      quote: 'The background blur feature is incredible! My book photos look professional without any editing skills.',
      avatar: 'https://i.pravatar.cc/60?img=12'
    },
    {
      platform: 'iOS User',
      username: '@snapwithjen',
      title: 'Travel Photographer',
      quote: 'Color correction has never been easier. My travel photos now have that perfect Instagram-worthy look instantly.',
      avatar: 'https://i.pravatar.cc/60?img=33'
    },
    {
      platform: 'iOS User',
      username: '@hannahhome',
      title: 'Interior Blogger',
      quote: 'Removing unwanted objects from my room photos is a game-changer. No more Photoshop needed!',
      avatar: 'https://i.pravatar.cc/60?img=47'
    },
    {
      platform: 'iOS User',
      username: '@fitwithlana',
      title: 'Fitness Influencer',
      quote: 'So easy to use! I can edit my workout photos in seconds and get back to training. Love it!',
      avatar: 'https://i.pravatar.cc/60?img=51'
    },
    {
      platform: 'Android User',
      username: '@theartofalina',
      title: 'Digital Artist',
      quote: 'The selfie and avatar features are amazing. My profile pictures have never looked better!',
      avatar: 'https://i.pravatar.cc/60?img=68'
    },
    {
      platform: 'iOS User',
      username: '@veganplate',
      title: 'Food Creator',
      quote: 'The filters make my food photos pop! My engagement has increased since I started using PixelTouch.',
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
                    <span key={i} className="star">★</span>
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
