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
            alignItems: 'center', justifyContent: 'center', padding: '2rem',
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '10px', borderRadius: '50%' }}>
            <FiX size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '16px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Hero / Header */}
      <div className="flex flex-col items-center" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Your Inbox</h2>
        <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
          Manage your anonymous messages and share your profile link with others.
        </p>

        <div className="glass-panel flex items-center justify-between" style={{ padding: '1rem 1.5rem', width: '100%', maxWidth: '650px', gap: '1.5rem' }}>
          <div className="flex items-center gap-sm text-secondary" style={{ flex: 1, minWidth: 0 }}>
            <div className="primary-gradient" style={{ padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
               <FiLink size={20} color="white" />
            </div>
            <span style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareLink}</span>
          </div>
          <button onClick={handleCopyLink} className="btn btn-primary" style={{ flexShrink: 0 }}>
            <FiCopy size={18} /> Copy Link
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', marginTop: '3rem' }}>
        <div className="flex justify-between items-center mb-xl">
          <div className="flex items-center gap-sm">
             <div className="primary-gradient" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
             <h3 style={{ fontSize: '1.8rem' }}>Messages ({messages.length})</h3>
          </div>
          <button onClick={fetchMessages} className="btn btn-secondary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }}>
            <FiRefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center" style={{ padding: '5rem 0' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '6rem 2rem' }}>
            <div className="primary-gradient" style={{ width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', opacity: 0.8 }}>
              <FiInbox size={40} color="white" />
            </div>
            <h4 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Empty Inbox</h4>
            <p className="text-secondary" style={{ fontSize: '1.1rem' }}>No messages yet. Share your link to start receiving feedback!</p>
          </div>
        ) : (
          <div className="grid" style={{ gap: '1.5rem' }}>
            {messages.map((msg, index) => (
              <div key={msg._id} className="glass-panel animate-fade-in" style={{ 
                padding: '2rem', 
                position: 'relative',
                animationDelay: `${index * 0.1}s` 
              }}>
                <button 
                  onClick={() => handleDeleteMessage(msg._id)}
                  style={{ 
                    position: 'absolute', top: '20px', right: '20px', 
                    background: 'rgba(239, 68, 68, 0.1)', border: 'none', 
                    color: 'var(--error)', cursor: 'pointer', padding: '10px', 
                    borderRadius: '12px', transition: 'var(--transition)' 
                  }}
                  className="hover-glow"
                >
                  <FiTrash2 size={20} />
                </button>

                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', paddingRight: '50px' }}>
                  <div className="flex items-center gap-sm">
                     <div className="primary-gradient" style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiSend size={18} color="white" />
                     </div>
                     <div>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Anonymous User</div>
                        <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{moment(msg.createdAt).fromNow()}</div>
                     </div>
                  </div>
                </div>
                
                <p style={{ fontSize: '1.2rem', lineHeight: '1.7', color: '#e2e8f0', marginBottom: msg.attachments?.length > 0 ? '1.5rem' : '0' }}>
                  {msg.content}
                </p>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <div className="flex gap-sm items-center text-secondary" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <FiImage size={16} /> Attached Files ({msg.attachments.length})
                    </div>
                    <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
                       {msg.attachments.map((file, idx) => (
                         <div key={idx} style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: '12px' }} onClick={() => setSelectedImage(getFullImageUrl(file))}>
                            <img 
                              src={getFullImageUrl(file)} 
                              alt="Attachment" 
                              style={{ 
                                width: '180px', 
                                height: '140px', 
                                objectFit: 'cover', 
                                transition: 'var(--transition)',
                                background: 'rgba(0,0,0,0.2)'
                              }} 
                              className="hover-glow"
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '6px' }}>
                              <FiMaximize2 size={14} color="white" />
                            </div>
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
