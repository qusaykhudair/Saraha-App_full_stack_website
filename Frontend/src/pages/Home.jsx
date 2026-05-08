import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiShield, FiZap, FiHeart, FiChevronRight } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0 8rem', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="primary-gradient" style={{ 
          padding: '0.6rem 1.2rem', 
          borderRadius: '30px', 
          fontSize: '0.9rem', 
          fontWeight: '600',
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FiZap size={16} fill="white" />
          <span>The New Standard of Anonymous Feedback</span>
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 5rem)', 
          fontWeight: '900', 
          marginBottom: '1.5rem',
          lineHeight: '1.1'
        }} className="text-gradient">
          Get Honest Feedback.<br/>Grow Together.
        </h1>
        
        <p className="text-secondary" style={{ 
          fontSize: '1.25rem', 
          maxWidth: '700px', 
          margin: '0 auto 3rem',
          lineHeight: '1.6'
        }}>
          SARAHA is a safe space to share and receive anonymous feedback. 
          Discover what others truly think and improve yourself with honesty.
        </p>

        <div className="flex gap-md justify-center" style={{ flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started Now
            <FiChevronRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Login to Dashboard
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ paddingBottom: '8rem' }}>
        <div className="grid grid-3">
          <FeatureCard 
            icon={<FiShield size={32} color="var(--secondary-color)" />}
            title="100% Anonymous"
            description="Your identity is never revealed. We prioritize your privacy and safety above everything else."
          />
          <FeatureCard 
            icon={<FiMessageSquare size={32} color="var(--primary-color)" />}
            title="Encrypted Messages"
            description="All messages are securely stored and encrypted. Only you have access to your personal inbox."
          />
          <FeatureCard 
            icon={<FiHeart size={32} color="#ff4081" />}
            title="Positive Growth"
            description="Turn anonymous thoughts into constructive feedback. A platform designed for personal evolution."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel hover-glow" style={{ padding: '2.5rem', textAlign: 'center' }}>
    <div style={{ 
      background: 'rgba(255,255,255,0.03)', 
      width: '70px', height: '70px', 
      borderRadius: '20px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 1.5rem',
      border: '1px solid var(--glass-border)'
    }}>
      {icon}
    </div>
    <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{title}</h3>
    <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: '1.6' }}>{description}</p>
  </div>
);

export default Home;
