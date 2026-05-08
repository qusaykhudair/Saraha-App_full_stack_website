import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh', padding: '2rem' }}>
      <div className="glass-panel text-center shadow-premium" style={{ padding: '5rem 3rem', width: '100%', maxWidth: '600px' }}>
        
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '10rem', fontWeight: '900', margin: 0, opacity: 0.1, color: 'var(--text-main)' }}>404</h1>
          <div className="primary-gradient" style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124, 77, 255, 0.4)'
          }}>
            <FiAlertCircle size={50} color="white" />
          </div>
        </div>

        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>Lost in Space?</h2>
        <p className="text-secondary" style={{ fontSize: '1.15rem', marginBottom: '3rem', lineHeight: '1.7' }}>
          The page you are looking for doesn't exist or has been moved to another dimension. 
          Don't worry, you can always find your way back home.
        </p>

        <Link to="/" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', display: 'inline-flex', gap: '0.8rem' }}>
          <FiHome size={22} />
          Return to Home
        </Link>
      </div>
      <style>{`
        .shadow-premium {
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 40px rgba(124, 77, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default NotFound;
