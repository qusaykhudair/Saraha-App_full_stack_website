import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, LayoutDashboard, Menu, X, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiBaseUrl.replace('/api', '') || window.location.origin;
    return `${baseUrl}/uploads${path.startsWith('/') ? path : '/' + path}`;
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
            Saraha
          </Link>

          <div className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/" className="nav-link"><Home size={18} /> Home</Link>
            {user ? (
              <>
                <Link to="/" className="nav-link"><LayoutDashboard size={18} /> Dashboard</Link>
                <div style={{ width: '1px', height: '24px', background: '#30363d' }}></div>
                <div className="flex items-center gap-sm">
                  <img 
                    src={getFullImageUrl(user.profilePic) || `https://ui-avatars.com/api/?name=${user.userName}`} 
                    alt="avatar" 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontWeight: '500' }}>{user.userName}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="btn" style={{ display: 'none', background: 'none', color: 'white' }} id="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
        {user ? (
          <>
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/signup" className="btn btn-primary" onClick={() => setIsOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          #mobile-toggle { display: block !important; }
        }
        .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
      `}} />
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: 'var(--nav-height)' }}></div>
    </>
  );
};

export default Navbar;
