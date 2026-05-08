import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiArrowRight, FiRefreshCcw } from 'react-icons/fi';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP code");
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
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email session not found. Please sign up again.");
      return;
    }

    setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', { email });
      toast.success(res.data.message || 'A new code has been sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh', padding: '2rem 0' }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '480px', 
        padding: '3rem 2.5rem', 
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        
        {/* Balanced Icon Container */}
        <div className="primary-gradient" style={{ 
          width: '65px', height: '65px', borderRadius: '20px', 
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
          marginBottom: '1.5rem', 
          boxShadow: '0 8px 25px rgba(124, 77, 255, 0.4)' 
        }}>
          <FiShield size={32} color="white" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem', fontWeight: '800' }}>Verify Account</h2>
        <p className="text-secondary" style={{ marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1rem' }}>
          We've sent a 6-digit verification code to:<br/>
          <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="flex flex-col gap-xs">
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              className="glass-input"
              style={{ 
                textAlign: 'center', 
                fontSize: '1.8rem', 
                letterSpacing: '0.8rem', 
                fontWeight: '900',
                padding: '1.2rem',
                color: 'var(--primary-color)'
              }}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1.1rem', fontSize: '1.1rem', width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-sm">
                <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                Verifying...
              </div>
            ) : (
              <>
                Confirm Verification
                <FiArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
            Didn't receive the code? 
            <button 
              onClick={handleResend}
              disabled={resending}
              className="text-primary hover-glow" 
              style={{ 
                background: 'rgba(124, 77, 255, 0.1)', 
                border: 'none', 
                fontWeight: '700', 
                cursor: 'pointer', 
                marginLeft: '0.8rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'var(--transition)'
              }}
            >
              <FiRefreshCcw size={14} className={resending ? "animate-spin" : ""} />
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
