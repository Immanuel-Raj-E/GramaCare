import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gramacare_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('gramacare_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            setToken(storedToken);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error('Session restoration failed:', err);
          handleLogout();
        }
      } else {
        // Seamless Demo Mode: Auto-authenticate default demo role if visiting portal directly
        const path = window.location.pathname;
        if (path.startsWith('/doctor')) {
          await handleLogin('dr_sharma@ruralhealth.org', 'Password@123');
        } else if (path.startsWith('/admin')) {
          await handleLogin('admin@gramacare.org', 'Admin@12345');
        } else if (path.startsWith('/patient')) {
          await handleLogin('ramesh_patel@ruralhealth.org', 'Password@123');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        const { user: userData, profile: profileData, token: jwtToken } = res.data;
        setUser(userData);
        setProfile(profileData);
        setToken(jwtToken);
        localStorage.setItem('gramacare_token', jwtToken);
        localStorage.setItem('gramacare_user', JSON.stringify(userData));
        setLoading(false);
        return { success: true, user: userData };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setAuthError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authService.register(formData);
      if (res.success && res.data) {
        const { user: userData, profile: profileData, token: jwtToken } = res.data;
        setUser(userData);
        setProfile(profileData);
        setToken(jwtToken);
        localStorage.setItem('gramacare_token', jwtToken);
        localStorage.setItem('gramacare_user', JSON.stringify(userData));
        setLoading(false);
        return { success: true, user: userData };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setAuthError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('gramacare_token');
    localStorage.removeItem('gramacare_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        authError,
        isAuthenticated: !!token && !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
