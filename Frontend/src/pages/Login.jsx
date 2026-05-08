import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiLogIn, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      await loginContext(res.data.data.accessToken, res.data.data.refreshToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await api.post('/auth/login-with-google', { googleToken: response.credential });
      await loginContext(res.data.data.accessToken, res.data.data.refreshToken);
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh', padding: '2rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="primary-gradient" style={{ 
            width: '60px', height: '60px', borderRadius: '18px', display: 'inline-flex', 
            alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
            boxShadow: '0 8px 20px rgba(124, 77, 255, 0.3)'
          }}>
            <FiLogIn size={30} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p className="text-secondary">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <div style={{ position: 'relative' }}>
              <FiMail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="glass-input"
                style={{ paddingLeft: '3rem' }}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <div style={{ position: 'relative' }}>
              <FiLock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="glass-input"
                style={{ paddingLeft: '3rem' }}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                Sign In
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ margin: '2rem 0', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--glass-border)', zIndex: 0 }}></div>
          <span style={{ position: 'relative', background: '#1e293b', padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 1 }}>or continue with</span>
        </div>

        <div className="flex justify-center" style={{ width: '100%' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Login Failed')}
            theme="filled_black"
            shape="pill"
            width="100%"
          />
        </div>

        <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
