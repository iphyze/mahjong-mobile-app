// // src/utils/auth.js
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AUTH_TOKEN_KEY = 'auth_token';
// const USER_ID_KEY = 'user_id';

// export const saveAuthData = async (token, userId) => {
//   try {
//     await AsyncStorage.multiSet([
//       [AUTH_TOKEN_KEY, token],
//       [USER_ID_KEY, userId.toString()],
//     ]);
//     return true;
//   } catch (error) {
//     console.error('Error saving auth data:', error);
//     return false;
//   }
// };

// export const checkAuth = async () => {
//   try {
//     const [[, token], [, userId]] = await AsyncStorage.multiGet([
//       AUTH_TOKEN_KEY,
//       USER_ID_KEY,
//     ]);
//     return Boolean(token && userId);
//   } catch (error) {
//     console.error('Error checking auth:', error);
//     return false;
//   }
// };

// export const clearAuth = async () => {
//   try {
//     await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_ID_KEY]);
//     return true;
//   } catch (error) {
//     console.error('Error clearing auth data:', error);
//     return false;
//   }
// };

// export const getAuthToken = async () => {
//   try {
//     return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
//   } catch (error) {
//     console.error('Error getting auth token:', error);
//     return null;
//   }
// };

// export const getUserId = async () => {
//   try {
//     return await AsyncStorage.getItem(USER_ID_KEY);
//   } catch (error) {
//     console.error('Error getting user ID:', error);
//     return null;
//   }
// };


// export const logout = async (navigation) => {
//   try {
//     // Clear all auth data from AsyncStorage
//     await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_ID_KEY]);

//     // Reset the navigation state and redirect to Login
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       })
//     );

//     return {
//       success: true,
//       message: 'Logged out successfully'
//     };
//   } catch (error) {
//     console.error('Logout Error:', error);
//     return {
//       success: false,
//       message: 'Failed to logout'
//     };
//   }
// };
