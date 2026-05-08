import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMessageSquare, FiLogOut } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logoutContext();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      logoutContext();
      toast.error(error.response?.data?.error || 'Error logging out');
      navigate('/login');
    }
  };

  return (
    <nav style={{ 
      position: 'sticky', top: 0, zIndex: 1000, 
      background: 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(20px)', 
      borderBottom: '1px solid var(--glass-border)',
      padding: '0.8rem 0'
    }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-sm" style={{ textDecoration: 'none' }}>
          <div className="primary-gradient" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(124, 77, 255, 0.4)' }}>
            <FiMessageSquare size={24} color="white" />
          </div>
          <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.03em' }}>SARAHA</span>
        </Link>

        <div className="flex gap-md items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
                <FiLogOut size={18} />
                <span className="hide-mobile">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          font-size: 0.95rem;
        }
        .nav-link:hover {
          color: var(--primary-color);
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
