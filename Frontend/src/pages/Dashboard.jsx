import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiCopy, FiLink, FiRefreshCcw, FiImage, FiTrash2, FiX, FiMaximize2, FiSend, FiInbox } from 'react-icons/fi';
import moment from 'moment';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const userId = user?._id || user?.id || user?.sub || '';  
  const shareLink = `${window.location.origin}/u/${userId}`;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/message');
      if (res.data?.data?.messages) {
        setMessages(res.data.data.messages);
      }
    } catch (error) {
       const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to load messages';
       toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await api.delete(`/message/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      toast.success('Message deleted successfully');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to delete message';
      toast.error(errorMsg);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    let normalizedPath = path;
    if (!path.startsWith('/')) normalizedPath = '/' + path;
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiBaseUrl.replace('/api', '') || window.location.origin;
    return `${baseUrl}/uploads${normalizedPath}`;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(15, 23, 42, 0.95)', zIndex: 2000, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', zIndex: 2001 }}>
            <FiX size={28} />
          </button>
          <img 
            src={selectedImage} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', boxShadow: '0 0 50px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Hero / Header */}
      <div className="flex flex-col items-center" style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1rem' }}>
        <h2 className="text-gradient" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '0.8rem' }}>Your Inbox</h2>
        <p className="text-secondary" style={{ fontSize: '1rem', marginBottom: '2rem', maxWidth: '600px' }}>
          Manage your anonymous messages and share your profile link.
        </p>

        <div className="glass-panel flex-mobile-col items-center justify-between" style={{ padding: '1rem', width: '100%', maxWidth: '650px', gap: '1rem' }}>
          <div className="flex items-center gap-sm text-secondary" style={{ width: '100%', minWidth: 0 }}>
            <div className="primary-gradient" style={{ padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
               <FiLink size={18} color="white" />
            </div>
            <span style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>{shareLink}</span>
          </div>
          <button onClick={handleCopyLink} className="btn btn-primary full-width-mobile" style={{ flexShrink: 0 }}>
            <FiCopy size={16} /> Copy
          </button>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px', marginTop: '2rem' }}>
        <div className="glass-panel" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem 1.5rem', 
          marginBottom: '1.5rem',
          borderRadius: '16px'
        }}>
          <div className="flex items-center gap-sm">
             <div className="primary-gradient" style={{ width: '10px', height: '10px', borderRadius: '50%' }}></div>
             <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Inbox ({messages.length})</h3>
          </div>
          <button 
            onClick={fetchMessages} 
            className="btn btn-secondary" 
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '10px' }}
          >
            <FiRefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center" style={{ padding: '4rem 0' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '4rem 1.5rem' }}>
            <FiInbox size={40} className="text-secondary" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Empty Inbox</h4>
            <p className="text-secondary">Share your link to get feedback!</p>
          </div>
        ) : (
          <div className="grid" style={{ gap: '1rem' }}>
            {messages.map((msg, index) => (
              <div key={msg._id} className="glass-panel animate-fade-in" style={{ 
                padding: '1.5rem', 
                position: 'relative',
                animationDelay: `${index * 0.05}s` 
              }}>
                <button 
                  onClick={() => handleDeleteMessage(msg._id)}
                  style={{ 
                    position: 'absolute', top: '15px', right: '15px', 
                    background: 'rgba(239, 68, 68, 0.1)', border: 'none', 
                    color: 'var(--error)', padding: '8px', borderRadius: '10px' 
                  }}
                >
                  <FiTrash2 size={18} />
                </button>

                <div className="flex items-center gap-sm" style={{ marginBottom: '1rem', paddingRight: '40px' }}>
                   <div className="primary-gradient" style={{ width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiSend size={16} color="white" />
                   </div>
                   <div>
                      <div style={{ fontWeight: '600', fontSize: '1rem' }}>Anonymous</div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{moment(msg.createdAt).fromNow()}</div>
                   </div>
                </div>
                
                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#e2e8f0', wordBreak: 'break-word' }}>
                  {msg.content}
                </p>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                       {msg.attachments.map((file, idx) => (
                         <div key={idx} style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }} onClick={() => setSelectedImage(getFullImageUrl(file))}>
                            <img 
                              src={getFullImageUrl(file)} 
                              alt="Attachment" 
                              style={{ width: '100px', height: '80px', objectFit: 'cover' }} 
                            />
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
