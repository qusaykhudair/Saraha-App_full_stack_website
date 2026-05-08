import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Copy, Link as LinkIcon, RefreshCcw, Image as ImageIcon, Trash2, X, Maximize2, Share2 } from 'lucide-react';
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
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiBaseUrl.replace('/api', '') || window.location.origin;
    let normalizedPath = path;
    if (!path.startsWith('/')) normalizedPath = '/' + path;
    return `${baseUrl}/uploads${normalizedPath}`;
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Image Lightbox */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close"><X size={32} /></button>
          <img src={selectedImage} alt="Preview" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Hero / Profile Section */}
      <div className="glass-panel" style={{ marginTop: '2rem', padding: 'var(--spacing-xl)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))' }}></div>
        
        <div style={{ marginBottom: '1.5rem', display: 'inline-block', position: 'relative' }}>
          <img 
            src={getFullImageUrl(user?.profilePic) || `https://ui-avatars.com/api/?name=${user?.userName}&size=128&background=6366f1&color=fff`} 
            alt="Profile" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--bg-dark)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--success-color)', width: '20px', height: '20px', borderRadius: '50%', border: '3px solid var(--bg-dark)' }}></div>
        </div>

        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hi, <span className="text-gradient">{user?.userName}</span>!</h2>
        <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>You have received <strong style={{ color: 'white' }}>{messages.length}</strong> anonymous messages so far.</p>

        <div className="flex items-center justify-center gap-md mobile-stack" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="flex-1 input-wrapper" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.8rem 1.2rem', borderRadius: '15px', border: '1px solid var(--card-border)' }}>
             <LinkIcon size={18} className="text-secondary" style={{ marginRight: '0.75rem' }} />
             <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareLink}</span>
          </div>
          <button onClick={handleCopyLink} className="btn btn-primary" style={{ height: '50px', whiteSpace: 'nowrap' }}>
            <Copy size={18} /> Copy Link
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
        <div className="flex justify-between items-center mb-md">
          <h3 style={{ fontSize: '1.8rem' }}>Recent Messages</h3>
          <button onClick={fetchMessages} className="btn btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%' }} title="Refresh">
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center" style={{ padding: '4rem 0' }}>
            <div className="animate-spin" style={{ width: '45px', height: '45px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '5rem 2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Share2 size={40} className="text-secondary" />
            </div>
            <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>No messages yet!</h4>
            <p className="text-secondary">Share your link to start receiving anonymous feedback.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {messages.map((msg) => (
              <div key={msg._id} className="glass-panel message-card animate-fade-in" style={{ padding: 'var(--spacing-lg)', position: 'relative' }}>
                <button 
                  onClick={() => handleDeleteMessage(msg._id)}
                  className="delete-btn"
                  title="Delete message"
                >
                  <Trash2 size={18} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingRight: '40px' }}>
                  <div className="flex items-center gap-sm">
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Anonymous User</span>
                  </div>
                  <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{moment(msg.createdAt).fromNow()}</span>
                </div>
                
                <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: msg.attachments?.length > 0 ? '1.5rem' : '0' }}>
                  {msg.content}
                </p>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                       {msg.attachments.map((file, idx) => (
                         <div key={idx} className="attachment-thumb" onClick={() => setSelectedImage(getFullImageUrl(file.path || file))}>
                            <img src={getFullImageUrl(file.path || file)} alt="attachment" />
                            <div className="thumb-overlay"><Maximize2 size={16} /></div>
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
      
      {/* Style overrides for lightbox and extra components */}
      <style dangerouslySetInnerHTML={{ __html: `
        .lightbox-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; display: flex; items-center; justify-content: center; padding: 2rem; cursor: zoom-out; backdrop-filter: blur(8px); }
        .lightbox-close { position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: white; cursor: pointer; opacity: 0.7; transition: 0.3s; }
        .lightbox-close:hover { opacity: 1; transform: rotate(90deg); }
        .lightbox-img { max-width: 95%; max-height: 90vh; border-radius: 12px; box-shadow: 0 0 50px rgba(0,0,0,0.5); cursor: default; }
        
        .message-card { border-left: 4px solid transparent; transition: 0.3s; }
        .message-card:hover { border-left-color: var(--primary-color); background: rgba(30, 41, 59, 0.9); }
        
        .delete-btn { position: absolute; top: 1.25rem; right: 1.25rem; background: rgba(239, 68, 68, 0.1); border: none; color: var(--error-color); cursor: pointer; padding: 0.6rem; border-radius: 12px; transition: 0.3s; }
        .delete-btn:hover { background: var(--error-color); color: white; transform: scale(1.1); }
        
        .attachment-thumb { position: relative; width: 140px; height: 140px; border-radius: 12px; overflow: hidden; border: 1px solid var(--card-border); cursor: pointer; }
        .attachment-thumb img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .attachment-thumb:hover img { transform: scale(1.1); }
        .thumb-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .attachment-thumb:hover .thumb-overlay { opacity: 1; }
        
        @media (max-width: 768px) {
          .mobile-stack { flex-direction: column; }
          .attachment-thumb { width: 100%; height: 200px; }
        }
      `}} />
    </div>
  );
};

export default Dashboard;
