import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data.data.user);
      return res.data.data.user;
    } catch (error) {
      console.error("Fetch profile failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await fetchProfile();
        } catch (error) {
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

  const loginContext = async (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if(refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
    // Wait for profile fetch to ensure state is ready before redirection
    return await fetchProfile();
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
