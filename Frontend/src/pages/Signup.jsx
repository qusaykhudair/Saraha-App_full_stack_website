import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UploadCloud, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('userName', formData.userName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('confirmPassword', formData.confirmPassword);
      data.append('gender', formData.gender);
      if (formData.image) {
        data.append('image', formData.image);
      }

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
    <div className="flex justify-center items-center" style={{ padding: '2rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: 'var(--spacing-xl)' }}>
        <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)' }}>Create Account</h2>
        <p className="text-center text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>Join the community for honest feedback</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                name="userName"
                className="glass-input"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                className="glass-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Styled Profile Picture Input */}
          <div className="form-group">
            <label>Profile Picture (Optional)</label>
            <label style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', 
              padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius)', 
              border: '1px dashed var(--card-border)', transition: 'all 0.3s' 
            }} className="file-input-label">
              <UploadCloud size={20} className="text-primary" />
              <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
                {formData.image ? formData.image.name : 'Click to upload profile picture'}
              </span>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="glass-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="glass-input"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" className="glass-input" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '50px' }} disabled={loading}>
            {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login" className="text-primary" style={{ fontWeight: '600' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
