import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Mail, Lock, LogIn, Globe, Eye, EyeOff } from 'lucide-react';
=======
import { Mail, Lock, LogIn, Chrome, Eye, EyeOff } from 'lucide-react';
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
import { Mail, Lock, LogIn, Globe, Eye, EyeOff } from 'lucide-react';
>>>>>>> 068bb26 (solve the problem)
=======
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.data.accessToken, res.data.data.refreshToken);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
<<<<<<< HEAD
    // Redirect to Google OAuth or handle via library
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: 'var(--spacing-xl)' }}>
        <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)' }}>Login</h2>
        <p className="text-center text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>Welcome back to Saraha</p>
=======
    const apiUrl = import.meta.env.VITE_API_URL || '';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Log in to your account
        </p>
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
<<<<<<< HEAD
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
=======
            <div className="input-container">
              <Mail className="field-icon" size={18} />
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
              <input
                type="email"
                name="email"
                className="input-field input-with-icon"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
<<<<<<< HEAD
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={20} />
=======
            <div className="input-container">
              <Lock className="field-icon" size={18} />
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field input-with-icon"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
<<<<<<< HEAD
                style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
=======
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
          <button type="button" onClick={handleGoogleLogin} className="btn btn-secondary" style={{ width: '100%', height: '50px', background: 'white', color: '#333' }}>
            <Globe size={20} /> Continue with Google
=======
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '50px' }} disabled={loading}>
            {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : (
              <>
                <LogIn size={20} /> Login
              </>
            )}
          </button>

          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
            <span style={{ margin: '0 1rem', fontSize: '0.9rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
          </div>

          <button type="button" onClick={handleGoogleLogin} className="btn btn-secondary" style={{ width: '100%', height: '50px', background: 'white', color: '#333' }}>
<<<<<<< HEAD
            <Chrome size={20} /> Continue with Google
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
            <Globe size={20} /> Continue with Google
>>>>>>> 068bb26 (solve the problem)
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup" className="text-primary" style={{ fontWeight: '600' }}>Sign Up</Link>
=======
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          <button type="button" onClick={handleGoogleLogin} className="google-btn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign up</Link>
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
        </p>
      </div>
    </div>
  );
};

export default Login;
