import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, MessageSquare, Menu, X, LayoutDashboard, Home, UserPlus, LogIn } from 'lucide-react';

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
    let normalizedPath = path;
    if (!path.startsWith('/')) normalizedPath = '/' + path;
    return `${baseUrl}/uploads${normalizedPath}`;
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="glass-panel navbar-sticky">
      <div className="container">
        <div className="navbar-container">
          {/* Logo Section */}
          <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
            <div className="logo-box">
              <MessageSquare size={20} color="white" />
            </div>
            <h1 className="text-gradient logo-text">Saraha</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-desktop">
            <Link to="/" className="nav-link"><Home size={18} /> Home</Link>
            {user && (
              <Link to="/" className="nav-link"><LayoutDashboard size={18} /> Dashboard</Link>
            )}
          </div>

          {/* User Actions (Desktop) */}
          <div className="nav-desktop">
            {user ? (
              <div className="flex items-center gap-md">
                <div className="user-badge">
                   <img 
                    src={getFullImageUrl(user.profilePic) || `https://ui-avatars.com/api/?name=${user.userName}&background=6366f1&color=fff`} 
                    alt="Profile" 
                    className="avatar-sm"
                   />
                   <span>{user.userName?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-primary btn-sm">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-sm">
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Join Now</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="nav-mobile-toggle" onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`nav-mobile-menu ${isOpen ? 'active' : ''}`}>
           <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}><Home size={20} /> Home</Link>
           {user ? (
             <>
               <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}><LayoutDashboard size={20} /> Dashboard</Link>
               <div className="mobile-user-section">
                  <div className="user-badge" style={{ marginBottom: '1rem' }}>
                    <img 
                      src={getFullImageUrl(user.profilePic) || `https://ui-avatars.com/api/?name=${user.userName}&background=6366f1&color=fff`} 
                      alt="Profile" 
                      className="avatar-md"
                    />
                    <span style={{ fontSize: '1.1rem' }}>{user.userName}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%' }}>
                    <LogOut size={18} /> Logout
                  </button>
               </div>
             </>
           ) : (
             <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)}><LogIn size={20} /> Login</Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setIsOpen(false)}><UserPlus size={20} /> Sign Up</Link>
             </div>
           )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
