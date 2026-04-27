import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const navigate = useNavigate();
  const { loginContext } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    rePassword: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.password !== formData.rePassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('userName', formData.userName);
      data.append('email', formData.email);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('password', formData.password);
      data.append('rePassword', formData.rePassword);
      if (image) {
        data.append('image', image);
      }

      const res = await api.post('/auth/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(res.data.message || 'Account created! Please check your email for the OTP.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
       toast.error(error.response?.data?.error || error.response?.data?.message || 'Error occurred during signup. Please check validation rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ padding: 'var(--spacing-xl) 0' }}>
      <div className="glass-panel text-center" style={{ padding: 'var(--spacing-xl)', width: '100%', maxWidth: '550px' }}>
        <h2 className="text-gradient" style={{ marginBottom: 'var(--spacing-md)' }}>Create an Account</h2>
        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>Join Saraha and start receiving honest feedback.</p>
        
        <form onSubmit={handleSubmit} className="flex-col gap-md text-left">
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Username</label>
            <input 
              type="text" 
              name="userName"
              className="glass-input" 
              placeholder="e.g., johndoe"
              value={formData.userName}
              onChange={handleChange}
              required 
            />
          </div>

          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              className="glass-input" 
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Phone Number <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>(eg: 01012345678)</span></label>
            <input 
              type="text" 
              name="phoneNumber"
              className="glass-input" 
              placeholder="01012345678"
              value={formData.phoneNumber}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="flex gap-md" style={{ marginTop: 'var(--spacing-md)' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Password</label>
              <input 
                type="password" 
                name="password"
                className="glass-input" 
                placeholder="Strong password"
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Confirm Password</label>
              <input 
                type="password" 
                name="rePassword"
                className="glass-input" 
                placeholder="Repeat password"
                value={formData.rePassword}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>Profile Picture (Optional)</label>
            <input 
              type="file" 
              name="image"
              accept="image/*"
              className="glass-input" 
              onChange={handleFileChange}
              style={{ padding: '0.5rem' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'var(--spacing-lg)', justifyContent: 'center' }}
            disabled={loading}
          >
           {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : 'Sign Up'}
          </button>
        </form>

        <p className="text-secondary" style={{ marginTop: 'var(--spacing-lg)' }}>
          Already have an account? <Link to="/login" className="text-primary" style={{ fontWeight: 'bold' }}>Sign in here</Link>
        </p>

        {/* Google Signup Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: 'var(--spacing-lg) 0 var(--spacing-md)' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--card-border)' }} />
          <span className="text-secondary" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Or register with</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--card-border)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await api.post('/auth/login-with-google', {
                  googleToken: credentialResponse.credential,
                });
                if (res.data?.data?.accessToken) {
                  loginContext(res.data.data);
                  toast.success('Registered & logged in with Google!');
                  navigate('/profile');
                }
              } catch (error) {
                toast.error(error.response?.data?.error || 'Google sign-up failed');
              }
            }}
            onError={() => toast.error('Google Sign-Up was cancelled or failed.')}
            shape="pill"
            theme="filled_black"
            text="signup_with"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
