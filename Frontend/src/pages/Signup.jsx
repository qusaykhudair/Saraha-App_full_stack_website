import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiUserPlus, FiMail, FiLock, FiUser, FiPhone, FiArrowRight, FiCamera } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 0, // 0 for Male, 1 for Female
    phoneNumber: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (image) data.append('image', image);

      const res = await api.post('/auth/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(res.data.message || 'OTP sent! Please check your email to verify your account.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
       toast.error(error.response?.data?.error || error.response?.data?.message || 'Error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p className="text-secondary">Join SARAHA and start receiving feedback</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {/* Avatar Upload */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
             <label style={{ 
               display: 'inline-block', position: 'relative', 
               cursor: 'pointer', width: '100px', height: '100px',
               borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary-color)' 
             }}>
                {preview ? (
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiCamera size={32} color="var(--text-secondary)" />
                  </div>
                )}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
             </label>
             <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Upload Profile Picture</p>
          </div>

          <div className="grid grid-2">
            <div className="flex flex-col gap-xs">
              <div style={{ position: 'relative' }}>
                <FiUser size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  name="userName"
                  placeholder="Full Name"
                  className="glass-input"
                  style={{ paddingLeft: '3rem' }}
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <div style={{ position: 'relative' }}>
                <FiPhone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="glass-input"
                  style={{ paddingLeft: '3rem' }}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

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

          <div className="grid grid-2">
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

            <div className="flex flex-col gap-xs">
              <div style={{ position: 'relative' }}>
                <FiLock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm"
                  className="glass-input"
                  style={{ paddingLeft: '3rem' }}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>Select Gender</label>
            <div className="flex gap-md">
              <label style={{ cursor: 'pointer', flex: 1 }}>
                <input type="radio" name="gender" value={0} checked={Number(formData.gender) === 0} onChange={handleInputChange} hidden />
                <div className="glass-panel text-center" style={{ 
                  padding: '0.8rem', 
                  transition: 'var(--transition)',
                  background: Number(formData.gender) === 0 ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                  borderColor: Number(formData.gender) === 0 ? 'var(--primary-color)' : 'var(--glass-border)',
                  color: Number(formData.gender) === 0 ? 'white' : 'var(--text-secondary)',
                  transform: Number(formData.gender) === 0 ? 'scale(1.05)' : 'scale(1)',
                  fontWeight: Number(formData.gender) === 0 ? '700' : '400',
                  boxShadow: Number(formData.gender) === 0 ? '0 4px 15px rgba(124, 77, 255, 0.4)' : 'none'
                }}>Male</div>
              </label>
              <label style={{ cursor: 'pointer', flex: 1 }}>
                <input type="radio" name="gender" value={1} checked={Number(formData.gender) === 1} onChange={handleInputChange} hidden />
                <div className="glass-panel text-center" style={{ 
                  padding: '0.8rem', 
                  transition: 'var(--transition)',
                  background: Number(formData.gender) === 1 ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                  borderColor: Number(formData.gender) === 1 ? 'var(--primary-color)' : 'var(--glass-border)',
                  color: Number(formData.gender) === 1 ? 'white' : 'var(--text-secondary)',
                  transform: Number(formData.gender) === 1 ? 'scale(1.05)' : 'scale(1)',
                  fontWeight: Number(formData.gender) === 1 ? '700' : '400',
                  boxShadow: Number(formData.gender) === 1 ? '0 4px 15px rgba(124, 77, 255, 0.4)' : 'none'
                }}>Female</div>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : (
              <>
                Create Account
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
