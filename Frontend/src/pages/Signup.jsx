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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
       const msg = error.response?.data?.error || error.response?.data?.message || 'Signup failed';
       toast.error(msg);
=======
       toast.error(error.response?.data?.error || error.response?.data?.message || 'Error occurred during signup.');
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
       toast.error(error.response?.data?.error || error.response?.data?.message || 'Error occurred during signup.');
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
       const msg = error.response?.data?.error || error.response?.data?.message || 'Signup failed';
       toast.error(msg);
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
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
=======
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
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
<<<<<<< HEAD
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <div className="input-container">
              <Mail className="field-icon" size={18} />
              <input
                type="email"
                name="email"
                className="input-field input-with-icon"
                placeholder="email@example.com"
=======
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                className="glass-input"
                placeholder="name@example.com"
<<<<<<< HEAD
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
            <div className="input-container">
              <Mail className="field-icon" size={18} />
              <input
                type="email"
                name="email"
                className="input-field input-with-icon"
                placeholder="email@example.com"
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
          <div className="form-group">
            <label>Profile Image (Optional)</label>
            <label style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', 
              padding: '0.75rem', background: '#0d1117', borderRadius: '8px', border: '1px dashed var(--border-color)' 
            }}>
              <UploadCloud size={18} color="var(--primary-color)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {formData.image ? formData.image.name : 'Select image'}
<<<<<<< HEAD
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
=======
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
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
<<<<<<< HEAD
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
            </label>
          </div>

          <div className="form-group">
            <label>Password</label>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <div className="input-container">
              <Lock className="field-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field input-with-icon"
                placeholder="Password"
=======
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="glass-input"
                placeholder="Create a password"
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="glass-input"
                placeholder="Create a password"
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
            <div className="input-container">
              <Lock className="field-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field input-with-icon"
                placeholder="Password"
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
                value={formData.password}
                onChange={handleChange}
                required
              />
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
=======
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
<<<<<<< HEAD
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <div className="input-container">
              <Lock className="field-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="input-field input-with-icon"
                placeholder="Confirm"
=======
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="glass-input"
                placeholder="Repeat password"
<<<<<<< HEAD
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
            <div className="input-container">
              <Lock className="field-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="input-field input-with-icon"
                placeholder="Confirm"
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
=======
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
<<<<<<< HEAD
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login</Link>
<<<<<<< HEAD
=======
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
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
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
>>>>>>> 0e48a9f (feat: implement user authentication pages for signup and login with form validation and API integration)
=======
>>>>>>> 5c4f604 (feat: implement frontend pages and components for Saraha application authentication and dashboard)
        </p>
      </div>
    </div>
  );
};

export default Signup;
