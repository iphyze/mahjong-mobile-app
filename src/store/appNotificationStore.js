// src/store/appNotificationStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const useAppNotificationStore = create((set, get) => {

    setTimeout(async () => {
        const store = get();
        await store.fetchUsersNotification();
    }, 0);

    return {
        // Add state for user notifications
    userNotifications: [],
    isLoading: false,
    error: null,

    // Reset notifications state
    resetNotifications: () => {
        set({
            userNotifications: [],
            isLoading: false,
            error: null
        });
    },

    // Fetch user notifications
    fetchUsersNotification: async () => {
        set({ isLoading: true, error: null });
        
        try {
            const userId = await AsyncStorage.getItem('userId');
            const authToken = await AsyncStorage.getItem('token');
            
            if (!userId || !authToken) {
                set({ 
                    error: 'No user credentials found',
                    isLoading: false 
                });
                return false;
            }

            const response = await api.get(`/users/notifications/getNotifications/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );

            if (response.status === 200) {
                set({ 
                    userNotifications: response.data.data,
                    isLoading: false 
                });
                // console.log(response.data.data);
                return true;
            } else {
                set({ 
                    error: 'Failed to fetch notifications',
                    isLoading: false 
                });
                return false;
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            set({ 
                error: error.message || 'Failed to fetch notifications',
                isLoading: false 
            });
            return false;
        }
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const authToken = await AsyncStorage.getItem('token');

            if (!userId || !authToken) return false;

            const response = await api.post(
                '/users/notifications/status',
                { notificationId, userId },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );

            if (response.status === 200) {
                set(state => ({
                    userNotifications: state.userNotifications.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, isRead: true }
                            : notification
                    )
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return false;
        }
    },

    // Get unread notifications count
    getUnreadCount: () => {
        const { userNotifications } = get();
        return userNotifications.filter(notification => !notification.isRead).length;
    },
    }
    
});