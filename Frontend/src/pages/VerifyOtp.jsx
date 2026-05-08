import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiArrowRight, FiRefreshCcw, FiClock } from 'react-icons/fi';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30); // 30 seconds countdown
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

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
    if (timer > 0) return;
    if (!email) {
      toast.error("Session not found. Please sign up again.");
      return;
    }

    setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', { email });
      toast.success(res.data.message || 'A new code has been sent!');
      setTimer(30); // Reset timer
      setOtp(''); // Clear old OTP input
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh', padding: '2rem 0' }}>
      <div className="glass-panel shadow-premium" style={{ 
        width: '100%', 
        maxWidth: '480px', 
        padding: '3.5rem 2.5rem', 
        textAlign: 'center'
      }}>
        
        <div className="primary-gradient" style={{ 
          width: '70px', height: '70px', borderRadius: '22px', 
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
          marginBottom: '2rem', 
          boxShadow: '0 8px 25px rgba(124, 77, 255, 0.4)' 
        }}>
          <FiShield size={35} color="white" />
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '800' }}>Verification</h2>
        <p className="text-secondary" style={{ marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Please enter the 6-digit code sent to:<br/>
          <strong className="text-gradient" style={{ fontSize: '1.1rem' }}>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
          <input
            type="text"
            placeholder="······"
            className="glass-input otp-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            required
          />

          <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', width: '100%' }} disabled={loading}>
            {loading ? 'Verifying...' : (
              <>
                Verify Account
                <FiArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex flex-col items-center gap-md">
            <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Didn't receive the code?</p>
            
            <button 
              onClick={handleResend}
              disabled={resending || timer > 0}
              className={`btn ${timer > 0 ? 'btn-secondary' : 'btn-primary'}`}
              style={{ 
                padding: '0.8rem 1.5rem', 
                borderRadius: '12px',
                minWidth: '180px',
                opacity: timer > 0 ? 0.6 : 1,
                cursor: timer > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {resending ? (
                <FiRefreshCcw size={18} className="animate-spin" />
              ) : timer > 0 ? (
                <>
                  <FiClock size={18} />
                  Resend in {timer}s
                </>
              ) : (
                <>
                  <FiRefreshCcw size={18} />
                  Resend Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .otp-input {
          text-align: center;
          font-size: 2.5rem !important;
          letter-spacing: 1.2rem;
          font-weight: 900;
          color: var(--primary-color) !important;
          padding: 1.5rem !important;
          background: rgba(255,255,255,0.03) !important;
        }
        .otp-input::placeholder {
          letter-spacing: 0.5rem;
          opacity: 0.2;
        }
        .shadow-premium {
          box-shadow: 0 25px 80px rgba(0,0,0,0.5), 0 0 20px rgba(124, 77, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;
