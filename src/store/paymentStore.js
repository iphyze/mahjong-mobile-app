// src/store/paymentStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const usePaymentStore = create((set, get) => {

    setTimeout(async () => {
        const store = get();
        await store.fetchUsersPayment();
    }, 0);

    return {
        // Add state for user Payment
    userPayment: [],
    isLoading: false,
    error: null,

    // Reset Payment state
    resetPayment: () => {
        set({
            userPayment: [],
            isLoading: false,
            error: null
        });
    },

    // Fetch user Payment
    fetchUsersPayment: async () => {
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

            const response = await api.get(`/payment/getSinglePayment/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );

            if (response.status === 200) {
                set({ 
                    userPayment: response.data?.data,
                    isLoading: false 
                });
                // console.log(response.data);
                return true;
            } else {
                set({ 
                    error: 'Failed to fetch Payment',
                    isLoading: false 
                });
                return false;
            }
        } catch (error) {
            console.error('Error fetching Payment:', error);
            set({ 
                error: error.message || 'Failed to fetch Payment',
                isLoading: false 
            });
            return false;
        }
    },


    
    }
});