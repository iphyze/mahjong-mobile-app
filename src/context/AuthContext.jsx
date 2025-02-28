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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [user, setUser] = useState(null);
  const { showToast } = useToast();
  const [authToken, setAuthToken] = useState(null)


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
        showToast(error.response?.data || error.message || 'Session expired please login first!', 'error'); // Debug log
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('User status check error:', error.response?.data || error.message); // Enhanced error log
      showToast(error.response?.data || error.message || 'Session expired please login first!', 'error');
      setUser(null);
      return false;
    }
  };
  
  const checkAuthStatus = async () => {
    // await AsyncStorage.clear();
    // await clearNotificationSettings();

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
        setAuthToken(token); // Set the token in state
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
      setIsLoading(false);
    }
  };


  const clearNotificationSettings = async (userId, token) => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('hasPromptedForNotifications');
      
      // Clear push token from database
      await api.post('/users/notifications/update-push-token', 
        { 
          userId: userId,
          expoPushToken: null 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      // Reset local notification state
      set({ 
        isEnabled: false, 
        expoPushToken: null 
      });
  
      // Optionally, you can also reset notification permissions
      // Note: On iOS, you cannot programmatically reset permissions
      if (Platform.OS === 'android') {
        await Notifications.dismissAllNotificationsAsync();
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
  
    } catch (error) {
      console.error('Error clearing notification settings:', error);
    }
  };

  const login = async (token, userId, userData) => {
    try {
      // console.log('Storing token and userId:', { token, userId });
      await AsyncStorage.setItem('token', String(token));
      await AsyncStorage.setItem('userId', String(userId));
      setAuthToken(token); // Set the token in state
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
      setAuthToken(null); // Set the token in state
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
      setAuthToken(token); // Set the token in state
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
        isLoading,
        isAuthenticated,
        hasOnboarded,
        user,
        token: authToken,
        login,
        logout,
        completeOnboarding,
        checkAuthStatus,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};