import React, {useContext, useRef, useCallback} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Dimensions, ImageBackground, Platform, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../components/common/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const OnBoardingScreenThree = ({prevSlide}) => {
  
  const theme = useTheme();
  const styles = createStyles(theme);
  const textBoxRef = useRef(null); 
  const textBoxTwoRef = useRef(null); 
  const btnRef = useRef(null); 
  const btnTwoRef = useRef(null); 
  const imageRef = useRef(null);
  const { completeOnboarding } = useAuth();
  const navigation = useNavigation();
  
  const handleSignIn = async () => {
    await completeOnboarding();
    navigation.replace('Login');
  };

  const handleSignUp = async () => {
    await completeOnboarding();
    navigation.replace('Register');
  };
  

  useFocusEffect(
    useCallback(() => {
      textBoxRef.current?.fadeInDown(500, 700);
      textBoxTwoRef.current?.fadeInUp(500, 700);
      btnRef.current?.fadeInUp(500, 1000);
      btnTwoRef.current?.fadeInUp(500, 1000);
      imageRef.current?.fadeInDown(500, 1000);
    }, [])
  );


  return(

  <ImageBackground style={styles.container} source={require('../../../assets/images/onb-3.jpg')}>
    
        <LinearGradient 
        colors={[
          'rgba(172, 29, 33, 0)',
          COLORS.redThemeColorTwo85,
          COLORS.redThemeColorTwo
        ]}
        locations={[0.02, 0.4, 1]}
        style={styles.gradientBox}>
    
    
          <Animatable.Text style={styles.headerText} ref={textBoxRef}>Join a Global Mahjong Community</Animatable.Text>
          <Animatable.Text style={styles.briefText} ref={textBoxTwoRef}>
            Connect with Mahjong lovers worldwide! Whether you're playing for fun or climbing the ranks, you'll find the perfect 
            group to challenge and improve your skills.
          </Animatable.Text>
    
          <Animatable.View style={styles.btnWrapper} ref={btnRef}>
            <TouchableOpacity style={styles.btnBox} onPress={handleSignUp} activeOpacity={0.8}>
                <Text style={[styles.btnText, styles.signUpText]}>Sign Up</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View style={styles.btnWrapper} ref={btnTwoRef} activeOpacity={0.8}>
            <TouchableOpacity style={styles.btnBox} onPress={handleSignIn}>
                <Text style={[styles.btnText, styles.signInText]}>Sign In</Text>
            </TouchableOpacity>
          </Animatable.View>

        </LinearGradient>
         
    
    </ImageBackground>


)};

export default OnBoardingScreenThree;

const createStyles = (theme) => StyleSheet.create({
    container: {
      position: 'relative',
      width: width,
      height: Platform.select({
          android: windowHeight,
          ios: height
      }),
      flex: 1,
      resizeMode: 'cover',
      },
      gradientBox: {
          position: 'relative',
          width: '100%',
          height: windowHeight,
          justifyContent: 'flex-end',
          paddingHorizontal: width * 0.05,
          paddingVertical: windowHeight * 0.2,
      },
      headerText: {
          position: 'relative',
          width: '95%',
          fontSize: RFValue(30),
          fontFamily: 'Nunito-Bold',
          color: COLORS.whiteText,
          marginBottom: windowHeight * 0.01,
      },
      briefText: {
          position: 'relative',
          width: '100%',
          fontSize: RFValue(12),
          fontFamily: 'Nunito-Regular',
          lineHeight: RFValue(18),
          color: COLORS.whiteText,
          marginBottom: windowHeight * 0.03
      },
      btnWrapper: {
          position: 'relative',
          width: '100%',
          marginBottom: RFValue(15),
      },
      btnBox: {
          position: 'relative',
          width: '100%',
          borderRadius: RFValue(3),
          android_ripple: {
              color: 'rgba(0, 0, 0, 0.1)',
          },
      },
      btnText: {
          position: 'relative',
          width: '100%',
          paddingHorizontal: RFValue(15),
          paddingVertical: RFValue(15),
          textAlign: 'center',
          borderRadius: RFValue(3),
          fontFamily: 'Nunito-SemiBold',
          fontSize: RFValue(12)
      },
      signUpText: {
          backgroundColor: COLORS.redThemeColorOne,
          color: COLORS.whiteText,
          shadowColor: COLORS.redThemeColorTwo,
          shadowOffset: {
          width: 0,
          height: 3,
          },
          shadowOpacity: 0.5,
          shadowRadius: 4.65,
          elevation: 8,
      },
      signInText: {
          color: COLORS.redThemeColorOne,
          backgroundColor: COLORS.whiteText,
          shadowColor: COLORS.redThemeColorTwo,
          shadowOffset: {
          width: 0,
          height: 2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 3.84,
          elevation: 5,
          }
  });