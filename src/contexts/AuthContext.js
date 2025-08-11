import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Set token in API client
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await apiClient.get('/user');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      delete apiClient.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/login', {
        email,
        password,
      });

      const { token, user: userData } = response.data;
      
      // Store token
      localStorage.setItem('auth_token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      toast.success('Login successful!');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const { token, user: userData } = response.data;
      
      localStorage.setItem('auth_token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      toast.success('Registration successful!');
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      delete apiClient.defaults.headers.common['Authorization'];
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};