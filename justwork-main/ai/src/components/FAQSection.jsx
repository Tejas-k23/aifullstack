import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(1); // Second item (index 1) is expanded by default

  const faqs = [
    {
      question: 'How does the AI product ad generation work?',
      answer: 'Simply send a product photo through WhatsApp, and our AI will automatically generate professional marketing images in seconds. The AI analyzes your product, removes backgrounds, enhances colors, and creates multiple ad-ready variations perfect for social media, websites, and marketing campaigns.'
    },
    {
      question: 'What types of products can I use this service for?',
      answer: 'Our AI works with any product - from fashion items and accessories to electronics, home decor, beauty products, food items, and more. Just send a clear photo of your product, and we\'ll transform it into professional marketing material.'
    },
    {
      question: 'How long does it take to receive my marketing images?',
      answer: 'You\'ll receive your professional marketing images within seconds of sending your product photo. Our AI processes images instantly, so you can get back to running your business without waiting.'
    },
    {
      question: 'Do I need any design skills or software to use this?',
      answer: 'Not at all! Our service is designed for everyone - no design experience required. Just send a photo on WhatsApp, and you\'ll receive professionally designed marketing images ready to use. No Photoshop, Canva, or design skills needed.'
    },
    {
      question: 'How do I get started?',
      answer: 'Getting started is simple! Just send a product photo to our WhatsApp number, and you\'ll receive your professional marketing images instantly. New users get 3 free credits to try the service. After that, choose a plan that fits your needs and start creating unlimited ad-quality images.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-container">
          <div className="faq-header">
            <div className="faq-label">
              <span className="faq-dot"></span>
              <span>FAQ's</span>
            </div>
            <h2 className="faq-heading">
              <span>Answers to your common</span>
              <span>AI questions</span>
            </h2>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question-wrapper">
                  <h3 className="faq-question">{faq.question}</h3>
                  <span className="faq-icon">
                    {openIndex === index ? '×' : '+'}
                  </span>
                </div>
                <div className="faq-answer-wrapper">
                  {faq.answer && <p className="faq-answer">{faq.answer}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
