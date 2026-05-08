import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiArrowRight, FiRefreshCcw, FiClock, FiCheck } from 'react-icons/fi';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await api.patch('/auth/verify-account', { email, otp: otpCode });
      toast.success('Account verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('A new code has been sent!');
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '85vh', padding: '2rem 0' }}>
      <div className="glass-panel shadow-premium" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '4rem 2.5rem', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Decorative Element */}
        <div className="primary-gradient" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px' }}></div>
        
        <div className="primary-gradient" style={{ 
          width: '75px', height: '75px', borderRadius: '24px', 
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
          marginBottom: '2rem', 
          boxShadow: '0 10px 30px rgba(124, 77, 255, 0.4)' 
        }}>
          <FiShield size={38} color="white" />
        </div>

        <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Security Check</h2>
        <p className="text-secondary" style={{ marginBottom: '3rem', lineHeight: '1.7', fontSize: '1.05rem' }}>
          We've sent a 6-digit verification code to:<br/>
          <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
          {/* OTP Grid */}
          <div className="flex justify-between gap-sm" style={{ marginBottom: '1rem' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="otp-box"
                style={{ 
                  width: '55px', 
                  height: '65px', 
                  fontSize: '1.8rem', 
                  textAlign: 'center', 
                  fontWeight: '800',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: digit ? '2px solid var(--primary-color)' : '1px solid var(--glass-border)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  boxShadow: digit ? '0 0 15px rgba(124, 77, 255, 0.2)' : 'none'
                }}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1.3rem', fontSize: '1.2rem', width: '100%', borderRadius: '18px' }} disabled={loading}>
            {loading ? 'Verifying...' : (
              <>
                Complete Verification
                <FiCheck size={22} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex flex-col items-center gap-md">
            <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Didn't get the code?</p>
            
            <button 
              onClick={handleResend}
              disabled={timer > 0 || resending}
              className="resend-button"
              style={{ 
                opacity: timer > 0 ? 0.6 : 1,
                cursor: timer > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <FiRefreshCcw size={16} className={resending ? "animate-spin" : ""} />
              {timer > 0 ? `Resend in ${timer}s` : 'Request New Code'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .otp-box:focus {
          border-color: var(--primary-color) !important;
          background: rgba(124, 77, 255, 0.1) !important;
          transform: translateY(-5px);
          outline: none;
          box-shadow: 0 10px 20px rgba(124, 77, 255, 0.2) !important;
        }
        .resend-button {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          padding: 0.8rem 1.8rem;
          border-radius: 30px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: var(--transition);
        }
        .resend-button:hover:not(:disabled) {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          transform: scale(1.05);
        }
        .shadow-premium {
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 40px rgba(124, 77, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;
