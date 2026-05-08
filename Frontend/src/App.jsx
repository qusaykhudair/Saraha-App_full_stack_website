import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import VerifyOtp from './pages/VerifyOtp';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '100vh' }}>
        <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  // Component to protect routes from unauthenticated users
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  // Component to protect routes from authenticated users (Guest only)
  const GuestRoute = ({ children }) => {
    if (user) return <Navigate to="/dashboard" />;
    return children;
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <Navbar />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={
            <GuestRoute><Login /></GuestRoute>
          } />
          <Route path="/signup" element={
            <GuestRoute><Signup /></GuestRoute>
          } />
          <Route path="/verify-otp" element={
            <GuestRoute><VerifyOtp /></GuestRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          
          <Route path="/u/:receiverId" element={<PublicProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
