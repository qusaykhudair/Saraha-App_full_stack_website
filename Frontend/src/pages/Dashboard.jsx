import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Copy, Link as LinkIcon, RefreshCcw, Image as ImageIcon } from 'lucide-react';
import moment from 'moment';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine user ID (depends on jwt payload structure, usually id or _id or sub)
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
       toast.error('Failed to load messages');
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

  const getFullImageUrl = (path) => {
    if (!path) return '';
    // If the path already has http, return it
    if (path.startsWith('http')) return path;
    // Connect to backend uploads securely by formatting path correctly
    let normalizedPath = path;
    if (!path.startsWith('/')) normalizedPath = '/' + path;
    return `http://localhost:3000${normalizedPath}`;
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="flex flex-col items-center mb-xl" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>
          Welcome Home!
        </h2>
        <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-lg)' }}>
          Share your link with friends to receive anonymous feedback.
        </p>

        <div className="glass-panel flex items-center justify-between" style={{ padding: 'var(--spacing-md)', width: '100%', maxWidth: '600px', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="flex items-center gap-sm text-secondary" style={{ wordBreak: 'break-all', flex: 1 }}>
            <LinkIcon size={18} />
            <span style={{ fontWeight: '500' }}>{shareLink}</span>
          </div>
          <button onClick={handleCopyLink} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <Copy size={16} /> Copy
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="flex justify-between items-center mb-md">
          <h3 style={{ fontSize: '1.8rem' }}>Inbox ({messages.length})</h3>
          <button onClick={fetchMessages} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '50%' }} title="Refresh Messages">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center" style={{ padding: '3rem 0' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '4rem 2rem', marginTop: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)' }}>
              <RefreshCcw size={32} className="text-secondary" />
            </div>
            <h4 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>No messages yet!</h4>
            <p className="text-secondary">Share your link to start receiving anonymous feedback from others.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {messages.map((msg) => (
              <div key={msg._id} className="glass-panel" style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>Anonymous</span>
                  <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
                    {moment(msg.createdAt).fromNow()}
                  </span>
                </div>
                
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: msg.attachments && msg.attachments.length > 0 ? 'var(--spacing-md)' : '0' }}>
                  {msg.content}
                </p>

                {msg.attachments && msg.attachments.length > 0 && (
                  <div style={{ marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--card-border)', paddingTop: 'var(--spacing-md)' }}>
                    <div className="flex gap-sm items-center text-secondary" style={{ marginBottom: 'var(--spacing-sm)' }}>
                      <ImageIcon size={16} /> Attached Data ({msg.attachments.length})
                    </div>
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                       {msg.attachments.map((file, idx) => (
                         // If file is an image, display it. Otherwise provide a link
                         <a key={idx} href={getFullImageUrl(file.path || file)} target="_blank" rel="noreferrer" style={{ display: 'inline-block', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                            <img 
                              src={getFullImageUrl(file.path || file)} 
                              alt={`attachment-${idx}`} 
                              style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block' }} 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                         </a>
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
