// src/navigation/AppNavigator.jsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ThemeAppearanceScreen from '../screens/ThemeAppearanceScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import { useTheme } from '../components/common/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from '../utils/colors';
import RegisterScreen from '../screens/authScreens/RegisterScreen';
import { createStackNavigator } from '@react-navigation/stack';
import EmailConfirmationScreen from '../screens/authScreens/EmailConfirmationScreen';
import ForgotPassword from '../screens/authScreens/ForgotPassword';


// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

export default function AppNavigator() {
  const theme = useTheme();
  const { isAuthenticated, hasOnboarded, checkAuthStatus } = useAuth();


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
       {!hasOnboarded ? (
          <Stack.Group>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            {/* <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} /> */}
          </Stack.Group>
        ) : (
          // After onboarding, check authentication
          !isAuthenticated ? (
            <Stack.Group>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen} />
            </Stack.Group>
          ) : (
            // Protected Stack for authenticated users
            <Stack.Group>
              <Stack.Screen name="Main" component={BottomTabNavigator} />
              <Stack.Screen name="ThemeAppearanceScreen" component={ThemeAppearanceScreen}/>
            </Stack.Group>
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}