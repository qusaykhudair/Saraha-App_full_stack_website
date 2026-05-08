import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Shield, Zap } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex-col items-center justify-center text-center mt-lg" style={{ minHeight: '70vh', padding: 'var(--spacing-xl) 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-lg)', lineHeight: 1.1 }}>
          Get anonymous feedback from your friends & coworkers
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)' }}>
          Saraha allows you to receive honest, constructive feedback securely and anonymously. 
          Create your profile and start sharing your link today.
        </p>

        <div className="flex justify-center gap-md mb-xl" style={{ marginBottom: '4rem' }}>
          {user ? (
            <Link to="/profile" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
                Get Started for Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="flex justify-between gap-md" style={{ marginTop: 'var(--spacing-xl)', textAlign: 'left' }}>
          <div className="glass-panel feature-card feature-primary" style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
            <div className="feature-icon-wrapper">
               <MessageSquare />
            </div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Anonymous Messages</h3>
            <p className="text-secondary">Users can send you messages without revealing their identity, ensuring 100% honesty.</p>
          </div>
          
          <div className="glass-panel feature-card feature-secondary" style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
            <div className="feature-icon-wrapper">
               <Shield />
            </div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Secure & Private</h3>
            <p className="text-secondary">Your data is yours. Messages are protected and can only be read by you on your dashboard.</p>
          </div>

          <div className="glass-panel feature-card feature-success" style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
            <div className="feature-icon-wrapper">
               <Zap />
            </div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Instant Delivery</h3>
            <p className="text-secondary">Messages appear instantly in your dashboard with lightning fast speed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
