import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import VerifyOtp from './pages/VerifyOtp';
import { Toaster } from 'react-hot-toast';

// Component to protect routes that only guests (logged out) should see
const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Component to protect routes that only logged-in users should see
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Navbar />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Guest Only Routes */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Public Messaging Page */}
          <Route path="/u/:receiverId" element={<PublicProfile />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
