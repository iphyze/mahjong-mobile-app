// src/navigation/AppNavigator.jsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ThemeAppearanceScreen from '../screens/ThemeAppearanceScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import { useTheme } from '../components/common/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const theme = useTheme();
  const { isAuthenticated, hasOnboarded, checkAuthStatus } = useAuth();


  return (
    <NavigationContainer style={{backgroundColor: theme.background}}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background
        }
      }}
    >
       {!hasOnboarded ? (
          <Stack.Group>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>
        ) : (
          // After onboarding, check authentication
          !isAuthenticated ? (
            <Stack.Screen name="Login" component={LoginScreen} />
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