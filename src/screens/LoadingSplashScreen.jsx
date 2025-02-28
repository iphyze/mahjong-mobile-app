import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../components/common/ThemeProvider';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const LoadingSplashScreen = () => {
  const theme = useTheme();
  const { checkAuthStatus } = useAuth();


  return (
    <View style={[styles.container, { backgroundColor: COLORS.whiteText }]}>
      <Animatable.View style={StyleSheet.absoluteFill}>
        <LinearGradient style={styles.logoContainer} colors={[COLORS.whiteText, COLORS.whiteText]}>
          <Image source={require('../../assets/images/splash-icon-white.png')}  style={styles.topImage}/>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={RFValue(20)} color={COLORS.redThemeColorOne}/>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
          {/* <Animatable.Image source={require('../../assets/images/splash-logo.png')} style={styles.logo} resizeMode="contain" /> */}
          <Image source={require('../../assets/images/splash-icon-white.png')}  style={styles.bottomImage}/>
        </LinearGradient>
      </Animatable.View>
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
  },
  loadingContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    position: 'relative',
    fontSize: RFValue(14),
    fontFamily: 'Nunito-SemiBold',
    marginLeft: RFValue(5),
    color: COLORS.redThemeColorOne
  }
});

export default LoadingSplashScreen;