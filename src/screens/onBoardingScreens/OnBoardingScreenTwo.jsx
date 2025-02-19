import React, {useContext, useRef, useCallback} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Dimensions, ImageBackground, Platform, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../components/common/ThemeProvider';
import { COLORS } from '../../utils/colors';


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const OnBoardingScreenTwo = ({nextSlide, prevSlide}) => {
  
  const theme = useTheme();
  const styles = createStyles(theme);
  const textBoxRef = useRef(null); 
  const textBoxTwoRef = useRef(null); 
  const imageRef = useRef(null); 
  

  useFocusEffect(
    useCallback(() => {
      textBoxRef.current?.fadeInDown(500, 700);
      textBoxTwoRef.current?.fadeInUp(500, 700);
      imageRef.current?.fadeInDown(500, 1000);
    }, [])
  );


  return(

  <ImageBackground style={styles.container} source={require('../../../assets/images/onb-2.jpg')}>
  
      <LinearGradient 
      colors={[
              'rgba(172, 29, 33, 0)',
              COLORS.redThemeColorTwo85,
              COLORS.redThemeColorTwo
      ]}
      locations={[0.02, 0.4, 1]}
      style={styles.gradientBox}>
  
  
        <Animatable.Text style={styles.headerText} ref={textBoxRef}>Your Next Mahjong Game Starts Here</Animatable.Text>
        <Animatable.Text style={styles.briefText} ref={textBoxTwoRef}>
          No more searching for opponents—jump straight into the action! Get paired with players of similar skill and enjoy a competitive, well matched game every time.
        </Animatable.Text>
  
  
      </LinearGradient>
       
  
    </ImageBackground>
    
)};

export default OnBoardingScreenTwo;

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
        width: '90%',
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
        color: COLORS.whiteText
    }
});