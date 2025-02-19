// // src/store/authStore.js
// import { create } from 'zustand';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../services/api';
// import { useToast } from '../context/ToastContext';

// export const useAuthStore = create((set, get) => {
//   // Get toast function from context
//   const { showToast } = useToast();

//   return {
//     isLoading: true,
//     isAuthenticated: false,
//     hasOnboarded: false,
//     user: null,

//     checkUserStatus: async (userId, token) => {
//       try {
//         const response = await api.get(`/users/getSingleUser/${String(userId)}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.status === 200) {
//           set({ user: response.data?.data });
//           return true;
//         }
//         showToast('Please login again!', 'error');
//         set({ user: null });
//         return false;
//       } catch (error) {
//         console.error('User status check error:', error.response?.data || error.message);
//         showToast('Please login again!', 'error');
//         set({ user: null });
//         return false;
//       }
//     },

//     checkAuthStatus: async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userId = await AsyncStorage.getItem('userId');
//         const onboarded = await AsyncStorage.getItem('hasOnboarded');
        
//         set({ hasOnboarded: !!onboarded });

//         if (token && userId) {
//           const isValidUser = await get().checkUserStatus(userId, token);
//           if (isValidUser) {
//             set({ isAuthenticated: true });
//             return;
//           } else {
//             await get().logout();
//           }
//         }
//         set({ isAuthenticated: false });
//       } catch (error) {
//         await get().logout();
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     login: async (token, userId, userData) => {
//       try {
//         await AsyncStorage.setItem('token', String(token));
//         await AsyncStorage.setItem('userId', String(userId));
//         set({
//           user: userData,
//           isAuthenticated: true
//         });
//         return true;
//       } catch (error) {
//         showToast('Login failed', 'error');
//         return false;
//       }
//     },

//     logout: async () => {
//       try {
//         await AsyncStorage.multiRemove(['token', 'userId']);
//         set({
//           user: null,
//           isAuthenticated: false
//         });
//       } catch (error) {
//         console.error('Logout error:', error);
//         showToast('Logout failed', 'error');
//       }
//     },

//     updateUserData: async () => {
//       try {
//         const userId = await AsyncStorage.getItem('userId');
//         const token = await AsyncStorage.getItem('token');
//         if (userId && token) {
//           await get().checkUserStatus(userId, token);
//         }
//       } catch (error) {
//         console.error('Update user data error:', error);
//       }
//     },

//     completeOnboarding: async () => {
//       try {
//         await AsyncStorage.setItem('hasOnboarded', 'true');
//         set({ hasOnboarded: true });
//       } catch (error) {
//         console.error('Onboarding error:', error);
//       }
//     }
//   };
// });

// export default useAuthStore;