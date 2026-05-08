import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
<<<<<<< HEAD
import { Mail, Lock, LogIn, Globe, Eye, EyeOff } from 'lucide-react';
=======
import { Mail, Lock, LogIn, Chrome, Eye, EyeOff } from 'lucide-react';
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)

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
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth or handle via library
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: 'var(--spacing-xl)' }}>
        <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)' }}>Login</h2>
        <p className="text-center text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>Welcome back to Saraha</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                className="glass-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="glass-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

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
            <Chrome size={20} /> Continue with Google
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup" className="text-primary" style={{ fontWeight: '600' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
