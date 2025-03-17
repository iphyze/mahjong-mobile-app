import Constants from 'expo-constants';

export const getFlutterwaveKey = () => {
  const keys = Constants.expoConfig.extra.flutterwaveSecretKey;
  return __DEV__ ? keys.development : keys.production;
};