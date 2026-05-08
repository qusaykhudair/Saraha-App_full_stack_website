import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Shield, Zap, ArrowRight, Star } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0 6rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(88, 101, 242, 0.1)', color: 'var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
           <Star size={16} fill="var(--primary-color)" />
           <span>Trusted by thousands for honest feedback</span>
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Hear the <span style={{ color: 'var(--primary-color)' }}>Truth</span> from <br />
          Your Friends.
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          Saraha is the leading platform for anonymous, honest, and constructive feedback. 
          Discover what people truly think about you in a safe environment.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/profile" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Open Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card feature-card">
          <div style={{ background: 'rgba(88, 101, 242, 0.1)', color: 'var(--primary-color)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <MessageSquare size={24} />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>100% Anonymous</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Our platform is built on privacy. No one will ever know who sent the message, allowing for complete honesty.
          </p>
        </div>

        <div className="card feature-card">
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Shield size={24} />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Private & Secure</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Your messages are encrypted and can only be viewed by you on your personal dashboard. We value your security.
          </p>
        </div>

        <div className="card feature-card">
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Zap size={24} />
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Real-time Delivery</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Experience lightning fast messaging. Receive feedback instantly as it happens with our optimized cloud system.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .feature-card { transition: 0.3s; border-color: transparent; }
        .feature-card:hover { border-color: var(--primary-color); transform: translateY(-5px); background: #1c2128; }
      `}} />
    </div>
  );
};

export default Home;
