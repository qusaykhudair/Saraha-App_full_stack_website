import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiArrowRight, FiRefreshCcw, FiClock, FiMail } from 'react-icons/fi';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';

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
      toast.error("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await api.patch('/auth/verify-account', { email, otp });
      toast.success('Account verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired code');
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
      setOtp('');
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ 
        width: '100%', maxWidth: '500px', 
        padding: '4rem 3rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Aesthetic Background Glow */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-color)', opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%' }}></div>
        
        <div className="primary-gradient" style={{ 
          width: '70px', height: '70px', borderRadius: '22px', 
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
          marginBottom: '2rem', boxShadow: '0 10px 30px rgba(124, 77, 255, 0.4)' 
        }}>
          <FiShield size={35} color="white" />
        </div>

        <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '1rem' }}>Verify It's You</h2>
        <p className="text-secondary" style={{ marginBottom: '3rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
          We've sent a secure 6-digit code to:<br/>
          <span className="flex items-center justify-center gap-xs" style={{ color: 'var(--text-main)', marginTop: '0.5rem', fontWeight: '600' }}>
            <FiMail size={16} className="text-primary" /> {email}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              className="otp-field"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={6}
              required
            />
            <div style={{ marginTop: '1rem', height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary-color), transparent)', opacity: 0.3 }}></div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.2rem', width: '100%', borderRadius: '16px' }} disabled={loading}>
            {loading ? 'Verifying...' : (
              <>
                Confirm Code
                <FiArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex flex-col items-center gap-md">
            <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Didn't get the code?</p>
            
            <button 
              onClick={handleResend}
              disabled={timer > 0 || resending}
              className={`resend-btn ${timer > 0 ? 'disabled' : ''}`}
            >
              {resending ? (
                <FiRefreshCcw className="animate-spin" />
              ) : timer > 0 ? (
                <>
                  <FiClock /> Wait {timer}s
                </>
              ) : (
                <>
                  <FiRefreshCcw /> Resend Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .otp-field {
          width: 100%;
          background: transparent;
          border: none;
          text-align: center;
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 1.2rem;
          color: var(--primary-color);
          outline: none;
        }
        .otp-field::placeholder {
          color: rgba(255,255,255,0.05);
          letter-spacing: 1rem;
        }
        .resend-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          padding: 0.8rem 1.8rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .resend-btn:hover:not(.disabled) {
          background: var(--primary-color);
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(124, 77, 255, 0.3);
        }
        .resend-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;
