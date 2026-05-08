import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Fetch full profile info from backend to get latest data (userName, profilePic, etc)
          const res = await api.get('/user');
          setUser(res.data.data.user);
        } catch (error) {
          console.error("Auth init failed:", error);
          // If profile fetch fails but token exists, try decoding as fallback
          try {
            const decoded = jwtDecode(token);
            setUser(decoded);
          } catch (e) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginContext = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if(refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
    // After login, fetch full profile to ensure state has all fields
    api.get('/user').then(res => {
        setUser(res.data.data.user);
    }).catch(() => {
        const decoded = jwtDecode(accessToken);
        setUser(decoded);
    });
  };

  const logoutContext = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};
