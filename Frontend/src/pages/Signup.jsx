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
      
      toast.success(res.data.message || 'OTP sent! Check your email.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
       const msg = error.response?.data?.error || error.response?.data?.message || 'Signup failed';
       toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Join Saraha and start receiving feedback
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Username</label>
              <div className="input-container">
                <User className="field-icon" size={18} />
                <input
                  type="text"
                  name="userName"
                  className="input-field input-with-icon"
                  placeholder="Username"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-container">
              <Mail className="field-icon" size={18} />
              <input
                type="email"
                name="email"
                className="input-field input-with-icon"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Profile Image (Optional)</label>
            <label style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', 
              padding: '0.75rem', background: '#0d1117', borderRadius: '8px', border: '1px dashed var(--border-color)' 
            }}>
              <UploadCloud size={18} color="var(--primary-color)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {formData.image ? formData.image.name : 'Select image'}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <Lock className="field-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field input-with-icon"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-container">
              <Lock className="field-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="input-field input-with-icon"
                placeholder="Confirm"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
