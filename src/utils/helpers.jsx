// src/utils/helpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage successfully cleared!');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};