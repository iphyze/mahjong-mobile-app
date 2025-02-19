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
import SplashScreen from './src/screens/SplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './src/utils/colors';
import { enableScreens } from 'react-native-screens';
// import ErrorBoundary from './ErrorBoundary';


enableScreens();

const { width, height } = Dimensions.get('window');

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
          'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
          'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
          'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
          'Nunito-Medium': require('./assets/fonts/Nunito-Medium.ttf'),
        });

        // Artificially delay for splash screen
        // await new Promise(resolve => setTimeout(resolve, 5000));

        // Mark app as ready
        setAppIsReady(true);

        // console.log('App mounted');

        // Set timer to hide splash screen after fonts are loaded
        setTimeout(() => {
          setIsSplashVisible(false);
        }, 10000); // Additional time for splash screen after fonts are loaded
      } catch (e) {
        console.warn('Error loading app:', e);
      }
    }

    prepare();
  }, []);

  // Don't render anything until app is ready
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
                  {isSplashVisible ? (
                    <SplashScreen />
                  ) : (
                    <AppNavigator />
                  )}
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
  },
});

export default App;