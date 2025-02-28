import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/components/common/ThemeProvider';
import { AuthProvider } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './src/utils/colors';
import { enableScreens } from 'react-native-screens';

enableScreens();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
          'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
          'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
          'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
          'Nunito-Medium': require('./assets/fonts/Nunito-Medium.ttf'),
        });
        setAppIsReady(true);
      } catch (e) {
        console.warn('Error loading app:', e);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar translucent backgroundColor="transparent" />
        <ToastProvider>
          <AuthProvider>
            <GestureHandlerRootView style={styles.container}>
              <AppNavigator />
            </GestureHandlerRootView>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.whiteText
  },
});

export default App;