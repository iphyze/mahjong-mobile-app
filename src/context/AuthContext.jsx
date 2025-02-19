// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useToast } from './ToastContext';


const AuthContext = createContext(null);

// Create the hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
  // const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [user, setUser] = useState(null); // Changed from [] to null for better type safety
  const { showToast } = useToast();


  // Check if user has completed onboarding
  const checkOnboardingStatus = async () => {
    try {
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      setHasOnboarded(!!onboarded);
      return !!onboarded;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };


  const checkUserStatus = async (userId, token) => {
    try {
      // console.log('Checking user status with:', { userId, token }); // Debug log
  
      const response = await api.get(`/users/getSingleUser/${String(userId)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // console.log('API Response:', response.data); // Debug log
  
      if (response.status === 200) {
        setUser(response.data?.data);
        // console.log('User data set:', response.data?.data); // Debug log
        return true;
      }else{
        showToast('Please login again!', 'error'); // Debug log
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('User status check error:', error.response?.data || error.message); // Enhanced error log
      showToast('Please login again!', 'error');
      setUser(null);
      return false;
    }
  };
  
  const checkAuthStatus = async () => {
    // await AsyncStorage.cnlear();

    try {
      const isOnboarded = await checkOnboardingStatus();
      if (!isOnboarded) {
        setIsAuthenticated(false);
        return;
      }
      
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      
      // console.log('Stored credentials:', { token, userId, onboarded });
  
      if (token && userId) {
        // Validate stored credentials
        const isValidUser = await checkUserStatus(userId, token);
        if (isValidUser) {
          setIsAuthenticated(true);
          return;
        }
        // If validation fails, logout
        await logout();
      }
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Auth check error:', error);
      await logout();
    } finally {
      // setIsLoading(false);
    }
  };


  const login = async (token, userId, userData) => {
    try {
      // console.log('Storing token and userId:', { token, userId });
      await AsyncStorage.setItem('token', String(token));
      await AsyncStorage.setItem('userId', String(userId));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      // console.error('Login error:', error);
      showToast('Login failed', 'error');
      return false;
    }
  };
  

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Logout failed', 'error');
    }
  };

  // Add a method to update user data
  const updateUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (userId && token) {
        await checkUserStatus(userId, token);
      }
    } catch (error) {
      console.error('Update user data error:', error);
    }
  };


  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      setHasOnboarded(true);
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };


  // useEffect(() => {
  //   checkAuthStatus();
  //   checkOnboardingStatus();
  // }, []);

  useEffect(() => {
    const initializeApp = async () => {
      await checkOnboardingStatus();
      await checkAuthStatus(); 
    }
    initializeApp();
  }, []);


  return (
    <AuthContext.Provider 
      value={{ 
        // isLoading,
        isAuthenticated,
        hasOnboarded,
        user,
        login,
        logout,
        completeOnboarding,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};