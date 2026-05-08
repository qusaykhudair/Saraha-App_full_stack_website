import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiArrowRight, FiRefreshCcw, FiClock, FiLock } from 'react-icons/fi';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await api.patch('/auth/verify-account', { email, otp });
      toast.success('Account verified successfully! Welcome to SARAHA.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email) return;
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('A fresh code has been sent to your email.');
      setTimer(30);
      setOtp('');
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  // Helper to render the fancy OTP display
  const renderOtpSlots = () => {
    const slots = [];
    for (let i = 0; i < 6; i++) {
      const char = otp[i] || '';
      slots.push(
        <div key={i} className={`otp-slot ${char ? 'active' : ''}`}>
          {char || '•'}
        </div>
      );
    }
    return slots;
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '85vh', padding: '2rem 0' }}>
      <div className="glass-panel otp-card shadow-premium">
        
        <div className="icon-badge">
          <FiLock size={30} color="white" />
        </div>

        <h2 className="otp-title">Security Check</h2>
        <p className="otp-subtitle">
          We've sent a secure code to your email<br/>
          <span className="email-highlight">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-xl">
          <div className="otp-container-wrapper">
             <div className="otp-slots-container">
                {renderOtpSlots()}
             </div>
             <input
                type="text"
                className="hidden-otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                autoFocus
                required
              />
          </div>

          <button type="submit" className="btn btn-primary otp-submit-btn" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-sm">
                <div className="spinner-small"></div>
                Verifying...
              </div>
            ) : (
              <>
                Complete Verification
                <FiArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="resend-section">
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Didn't get the email?</p>
          <button 
            onClick={handleResend}
            disabled={resending || timer > 0}
            className={`resend-btn ${timer > 0 ? 'disabled' : ''}`}
          >
            {resending ? (
              <FiRefreshCcw size={16} className="animate-spin" />
            ) : timer > 0 ? (
              <div className="flex items-center gap-xs">
                <FiClock size={14} />
                <span>Resend in {timer}s</span>
              </div>
            ) : (
              <div className="flex items-center gap-xs">
                <FiRefreshCcw size={14} />
                <span>Request New Code</span>
              </div>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .otp-card {
          width: 100%;
          maxWidth: 480px;
          padding: 4rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .icon-badge {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(124, 77, 255, 0.4);
        }
        .otp-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
          letter-spacing: -0.02em;
        }
        .otp-subtitle {
          color: var(--text-secondary);
          margin-bottom: 3rem;
          line-height: 1.6;
          font-size: 1rem;
        }
        .email-highlight {
          color: var(--primary-color);
          font-weight: 700;
          background: rgba(124, 77, 255, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
        }
        .otp-container-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .otp-slots-container {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .otp-slot {
          width: 50px;
          height: 65px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 800;
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .otp-slot.active {
          background: rgba(124, 77, 255, 0.08);
          border-color: var(--primary-color);
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(124, 77, 255, 0.15);
          color: var(--primary-color);
        }
        .hidden-otp-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: text;
        }
        .otp-submit-btn {
          width: 100%;
          padding: 1.2rem;
          font-size: 1.1rem;
          border-radius: 18px;
          margin-top: 1rem;
        }
        .resend-section {
          margin-top: 3.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid var(--glass-border);
        }
        .resend-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          margin-top: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
          padding: 0.6rem 1.2rem;
          border-radius: 12px;
          background: rgba(124, 77, 255, 0.05);
        }
        .resend-btn:hover:not(.disabled) {
          background: rgba(124, 77, 255, 0.1);
          transform: translateY(-2px);
        }
        .resend-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: var(--text-secondary);
        }
        .spinner-small {
          width: 18px;
          height: 18px;
          border: 2px solid white;
          border-top-color: transparent;
          borderRadius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;
