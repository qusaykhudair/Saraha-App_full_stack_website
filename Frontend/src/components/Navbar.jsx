import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
<<<<<<< HEAD
import { LogOut, Home, LayoutDashboard, Menu, X, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
=======
import { LogOut, MessageSquare, User, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
>>>>>>> 8c83bf1 (feat: add Signup page, Navbar component, and global CSS styling)
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
<<<<<<< HEAD
    setIsOpen(false);
    navigate('/login');
  };

=======
    navigate('/login');
  };

  // Helper to get image URL (same as in Dashboard)
>>>>>>> 8c83bf1 (feat: add Signup page, Navbar component, and global CSS styling)
  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiBaseUrl.replace('/api', '') || window.location.origin;
<<<<<<< HEAD
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
=======
    let normalizedPath = path;
    if (!path.startsWith('/')) normalizedPath = '/' + path;
    return `${baseUrl}/uploads${normalizedPath}`;
  };

  return (
    <nav className="glass-panel" style={{ margin: '1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <div className="container">
        <div className="flex items-center justify-between navbar-content" style={{ height: '70px' }}>
          <Link to="/" className="flex items-center gap-sm" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--primary-color)', width: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={20} color="white" />
            </div>
            <h1 style={{ fontSize: '1.4rem', margin: 0 }} className="text-gradient">Saraha</h1>
          </Link>

          <div className="flex items-center gap-md nav-links">
            <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Home</Link>
            {user && (
              <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-md nav-user">
            {user ? (
              <>
                <div className="flex items-center gap-sm" style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 12px 4px 4px', borderRadius: '30px', border: '1px solid var(--card-border)' }}>
                   <img 
                    src={getFullImageUrl(user.profilePic) || `https://ui-avatars.com/api/?name=${user.userName}&background=6366f1&color=fff`} 
                    alt="Profile" 
                    className="avatar"
                    style={{ width: '32px', height: '32px' }}
                   />
                   <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{user.userName?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Login</Link>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>Join Now</Link>
              </>
            )}
          </div>
>>>>>>> 8c83bf1 (feat: add Signup page, Navbar component, and global CSS styling)
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
