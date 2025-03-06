export default {
  name: 'mahjong',
  version: '1.0.0',
  plugins: [],
  extra: {
    EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    EXPO_PUBLIC_FLUTTERWAVE_SECRET_KEY: process.env.EXPO_PUBLIC_FLUTTERWAVE_SECRET_KEY,
    "eas": {
    "projectId": "95bbb45e-1d9b-4fba-9679-f193bc2cf8d8"
    }
  }
};