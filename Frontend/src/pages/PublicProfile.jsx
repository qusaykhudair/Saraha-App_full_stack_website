import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiSend, FiUploadCloud, FiUser, FiShield, FiInfo, FiCheckCircle } from 'react-icons/fi';

const PublicProfile = () => {
  const { receiverId } = useParams();
  const [receiver, setReceiver] = useState(null);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh' }}>
        <div className="glass-panel text-center shadow-premium" style={{ padding: '5rem 3rem', width: '100%', maxWidth: '550px' }}>
          <div className="primary-gradient" style={{ width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', boxShadow: '0 10px 30px rgba(124, 77, 255, 0.4)' }}>
            <FiCheckCircle size={50} color="white" />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>Message Sent!</h2>
          <p className="text-secondary" style={{ fontSize: '1.15rem', marginBottom: '3rem', lineHeight: '1.7' }}>
            Your anonymous feedback has been delivered successfully. Thank you for your honesty!
          </p>
          <div className="flex flex-col gap-md">
            <button onClick={() => { setSuccess(false); setContent(''); setFiles([]); }} className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem' }}>
              Send Another Message
            </button>
            <Link to="/" className="text-secondary hover-glow" style={{ textDecoration: 'none', fontWeight: '600' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ padding: '4rem 0', minHeight: '85vh' }}>
      <div className="glass-panel shadow-premium" style={{ width: '100%', maxWidth: '700px', padding: '4rem 3rem' }}>
        
        {/* Receiver Profile Section */}
        <div className="flex flex-col items-center" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
              border: '4px solid var(--primary-color)', background: 'var(--bg-dark)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              {receiver?.profilePic ? (
                <img src={receiver.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiUser size={50} color="var(--text-secondary)" />
                </div>
              )}
            </div>
            <div className="primary-gradient" style={{ position: 'absolute', bottom: '5px', right: '5px', padding: '8px', borderRadius: '50%', border: '3px solid var(--bg-dark)' }}>
               <FiShield size={16} color="white" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>{receiver?.userName || 'Anonymous User'}</h2>
          <div className="flex items-center gap-xs text-secondary" style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1.2rem', borderRadius: '30px' }}>
             <FiShield size={16} color="var(--success)" />
             Trusted Identity
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
          <div className="flex flex-col gap-md">
            <div style={{ position: 'relative' }}>
              <textarea
                className="glass-input"
                rows={7}
                placeholder={`Leave a constructive message for ${receiver?.userName || 'this user'}...`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ 
                  resize: 'none', 
                  fontSize: '1.15rem', 
                  lineHeight: '1.7', 
                  padding: '1.5rem',
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.02)'
                }}
              ></textarea>
              <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', opacity: 0.3 }}>
                <FiInfo size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-1" style={{ gap: '1.5rem' }}>
            <label className="upload-container">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <div className="flex items-center justify-between" style={{ width: '100%' }}>
                <div className="flex items-center gap-md">
                  <div className="primary-gradient icon-box">
                    <FiUploadCloud size={22} color="white" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>Attach Images</div>
                    <div className="text-secondary" style={{ fontSize: '0.85rem' }}>Optional, max 2 files</div>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="file-badge">{files.length} Selected</div>
                )}
              </div>
            </label>
<br />
    <p className="text-secondary" style={{ fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
               <FiShield size={14} /> Your identity will remain 100% hidden.
            </p>
            <br />
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: '1.3rem', fontSize: '1.2rem', borderRadius: '18px', width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-sm">
                  <div className="animate-spin" style={{ width: '20px', height: '20px', border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                  Sending Securely...
                </div>
              ) : (
                <>
                  <FiSend size={22} />
                  Send Anonymous Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .shadow-premium {
          box-shadow: 0 30px 100px rgba(0,0,0,0.6), 0 0 40px rgba(124, 77, 255, 0.05);
        }
        .upload-container {
          cursor: pointer;
          padding: 1.2rem 1.5rem;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          border: 1px dashed var(--glass-border);
          transition: var(--transition);
        }
        .upload-container:hover {
          background: rgba(255,255,255,0.06);
          border-color: var(--primary-color);
          transform: translateY(-2px);
        }
        .icon-box {
          padding: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .file-badge {
          background: var(--success);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
};

export default PublicProfile;
