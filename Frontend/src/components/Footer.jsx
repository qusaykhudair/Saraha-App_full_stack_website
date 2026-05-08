import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiFacebook, FiGithub, FiInstagram, FiLinkedin, FiSend, FiMessageSquare, FiHeart, FiShield } from 'react-icons/fi';

const Footer = () => {
  const { user } = useContext(AuthContext);

  return (
    <footer style={{ 
      background: 'rgba(15, 23, 42, 0.9)', 
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--glass-border)',
      padding: '4rem 0 2rem',
      marginTop: '6rem'
    }}>
      <div className="container">
        <div className="grid grid-3" style={{ marginBottom: '3rem', gap: '3rem' }}>
          
          {/* Brand Section */}
          <div className="flex flex-col gap-md">
            <Link to="/" className="flex items-center gap-sm" style={{ textDecoration: 'none' }}>
              <div className="primary-gradient" style={{ width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiMessageSquare size={20} color="white" />
              </div>
              <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>SARAHA</span>
            </Link>
            <p className="text-secondary" style={{ maxWidth: '300px', lineHeight: '1.7' }}>
              The most trusted platform for anonymous and honest feedback. Connect with your friends and discover the truth.
            </p>
            <div className="flex gap-sm">
              <SocialBtn href="https://www.facebook.com/m.qsy.khdyr" icon={<FiFacebook size={18} />} color="#1877F2" />
              <SocialBtn href="https://github.com/qusaykhudair" icon={<FiGithub size={18} />} color="#fff" />
              <SocialBtn href="https://www.instagram.com/eng.qusay.khudair" icon={<FiInstagram size={18} />} color="#E4405F" />
              <SocialBtn href="https://www.linkedin.com/in/eng-qusay-khudair-bb8303262" icon={<FiLinkedin size={18} />} color="#0A66C2" />
              <SocialBtn href="https://t.me/eng_Qusay_kh" icon={<FiSend size={18} />} color="#229ED9" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/" className="footer-link">Home Page</Link></li>
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              {user ? (
                <li><Link to="/profile" className="footer-link">Account Settings</Link></li>
              ) : (
                <>
                  <li><Link to="/login" className="footer-link">Login Account</Link></li>
                  <li><Link to="/signup" className="footer-link">Create Account</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white' }}>Get in Touch</h4>
            <p className="text-secondary" style={{ marginBottom: '1rem' }}>Have questions or feedback? Contact the developer:</p>
            <a href="mailto:engqusaykhudair@gmail.com" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem 1rem' }}>
              <FiSend size={18} />
              engqusaykhudair@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ 
          borderTop: '1px solid var(--glass-border)', 
          paddingTop: '2rem', 
          textAlign: 'center' 
        }}>
          <div className="flex justify-center items-center gap-xs" style={{ marginBottom: '0.8rem', color: 'var(--success)' }}>
             <FiShield size={16} />
             <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>End-to-end Encrypted Messaging</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Development by <span className="text-gradient" style={{ fontWeight: '700' }}>Eng Qusay khudair</span>
          </p>
          <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.6 }}>
            © {new Date().getFullYear()} Saraha App. All rights reserved.
          </p>
        </div>
      </div>
      <style>{`
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition);
          font-size: 0.95rem;
        }
        .footer-link:hover {
          color: var(--primary-color);
          padding-left: 5px;
        }
      `}</style>
    </footer>
  );
};

const SocialBtn = ({ href, icon, color }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer" 
    className="glass-panel" 
    style={{ 
      width: '40px', height: '40px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '10px', color: 'var(--text-secondary)',
      transition: 'var(--transition)'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = color; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
  >
    {icon}
  </a>
);

export default Footer;
