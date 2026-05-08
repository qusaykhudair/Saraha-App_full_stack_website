import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Camera, Save, Phone, Mail, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userName: user?.userName || '',
    gender: user?.gender || 0,
    phoneNumber: user?.phoneNumber || ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName,
        gender: user.gender,
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch('/user/update-info', formData);
      setUser(res.data.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.patch('/user/upload-profile-picture', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.data.user);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div className="grid grid-2" style={{ maxWidth: '1000px', margin: '0 auto', alignItems: 'start' }}>
        
        {/* Left Card: Summary */}
        <div className="glass-panel text-center" style={{ padding: '3rem 2rem' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 1.5rem' }}>
            <div style={{ 
              width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
              border: '4px solid var(--primary-color)', boxShadow: '0 0 20px rgba(124, 77, 255, 0.3)' 
            }}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={60} color="var(--text-secondary)" />
                </div>
              )}
            </div>
            <label style={{ 
              position: 'absolute', bottom: '5px', right: '5px', 
              background: 'var(--primary-color)', width: '40px', height: '40px', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'var(--transition)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }} className="hover-glow">
              <Camera size={20} color="white" />
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {uploading && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
              </div>
            )}
          </div>
          
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{user?.userName}</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>{user?.email}</p>
          
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1rem' }}>
             <div className="flex items-center gap-sm" style={{ marginBottom: '0.8rem' }}>
                <Mail size={16} className="text-primary" />
                <span style={{ fontSize: '0.9rem' }}>{user?.email}</span>
             </div>
             <div className="flex items-center gap-sm">
                <Phone size={16} className="text-primary" />
                <span style={{ fontSize: '0.9rem' }}>{user?.phoneNumber || 'No phone added'}</span>
             </div>
          </div>
        </div>

        {/* Right Card: Edit Form */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Account Settings</h3>
          <form onSubmit={handleUpdateInfo} className="flex flex-col gap-md">
            
            <div className="flex flex-col gap-xs">
              <label className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Display Name</label>
              <input 
                type="text" 
                name="userName" 
                className="glass-input" 
                value={formData.userName} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Gender</label>
              <select 
                name="gender" 
                className="glass-input" 
                value={formData.gender} 
                onChange={handleInputChange}
                style={{ appearance: 'none' }}
              >
                <option value={0}>Male</option>
                <option value={1}>Female</option>
              </select>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Phone Number</label>
              <input 
                type="text" 
                name="phoneNumber" 
                className="glass-input" 
                placeholder="+20 123 456 7890"
                value={formData.phoneNumber} 
                onChange={handleInputChange} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
              {loading ? 'Saving Changes...' : (
                <>
                  <Save size={18} />
                  Save Profile
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
