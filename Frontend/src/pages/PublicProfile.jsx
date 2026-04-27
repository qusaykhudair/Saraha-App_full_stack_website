import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, UploadCloud } from 'lucide-react';

const PublicProfile = () => {
  const { receiverId } = useParams();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      // Backend allows max 2 attachments
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
      
      files.forEach((file) => {
         data.append('attachments', file);
      });

      await api.post(`/message/${receiverId}/anoymouns`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-col items-center justify-center text-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel" style={{ padding: '4rem 2rem', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-lg)' }}>
            <Send size={40} className="text-success" color="var(--success-color)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>Message Sent!</h2>
          <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xl)' }}>
            Your honest feedback has been successfully and anonymously delivered.
          </p>
          <button onClick={() => { setSuccess(false); setContent(''); setFiles([]); }} className="btn btn-primary">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center" style={{ padding: 'var(--spacing-xl) 0' }}>
      <div className="glass-panel text-center" style={{ padding: 'var(--spacing-xl)', width: '100%', maxWidth: '600px' }}>
        
        <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-lg)', fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>
          ?
        </div>

        <h2 style={{ marginBottom: 'var(--spacing-xs)' }}>Leave a secret message!</h2>
        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
          They will never know who sent it! Feel free to be totally honest.
        </p>

        <form onSubmit={handleSubmit} className="text-left">
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <textarea
              className="glass-input"
              rows={5}
              placeholder="Start typing your anonymous message here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius)', border: '1px dashed var(--card-border)' }}>
              <UploadCloud size={20} className="text-primary" />
              <span className="text-secondary">Attach files (Max 2 images)</span>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            {files.length > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--success-color)' }}>
                {files.length} file(s) selected
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span> : (
              <>
                <Send size={20} />
                Send Message Securely
              </>
            )}
          </button>
        </form>

        <p className="text-secondary" style={{ marginTop: 'var(--spacing-lg)', fontSize: '0.9rem' }}>
          Want to receive your own anonymous messages? <a href="/signup" className="text-primary">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default PublicProfile;
