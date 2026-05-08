import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiSend, FiUploadCloud, FiUser, FiShield, FiInfo } from 'react-icons/fi';

const PublicProfile = () => {
  const { receiverId } = useParams();
  const [receiver, setReceiver] = useState(null);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch receiver info to show their name/pic
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await api.get(`/user?id=${receiverId}`);
        if (res.data?.data?.user) {
          setReceiver(res.data.data.user);
        }
      } catch (err) {
        console.error("Could not fetch receiver info");
      }
    };
    if (receiverId) fetchReceiver();
  }, [receiverId]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 2);
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Message content cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('content', content);
      files.forEach((file) => data.append('attachments', file));

      await api.post(`/message/${receiverId}/anoymouns`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess(true);
      toast.success("Message sent anonymously!");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '70vh' }}>
        <div className="glass-panel text-center" style={{ padding: '4rem 2rem', width: '100%', maxWidth: '550px' }}>
          <div className="primary-gradient" style={{ width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <FiShield size={45} color="white" />
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Sent Successfully!</h2>
          <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Your anonymous feedback has been delivered safely. They will never know it was you.
          </p>
          <button onClick={() => { setSuccess(false); setContent(''); setFiles([]); }} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '3.5rem 2.5rem' }}>
        
        {/* Receiver Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
            <div style={{ 
              width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
              border: '3px solid var(--primary-color)', background: 'var(--bg-dark)' 
            }}>
              {receiver?.profilePic ? (
                <img src={receiver.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiUser size={40} color="var(--text-secondary)" />
                </div>
              )}
            </div>
            <div className="primary-gradient" style={{ position: 'absolute', bottom: 0, right: 0, padding: '6px', borderRadius: '50%', border: '3px solid var(--bg-dark)' }}>
               <FiShield size={14} color="white" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Send to {receiver?.userName || 'Anonymous User'}</h2>
          <p className="text-secondary">Be honest, be kind, stay anonymous.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="flex flex-col gap-xs">
            <textarea
              className="glass-input"
              rows={6}
              placeholder="Start typing your honest feedback here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ resize: 'none', fontSize: '1.1rem', lineHeight: '1.6' }}
            ></textarea>
            <div className="flex items-center gap-xs text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
               <FiInfo size={14} />
               <span>Messages are end-to-end encrypted and 100% private.</span>
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', 
              padding: '1.2rem', background: 'rgba(255,255,255,0.02)', 
              borderRadius: '16px', border: '1px dashed var(--glass-border)',
              transition: 'var(--transition)'
            }} className="hover-glow">
              <div className="primary-gradient" style={{ padding: '8px', borderRadius: '8px' }}>
                <FiUploadCloud size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Attach Files</div>
                <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Upload images (Optional, max 2)</div>
              </div>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
            {files.length > 0 && (
              <div style={{ marginTop: '0.8rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', fontSize: '0.9rem', display: 'inline-block' }}>
                {files.length} file(s) ready to send
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '1.2rem', fontSize: '1.2rem', width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Sending Securely...' : (
              <>
                <FiSend size={22} />
                Send Anonymous Message
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '3rem', textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
            Want to receive your own anonymous messages? 
            <a href="/signup" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none', marginLeft: '0.5rem' }}>Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
