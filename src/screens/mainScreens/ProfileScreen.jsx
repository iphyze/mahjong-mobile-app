// src/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../components/common/ThemeProvider';
import { logout } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../utils/colors';

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

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
    <View style={[styles.container]}>
      <View style={styles.statusBar}></View>

        <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={1000}>
        <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
        </Animatable.View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: RFValue(50), paddingTop: RFValue(20)}}>
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
          </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: width,
      height: height,
      overflow: 'hidden',
      backgroundColor: COLORS.whiteText
    },
    innerContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: COLORS.whiteText
    },
    statusBar: {
      width: width,
      position: 'relative',
      backgroundColor: 'transparent',
      height: Platform.OS === 'ios' ? (Platform.isPad ? 24 : 44) : StatusBar.currentHeight || RFValue(60),
    },
    iconImgBox: {
      position: 'absolute',
      left: RFValue(-70),
      top: RFValue(-70),
    },
    iconImg: {
      width: RFValue(200),
      height: RFValue(200),
      opacity: 0.05
    },
    logoImg: {
      position: 'relative',
      width: width * 0.34,
      height: width * 0.18,
      alignSelf: 'center',
      resizeMode: 'contain',  
    }
});

export default ProfileScreen;