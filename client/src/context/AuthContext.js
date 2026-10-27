import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('imovies_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('imovies_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('imovies_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password, role });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('imovies_user', JSON.stringify(userData));
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('imovies_user');
    toast.info('Logged out successfully');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
