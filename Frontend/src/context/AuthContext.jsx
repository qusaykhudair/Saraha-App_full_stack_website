import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Assuming payload has user id and other generic info
          setUser(decoded);
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginContext = (tokenData) => {
    localStorage.setItem('accessToken', tokenData.accessToken);
    if(tokenData.refreshToken) {
        localStorage.setItem('refreshToken', tokenData.refreshToken);
    }
    const decoded = jwtDecode(tokenData.accessToken);
    setUser(decoded);
  };

  const logoutContext = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};
