import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMessageSquare, FiShield, FiZap, FiHeart, FiChevronRight } from 'react-icons/fi';

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '80vh' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: 'clamp(4rem, 10vw, 8rem) 1rem', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="primary-gradient" style={{ 
          padding: '0.5rem 1rem', 
          borderRadius: '30px', 
          fontSize: '0.8rem', 
          fontWeight: '600',
          marginBottom: '2rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FiZap size={14} fill="white" />
          <span>SARAHA REBORN</span>
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', 
          fontWeight: '900', 
          marginBottom: '1.5rem',
          lineHeight: '1.1'
        }} className="text-gradient">
          Feedback That<br/>Matters.
        </h1>
        
        <p className="text-secondary" style={{ 
          fontSize: 'clamp(1rem, 4vw, 1.2rem)', 
          maxWidth: '600px', 
          margin: '0 auto 2.5rem',
          lineHeight: '1.6'
        }}>
          Discover what your friends truly think about you in a safe and anonymous environment.
        </p>

        <div className="flex gap-md justify-center flex-mobile-col" style={{ width: '100%' }}>
          <Link to="/signup" className="btn btn-primary full-width-mobile" style={{ padding: '1rem 2rem' }}>
            Get Started
            <FiChevronRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary full-width-mobile" style={{ padding: '1rem 2rem' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ paddingBottom: '6rem' }}>
        <div className="grid grid-3 container">
          <FeatureCard 
            icon={<FiShield size={28} color="var(--secondary-color)" />}
            title="Secure & Private"
            description="Your identity is protected by state-of-the-art encryption standards."
          />
          <FeatureCard 
            icon={<FiMessageSquare size={28} color="var(--primary-color)" />}
            title="Honest Feedback"
            description="A platform designed for constructive and honest communication."
          />
          <FeatureCard 
            icon={<FiHeart size={28} color="#ff4081" />}
            title="Built with Love"
            description="Designed to help individuals grow through shared perspectives."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel hover-glow" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderRadius: '24px' }}>
    <div style={{ 
      background: 'rgba(255,255,255,0.03)', 
      width: '60px', height: '60px', 
      borderRadius: '18px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 1.5rem',
      border: '1px solid var(--glass-border)'
    }}>
      {icon}
    </div>
    <h3 style={{ marginBottom: '0.8rem', fontSize: '1.3rem', fontWeight: '700' }}>{title}</h3>
    <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{description}</p>
  </div>
);

export default Home;
