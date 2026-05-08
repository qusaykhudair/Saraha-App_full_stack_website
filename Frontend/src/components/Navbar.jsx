import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, LogOut, User, LogIn, UserPlus } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout
      await api.post('/auth/logout');
      logoutContext();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      // If error occurs, still logout on frontend to be safe
      logoutContext();
      toast.error(error.response?.data?.error || 'Error logging out');
      navigate('/login');
    }
  };

  return (
    <nav className="glass-panel" style={{ padding: 'var(--spacing-md) 0', borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-sm text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          <MessageSquare size={28} color="var(--primary-color)" />
          Saraha App
        </Link>
        <div className="flex gap-md">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <User size={18} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                <UserPlus size={18} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
