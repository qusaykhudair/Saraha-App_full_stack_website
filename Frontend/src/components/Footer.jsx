import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Mail, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-logo">Saraha</Link>
            <p style={{ color: 'var(--text-muted)', maxWidth: '300px', marginBottom: '1.5rem' }}>
              The most trusted platform for anonymous feedback. Share your link and hear what others think about you honestly.
            </p>
            <div className="social-icons">
              <a href="#" className="social-btn"><Facebook size={20} /></a>
              <a href="#" className="social-btn"><Twitter size={20} /></a>
              <a href="#" className="social-btn"><Instagram size={20} /></a>
              <a href="#" className="social-btn"><Github size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Register</Link></li>
              <li><Link to="/">Explore</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <ShieldCheck size={18} className="text-primary" />
             <span>Secure and Anonymous Messaging</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Saraha App. All rights reserved. Created with ❤️ for honest communication.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
