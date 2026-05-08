import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiArrowRight } from 'react-icons/fi';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP code");
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch('/auth/verify-account', {
        email: email,
        otp: otp
      });
      
      toast.success(res.data.message || 'Account created and verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3.5rem 2.5rem', textAlign: 'center' }}>
        
        <div className="primary-gradient" style={{ 
          width: '70px', height: '70px', borderRadius: '22px', 
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
          marginBottom: '2rem', boxShadow: '0 8px 25px rgba(124, 77, 255, 0.4)' 
        }}>
          <FiShield size={35} color="white" />
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Verify Account</h2>
        <p className="text-secondary" style={{ marginBottom: '2.5rem', lineHeight: '1.6' }}>
          We've sent a verification code to:<br/>
          <strong style={{ color: 'var(--text-main)' }}>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="flex flex-col gap-xs">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="glass-input"
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 'bold' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', width: '100%' }} disabled={loading}>
            {loading ? 'Verifying...' : (
              <>
                Confirm Verification
                <FiArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            Didn't receive the code? 
            <button className="text-primary" style={{ background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', marginLeft: '0.5rem' }}>
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
