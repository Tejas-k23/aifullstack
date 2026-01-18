import React from 'react';
import { ArrowRight, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1 - Brand Section */}
          <div className="footer-column">
            <h3 className="footer-brand">ProductAI</h3>
            <p className="footer-tagline">AI Product Ads on WhatsApp - Professional marketing images in seconds</p>
            <button className="footer-button">
              Get started
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick links</h4>
            <ul className="footer-links">
              <li><a href="#about">About us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonial">Testimonial</a></li>
            </ul>
          </div>

          {/* Column 3 - Features */}
          <div className="footer-column">
            <h4 className="footer-heading">Features</h4>
            <ul className="footer-links">
              <li><a href="#features">WhatsApp Integration</a></li>
              <li><a href="#features">AI Marketing Images</a></li>
              <li><a href="#features">Fast Processing</a></li>
              <li><a href="#features">Multiple Variations</a></li>
            </ul>
          </div>

          {/* Column 4 - Follow Us */}
          <div className="footer-column">
            <h4 className="footer-heading">Follow us</h4>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">© ProductAI 2025. All rights reserved.</p>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
