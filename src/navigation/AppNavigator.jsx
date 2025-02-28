import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import ThemeAppearanceScreen from '../screens/ThemeAppearanceScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import { useTheme } from '../components/common/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/colors';
import RegisterScreen from '../screens/authScreens/RegisterScreen';
import EmailConfirmationScreen from '../screens/authScreens/EmailConfirmationScreen';
import ForgotPassword from '../screens/authScreens/ForgotPassword';
import EmailVerifyScreen from '../screens/mainScreens/EmailVerifyScreen';
import LoadingSplashScreen from '../screens/LoadingSplashScreen';
import SplashScreen from '../screens/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationStore } from '../store/notificationStore';



const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();

export default function AppNavigator() {
  const theme = useTheme();
  const { isAuthenticated, hasOnboarded, user, isLoading } = useAuth();
  const isEmailVerified = user?.isEmailVerified || false;
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { initializeNotifications, cleanup } = useNotificationStore();


  // useEffect(() => {
  //   // Hide splash screen after 10 seconds
  //   const timer = setTimeout(() => {
  //     setIsSplashVisible(false);
  //   }, 10000);
  
  //   return () => clearTimeout(timer);
  // }, []);
  
  // useEffect(() => {
  //   initializeNotifications();
  //   return () => cleanup();
  // }, []);


  useEffect(() => {
    const setup = async () => {
        // Wait for splash screen
        await new Promise(resolve => setTimeout(resolve, 10000));
        setIsSplashVisible(false);

        // Initialize notifications after splash screen
        await initializeNotifications();
    };

    setup();

    return () => cleanup();
}, []);


  return (
    <NavigationContainer style={{backgroundColor: COLORS.whiteText}}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.whiteText
          }
        }}
      >
        {isSplashVisible ? (
          // Show Splash Screen
          <Stack.Screen name="Splash" component={SplashScreen}/>
        ) : isLoading ? (
          // Show Loading Screen
          <Stack.Screen name="Loading" component={LoadingSplashScreen}/>
        ) : !hasOnboarded ? (
          <Stack.Group>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </Stack.Group>
        ) : !isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen} />
          </Stack.Group>
        ) : !isEmailVerified ? (
          <Stack.Screen name="EmailVerify" component={EmailVerifyScreen}/>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="ThemeAppearanceScreen" component={ThemeAppearanceScreen}/>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}