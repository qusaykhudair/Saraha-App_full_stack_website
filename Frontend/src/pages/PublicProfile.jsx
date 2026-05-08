import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, UploadCloud, CheckCircle2, MessageCircle } from 'lucide-react';

const PublicProfile = () => {
  const { receiverId } = useParams();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <div style={{ color: 'var(--success-color)', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Message Sent!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Your honest feedback has been successfully and anonymously delivered. They will never know who sent it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => { setSuccess(false); setContent(''); setFiles([]); }} className="btn btn-primary" style={{ width: '100%' }}>
              Send Another Message
            </button>
            <Link to="/signup" className="btn btn-secondary" style={{ width: '100%' }}>
              Get Your Own Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ background: '#21262d', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
          <MessageCircle size={40} />
        </div>

        <h2 style={{ marginBottom: '0.5rem' }}>Send a Secret Message</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Be honest, be kind, and stay anonymous.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label>Your Message</label>
            <textarea
              className="input-field"
              rows={6}
              placeholder="What's on your mind? Don't worry, it's anonymous..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ resize: 'none', lineHeight: '1.6' }}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Attachments (Optional - Max 2)</label>
            <label style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', 
              padding: '1rem', background: '#0d1117', borderRadius: '8px', border: '1px dashed var(--border-color)', transition: 'var(--transition)' 
            }} className="file-label-hover">
              <UploadCloud size={20} color="var(--primary-color)" />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {files.length > 0 ? `${files.length} file(s) selected` : 'Click to attach images'}
              </span>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', height: '55px', marginTop: '1rem', fontSize: '1.05rem' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : (
              <>
                <Send size={18} /> Send Message
              </>
            )}
          </button>
        </form>

        <style dangerouslySetInnerHTML={{ __html: `
          .file-label-hover:hover { border-color: var(--primary-color); background: rgba(88, 101, 242, 0.05); }
        `}} />
      </div>
    </div>
  );
};

export default PublicProfile;
