// src/store/apphistorytore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const useHistoryStore = create((set, get) => {

    setTimeout(async () => {
        const store = get();
        await store.fetchUsersHistory();
    }, 0);

    return {
        // Add state for user history
    userHistory: [],
    isLoading: false,
    error: null,

    // Reset history state
    resetHistory: () => {
        set({
            userHistory: [],
            isLoading: false,
            error: null
        });
    },

    // Fetch user history
    fetchUsersHistory: async () => {
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

            const response = await api.get(`/games/getUserPairing/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );

            if (response.status === 200) {
                set({ 
                    userHistory: response.data,
                    isLoading: false 
                });
                // console.log(response.data);
                return true;
            } else {
                set({ 
                    error: 'Failed to fetch history',
                    isLoading: false 
                });
                return false;
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            set({ 
                error: error.message || 'Failed to fetch history',
                isLoading: false 
            });
            return false;
        }
    },


    
    }
});