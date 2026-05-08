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
          <div className="primary-gradient" style={{ width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)' }}>
            <FiMessageSquare size={20} color="white" />
          </div>
          <span className="text-gradient" style={{ fontSize: '1.3rem', fontWeight: '800' }}>SARAHA</span>
        </Link>

        <div className="flex gap-sm items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-soft-link" title="Dashboard">
                <FiGrid size={20} />
                <span className="hide-mobile">Dashboard</span>
              </Link>
              <Link to="/profile" className="nav-soft-link" title="Profile">
                <FiUser size={20} />
                <span className="hide-mobile">Profile</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="logout-btn-soft"
                title="Logout"
              >
                <FiLogOut size={18} />
                <span className="hide-mobile" style={{ marginLeft: '5px' }}>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ fontSize: '0.9rem', marginRight: '1rem' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', borderRadius: '14px' }}>
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
        }
        .nav-link:hover { color: var(--primary-color); }

        .nav-soft-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          padding: 0.6rem 1rem;
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
        }
        .nav-soft-link:hover {
          color: var(--primary-color);
          background: rgba(124, 77, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(124, 77, 255, 0.1);
        }

        .logout-btn-soft {
          display: flex;
          align-items: center;
          background: rgba(239, 68, 68, 0.05);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.1);
          padding: 0.6rem 1.2rem;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .logout-btn-soft:hover {
          background: rgba(239, 68, 68, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 640px) {
          .hide-mobile { display: none; }
          .nav-soft-link { padding: 0.6rem; border-radius: 12px; }
          .logout-btn-soft { padding: 0.6rem; border-radius: 12px; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
