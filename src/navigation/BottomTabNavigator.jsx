import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../components/common/ThemeProvider';
import HomeScreen from '../screens/mainScreens/HomeScreen';
import HistoryScreen from '../screens/mainScreens/HistoryScreen';
import ProfileScreen from '../screens/mainScreens/ProfileScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme, Platform, Pressable } from 'react-native';
import { COLORS } from '../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faGamepad, faHistory, faHome, faHomeAlt, faTimeline, faUser } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  Home: {
    component: HomeScreen,
    iconName: faHomeAlt
  },
  History: {
    component: HistoryScreen,
    iconName: faGamepad
  },
  Settings: {
    component: ProfileScreen,
    iconName: faCog
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
      backgroundColor: COLORS.inputBg,
      height: RFValue(70),
      paddingBottom: RFValue(5),
      paddingTop: RFValue(5),
      ...getShadowStyle(),
    },
    tabBarActiveTintColor: COLORS.redThemeColorOne,
    tabBarInactiveTintColor: COLORS.redThemeColorTwo05,
    tabBarLabelStyle: {
      fontSize: RFValue(10),
      fontFamily: 'Nunito-SemiBold',
      marginTop: RFValue(1),
      marginBottom: RFValue(2),
    },
    tabBarIconStyle: {
      marginTop: RFValue(1),
    },
    // Use custom tab button
    tabBarButton: (props) => <CustomTabButton {...props} />,
  };

  useEffect(() => {
    const updatedStyle = {
      ...screenOptions.tabBarStyle,
      backgroundColor: COLORS.inputBg,
      ...getShadowStyle(),
    };
    screenOptions.tabBarStyle = updatedStyle;
  }, [theme, colorScheme]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {Object.entries(TAB_CONFIG).map(([name, { component, iconName }]) => (
        <Tab.Screen key={name} name={name} component={component}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={iconName} size={20} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}