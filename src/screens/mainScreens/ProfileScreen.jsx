// src/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../components/common/ThemeProvider';
import { logout } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faChevronCircleRight, faChevronDown, faChevronRight, faHistory, faLongArrowLeft, faSignOut, faSignOutAlt, faUserGear, faUserLock } from '@fortawesome/free-solid-svg-icons';
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


  const data = [
    {id: 1, screen: '', text: 'Edit Profile', icon: faUserGear},
    {id: 2, screen: 'ChangePassword', text: 'Change Password', icon: faUserLock},
    {id: 3, screen: '', text: 'Payment History', icon: faHistory},
    {id: 4, screen: 'NotificationSettings', text: 'Notification Settings', icon: faBell},
  ]


  const handleLogout = async () => {
        await logout();
        showToast('Logged out successfully', 'success');
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.statusBar}></View>

        <Text style={styles.pageTitle}>Settings</Text>

        <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={1000}>
        <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
        </Animatable.View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: RFValue(50), paddingTop: RFValue(20)}}>
              {/* onPress={() => navigation.navigate('ThemeAppearanceScreen')}  */}

              {data.map((fetched, index) => {
                const {id, screen, text, icon} = fetched;

                return(
                  <Animatable.View key={id} animation={'fadeInUp'} style={styles.navBtnWrapper}>
                    <TouchableOpacity style={styles.navBtnBox} activeOpacity={0.8} onPress={() => navigation.navigate(screen)}>
                      <FontAwesomeIcon icon={icon} size={RFValue(16)} color={COLORS.redThemeColorOne} 
                      style={styles.navBtnIconLeft} 
                      />
                      <Text style={styles.navBtnText}>{text}</Text>
                      <FontAwesomeIcon icon={faChevronRight} 
                      size={RFValue(10)} color={COLORS.redThemeColorTwo05} 
                      style={styles.navBtnIconRight}/>
                    </TouchableOpacity>
                  </Animatable.View>
                )

              })}

              <Animatable.View animation={'fadeInUp'} style={styles.navBtnWrapper}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                < FontAwesomeIcon icon={faSignOut} size={RFValue(16)} color={COLORS.whiteText}
                    style={styles.navBtnIconLeft}/>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </Animatable.View>  
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
    },
    pageTitle: {
      position: 'relative',
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: RFValue(14),
      fontFamily: 'Nunito-SemiBold',
      color: COLORS.redThemeColorOne
    },
    navBtnWrapper: {
      position: 'relative',
      width: width * 0.9,
      alignSelf: 'center',
      marginBottom: RFValue(10),
      borderRadius: RFValue(5)
    },
    navBtnBox: {
      position: 'relative',
      width: '100%',
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(17),
      backgroundColor: COLORS.inputBg,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: RFValue(5)
    },
    navBtnIconLeft: {
      position: 'relative',
      marginRight: RFValue(15),
    },
    navBtnText: {
      position: 'relative',
      width: '70%',
      fontSize: RFValue(12),
      fontFamily: 'Nunito-Regular',
      color: COLORS.redThemeColorTwo
    },
    navBtnIconRight: {
      position: 'absolute',
      right: RFValue(10)
    },
    logoutButton: {
      position: 'relative',
      width: '100%',
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(17),
      backgroundColor: COLORS.redThemeColorOne,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: RFValue(5)
    },
    logoutButtonText: {
      position: 'relative',
      width: '70%',
      fontSize: RFValue(12),
      fontFamily: 'Nunito-Regular',
      color: COLORS.whiteText
    }
    
});

export default ProfileScreen;