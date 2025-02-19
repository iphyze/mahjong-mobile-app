// src/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/common/ThemeProvider';
import { logout } from '../utils/auth';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { showToast } = useToast();
  const { logout } = useAuth();


  const handleLogout = async () => {
        await logout();
        showToast('Logged out successfully', 'success');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Your other profile content */}
      
      <TouchableOpacity
        style={[styles.themeButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('ThemeAppearanceScreen')}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          Change Theme
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.primary }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutButtonText, { color: theme.background }]}>
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  themeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;