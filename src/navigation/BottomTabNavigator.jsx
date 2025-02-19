import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../components/common/ThemeProvider';
import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme, Platform, Pressable } from 'react-native';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  Home: {
    component: HomeScreen,
    iconName: 'home'
  },
  Appointments: {
    component: AppointmentScreen,
    iconName: 'calendar'
  },
  Profile: {
    component: ProfileScreen,
    iconName: 'user'
  }
};

// Custom tab button component to control press feedback
const CustomTabButton = ({ children, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      opacity: pressed ? (Platform.OS === 'ios' ? 0.8 : 1) : 1,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    })}
    android_ripple={{ color: 'transparent' }}
  >
    {children}
  </Pressable>
);

export default function BottomTabNavigator() {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const getShadowStyle = () => ({
    borderTopWidth: 0,
    shadowColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: colorScheme === 'dark' ? 8 : 4,
  });

  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: theme.background,
      height: 80,
      paddingBottom: 10,
      paddingTop: 10,
      ...getShadowStyle(),
    },
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.text,
    tabBarLabelStyle: {
      fontSize: 12,
      marginTop: 3,
      marginBottom: 5,
    },
    tabBarIconStyle: {
      marginTop: 2,
    },
    // Use custom tab button
    tabBarButton: (props) => <CustomTabButton {...props} />,
  };

  useEffect(() => {
    const updatedStyle = {
      ...screenOptions.tabBarStyle,
      backgroundColor: theme.background,
      ...getShadowStyle(),
    };
    screenOptions.tabBarStyle = updatedStyle;
  }, [theme, colorScheme]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {Object.entries(TAB_CONFIG).map(([name, { component, iconName }]) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name={iconName} size={20} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}