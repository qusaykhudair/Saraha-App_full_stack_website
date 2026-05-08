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
          padding: '0.6rem 1.2rem', 
          borderRadius: '30px', 
          fontSize: '0.85rem', 
          fontWeight: '600',
          marginBottom: '2rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)'
        }}>
          <FiZap size={16} fill="white" />
          <span>The New Standard of Anonymous Feedback</span>
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(2.8rem, 10vw, 4.8rem)', 
          fontWeight: '900', 
          marginBottom: '1.5rem',
          lineHeight: '1.1'
        }} className="text-gradient">
          Get Honest Feedback.<br/>Grow Together.
        </h1>
        
        <p className="text-secondary" style={{ 
          fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', 
          maxWidth: '700px', 
          margin: '0 auto 3rem',
          lineHeight: '1.6'
        }}>
          SARAHA is a safe space to share and receive anonymous feedback. 
          Discover what others truly think and improve yourself with honesty.
        </p>

        <div className="flex gap-md justify-center flex-mobile-col" style={{ width: '100%' }}>
          <Link to="/signup" className="btn btn-primary full-width-mobile" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started Now
            <FiChevronRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-secondary full-width-mobile" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}>
            Login to Account
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ paddingBottom: '8rem' }}>
        <div className="grid grid-3 container">
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

      {/* Interactive Stats Section */}
      <section className="glass-panel container" style={{ 
        padding: '5rem 2rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.1), rgba(0, 229, 255, 0.05))',
        marginBottom: '6rem',
        borderRadius: '30px',
        border: '1px solid var(--glass-border)'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>Join the Global Community</h2>
        <p className="text-secondary" style={{ marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Thousands of users are already discovering the power of honest feedback. Start your journey today.
        </p>
        <div className="flex justify-center gap-xl" style={{ flexWrap: 'wrap' }}>
           <StatItem value="10k+" label="Active Users" color="var(--primary-color)" />
           <StatItem value="50k+" label="Messages Sent" color="var(--secondary-color)" />
           <StatItem value="99%" label="Satisfaction" color="var(--success)" />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel hover-glow" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
    <div style={{ 
      background: 'rgba(255,255,255,0.03)', 
      width: '80px', height: '80px', 
      borderRadius: '22px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 2rem',
      border: '1px solid var(--glass-border)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
    }}>
      {icon}
    </div>
    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700' }}>{title}</h3>
    <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>{description}</p>
  </div>
);

const StatItem = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-xs">
    <div style={{ color: color, fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>{value}</div>
    <div className="text-secondary" style={{ fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>{label}</div>
  </div>
);

export default Home;
