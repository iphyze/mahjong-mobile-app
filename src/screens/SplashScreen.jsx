import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../components/common/ThemeProvider';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const theme = useTheme();
  const { checkAuthStatus } = useAuth();
  const [transition, setTransition] = useState(false);
  const [showSecondScreen, setShowSecondScreen] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Set timer for transition
      setTimeout(() => {
        setTransition(true);
        // Small delay before showing second screen for smooth transition
        setTimeout(() => {
          setShowSecondScreen(true);
        }, 100);
      }, 5000);
      // }, 500000);

      
      // await new Promise(resolve => setTimeout(resolve, 10000));
      // await checkAuthStatus();
    };

    initializeApp();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.whiteText }]}>
      <Animatable.View 
        style={StyleSheet.absoluteFill}
        animation={transition ? "fadeOut" : undefined}
        // duration={10000}
        duration={1000}
      >
        <LinearGradient style={styles.logoContainer} colors={[COLORS.whiteText, COLORS.whiteText]}>
          <Image source={require('../../assets/images/splash-icon-white.png')}  style={styles.topImage}/>
          <Animatable.Image 
            source={require('../../assets/images/splash-logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
            animation="fadeInUp" 
            delay={500}
          />
          <Image source={require('../../assets/images/splash-icon-white.png')}  style={styles.bottomImage}/>
        </LinearGradient>
      </Animatable.View>

      {showSecondScreen && (
        <Animatable.View 
          style={StyleSheet.absoluteFill}
          animation="fadeIn"
          duration={1000}
        >
          <LinearGradient style={styles.logoContainer} colors={[COLORS.redThemeColorOne, COLORS.redThemeColorTwo]}>
          <Image source={require('../../assets/images/splash-icon-red.png')}  style={styles.topImage}/>
            <Animatable.Image 
              source={require('../../assets/images/splash-logo-white.png')} 
              style={styles.logo} 
              resizeMode="contain"
              animation="fadeIn"
              duration={1000}
              // duration={10000}
              />
            <Image source={require('../../assets/images/splash-icon-red.png')}  style={styles.bottomImage}/>
          </LinearGradient>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    width: width,
    height: height,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
  },
  topImage: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    alignSelf: 'center',
    top: -140,
    opacity: 0.08
  },
  bottomImage: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    alignSelf: 'center',
    bottom: -140,
    opacity: 0.08
  }
});

export default SplashScreen;