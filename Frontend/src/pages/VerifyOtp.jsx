import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // If the user lands here directly without an email, they shouldn't be here
  const email = state?.email;

  if (!email) {
    return (
      <div className="flex-col items-center justify-center text-center" style={{ minHeight: '60vh', padding: 'var(--spacing-xl) 0' }}>
        <h2>Invalid Session</h2>
        <p className="text-secondary" style={{ marginBottom: '1rem' }}>No email address found to verify.</p>
        <button onClick={() => navigate('/signup')} className="btn btn-primary">Go to Signup</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch('/auth/verify-account', {
        email: email,
        otp: otp
      });
      
      toast.success(res.data.message || 'Account verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel text-center" style={{ padding: 'var(--spacing-xl)', width: '100%', maxWidth: '450px' }}>
        <h2 className="text-gradient" style={{ marginBottom: 'var(--spacing-sm)' }}>Verify Your Account</h2>
        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
          We've sent a one-time password (OTP) to <strong>{email}</strong>. Please enter it below to activate your account.
        </p>
        
        <form onSubmit={handleSubmit} className="flex-col gap-md text-left">
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>One-Time Password (OTP)</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. 482637"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required 
              style={{ letterSpacing: '2px', textAlign: 'center', fontSize: '1.2rem' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 'var(--spacing-lg)', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : 'Verify Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
