import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useAppNotificationStore } from './appNotificationStore';

export const useNotificationStore = create((set, get) => ({
    isEnabled: false,
    expoPushToken: null,
    notificationListener: null,
    responseListener: null,

    configureNotifications: async (navigation = null) => {
        try {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });

            // Clean up existing listeners
            if (get().notificationListener) {
                Notifications.removeNotificationSubscription(get().notificationListener);
            }
            if (get().responseListener) {
                Notifications.removeNotificationSubscription(get().responseListener);
            }

            const notificationListener = Notifications.addNotificationReceivedListener(
                notification => {
                    console.log('Notification received in foreground:', notification);
                    // Trigger a refresh of the notifications list
                    useAppNotificationStore.getState().fetchUsersNotification();
                }
            );

            const responseListener = Notifications.addNotificationResponseReceivedListener(
                response => {
                    console.log('User interacted with notification:', response);

                    // Trigger a refresh of the notifications list
                    useAppNotificationStore.getState().fetchUsersNotification();
                    
                    // Only navigate if navigation object is provided
                    if (navigation) {
                        navigation.navigate('Main', { screen: 'Notifications' });
                    }
                }
            );

            set({ 
                notificationListener, 
                responseListener 
            });
        } catch (error) {
            console.error('Error configuring notifications:', error);
        }
    },


    getExpoPushToken: async () => {
        if (!Device.isDevice) return null;
        
        try {
            const token = await Notifications.getExpoPushTokenAsync({
                projectId: "95bbb45e-1d9b-4fba-9679-f193bc2cf8d8",
            });
            return token.data;
        } catch (error) {
            console.error('Error getting push token:', error);
            return null;
        }
    },

    initializeNotifications: async () => {
        try {
            const hasPrompted = await AsyncStorage.getItem('hasPromptedForNotifications');
            
            if (!hasPrompted) {
                await get().requestPermissions();
            } else {
                const notificationEnabled = await AsyncStorage.getItem('notificationsEnabled');
                const savedIsEnabled = notificationEnabled === 'true';
                
                let token = null;
                if (savedIsEnabled && Device.isDevice) {
                    const { status } = await Notifications.getPermissionsAsync();
                    if (status === 'granted') {
                        token = await get().getExpoPushToken();
                    }
                }
                
                set({ 
                    isEnabled: savedIsEnabled, 
                    expoPushToken: token 
                });
            }

            // Configure basic notification handling without navigation
            await get().configureNotifications();

        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    },

    cleanup: () => {
        if (get().notificationListener) {
            Notifications.removeNotificationSubscription(get().notificationListener);
        }
        if (get().responseListener) {
            Notifications.removeNotificationSubscription(get().responseListener);
        }
        set({ 
            notificationListener: null, 
            responseListener: null 
        });
    },

    updateServerWithToken: async (token, enabled) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const authToken = await AsyncStorage.getItem('token');
            
            if (userId && authToken) {
                await api.post('/users/notifications/update-push-token', 
                    {
                        userId, 
                        expoPushToken: token,
                        notificationsEnabled: enabled
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    },
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating server with notification preferences:', error);
            return false;
        }
    },


    requestPermissions: async () => {
        if (!Device.isDevice) return false;

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return false;
            }

            const token = await get().getExpoPushToken();
            if (!token) return false;

            set({ isEnabled: true, expoPushToken: token });
            await AsyncStorage.setItem('notificationsEnabled', 'true');
            await AsyncStorage.setItem('hasPromptedForNotifications', 'true');
            
            // Update server
            await get().updateServerWithToken(token, true);
            
            return true;
        } catch (error) {
            console.error('Error requesting permissions:', error);
            return false;
        }
    },


    toggleNotifications: async () => {
        const currentState = get().isEnabled;
        const newState = !currentState;
        
        try {
            if (newState) {
                // Request permissions and enable notifications
                if (!Device.isDevice) return false;

                const { status } = await Notifications.getPermissionsAsync();
                if (status !== 'granted') {
                    const { status: newStatus } = await Notifications.requestPermissionsAsync();
                    if (newStatus !== 'granted') return false;
                }

                const token = await get().getExpoPushToken();
                if (!token) return false;

                set({ isEnabled: true, expoPushToken: token });
                await AsyncStorage.setItem('notificationsEnabled', 'true');
                await get().updateServerWithToken(token, true);
            } else {
                // Disable notifications
                set({ isEnabled: false });
                await AsyncStorage.setItem('notificationsEnabled', 'false');
                
                const token = get().expoPushToken;
                if (token) {
                    await get().updateServerWithToken(token, false);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error toggling notifications:', error);
            return false;
        }
    }
}));