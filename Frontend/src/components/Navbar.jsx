import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMessageSquare, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';
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
      padding: '0.6rem 0'
    }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-sm" style={{ textDecoration: 'none' }}>
          <div className="primary-gradient" style={{ width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiMessageSquare size={20} color="white" />
          </div>
          <span className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: '800' }}>SARAHA</span>
        </Link>

        <div className="flex gap-sm items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-icon-link" title="Dashboard">
                <FiGrid size={20} />
                <span className="hide-mobile">Dashboard</span>
              </Link>
              <Link to="/profile" className="nav-icon-link" title="Profile">
                <FiUser size={20} />
                <span className="hide-mobile">Profile</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem', minWidth: '40px', color: 'var(--error)' }}>
                <FiLogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ fontSize: '0.9rem' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Join
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
        }
        .nav-icon-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 8px;
          transition: var(--transition);
        }
        .nav-icon-link:hover {
          color: var(--primary-color);
          background: rgba(255,255,255,0.05);
        }
        @media (max-width: 640px) {
          .hide-mobile { display: none; }
          .nav-icon-link { padding: 0.4rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
