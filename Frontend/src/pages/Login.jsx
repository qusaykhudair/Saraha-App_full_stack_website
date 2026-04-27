import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { loginContext } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Backend expects FormData for login because of fileUpload().none()
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);

      const res = await api.post('/auth/login', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data?.data?.accessToken) {
        loginContext(res.data.data);
        toast.success(res.data.message || 'Logged in successfully!');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/login-with-google', {
        googleToken: credentialResponse.credential,
      });
      if (res.data?.data?.accessToken) {
        loginContext(res.data.data);
        toast.success('Logged in with Google!');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In was cancelled or failed.');
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel text-center" style={{ padding: 'var(--spacing-xl)', width: '100%', maxWidth: '450px' }}>
        <h2 className="text-gradient" style={{ marginBottom: 'var(--spacing-lg)' }}>Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="flex-col gap-md text-left">
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              className="glass-input" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Password</label>
            <input 
              type="password" 
              name="password"
              className="glass-input" 
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'var(--spacing-lg)', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : 'Sign In'}
          </button>
        </form>

        <p className="text-secondary" style={{ marginTop: 'var(--spacing-lg)' }}>
          Don't have an account? <Link to="/signup" className="text-primary" style={{ fontWeight: 'bold' }}>Register here</Link>
        </p>

        {/* Google Login Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: 'var(--spacing-lg) 0 var(--spacing-md)' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--card-border)' }} />
          <span className="text-secondary" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Or continue with</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--card-border)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            shape="pill"
            theme="filled_black"
            text="signin_with"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
