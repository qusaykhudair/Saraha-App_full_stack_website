import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Copy, RefreshCcw, Trash2, Maximize2, Share2, X } from 'lucide-react';
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
       const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to load messages';
       toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied!');
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/message/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiBaseUrl.replace('/api', '') || window.location.origin;
    return `${baseUrl}/uploads${path.startsWith('/') ? path : '/' + path}`;
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Simple Image Modal */}
      {selectedImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedImage(null)}>
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={32} /></button>
          <img src={selectedImage} alt="Enlarged" style={{ maxWidth: '95%', maxHeight: '90vh', borderRadius: '8px' }} />
        </div>
      )}

      {/* Profile Info Header */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img 
          src={getFullImageUrl(user?.profilePic) || `https://ui-avatars.com/api/?name=${user?.userName}`} 
          alt="profile" 
          style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid var(--primary-color)', marginBottom: '1rem', objectFit: 'cover' }}
        />
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {user?.userName}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Share your link to get anonymous messages</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: '#0d1117', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {shareLink}
          </div>
          <button onClick={handleCopyLink} className="btn btn-primary btn-sm">Copy Link</button>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Messages ({messages.length})</h3>
          <button onClick={fetchMessages} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Share2 size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No messages yet. Share your link!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg) => (
              <div key={msg._id} className="message-card" style={{ position: 'relative' }}>
                <button onClick={() => handleDeleteMessage(msg._id)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#f85149', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  {moment(msg.createdAt).fromNow()}
                </div>
                <p style={{ fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                
                {msg.attachments?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #30363d', paddingTop: '1rem' }}>
                    {msg.attachments.map((file, i) => (
                      <div key={i} style={{ width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => setSelectedImage(getFullImageUrl(file))}>
                        <img src={getFullImageUrl(file)} alt="attach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px' }}><Maximize2 size={12} color="white" /></div>
                      </div>
                    ))}
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
