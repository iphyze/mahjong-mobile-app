import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, BackHandler, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../utils/colors';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { useTheme } from '../../components/common/ThemeProvider';

const { width, height } = Dimensions.get('window');

const EmailConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));
  const userData = route.params?.data;
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleCodeChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);
    setHasError(false);

    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      e.preventDefault();
      
      const newCode = [...verificationCode];
      newCode[index] = '';
      setVerificationCode(newCode);
      
      if (index > 0) {
        inputRefs.current[index - 1].current.focus();
        newCode[index - 1] = '';
        setVerificationCode(newCode);
      }
    }
  };

  const validateCode = () => {
    const isComplete = verificationCode.every(digit => digit !== '');
    if (!isComplete) {
      setHasError(true);
      showToast('Please fill in all verification code fields', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCode()) return;

    try {
      setIsSubmitting(true);
      const code = verificationCode.join('');
      
      const response = await api.post('/auth/verifyEmail', {
          email: userData?.email,
        //   email: 'iphyze@gmail.com',
          emailCode: code
      });

      if (response.data) {
        showToast(
          response.data?.message || 'Email verified successfully!',
          'success'
        );
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || 
        error.response?.data?.errors[0]?.msg ||
        error.message || 
        'Verification failed',
        'error'
      );
      setVerificationCode(['', '', '', '']);
      inputRefs.current[0].current.focus();
    } finally {
      setIsSubmitting(false);
    }

  };

  const handleResendCode = async () => {
    try {
      setIsSending(true);
      const code = verificationCode.join('');
      
      const response = await api.post('/auth/sendVerificationCode', {
        email: userData?.email
        // email: 'iphyze@gmail.com'
      });

      if (response.data) {
        showToast(
          response.data?.message || 'Verification code has been sent successfully!',
          'success'
        );
      }

    } catch (error) {
      showToast(
        error.response?.data?.message || 
        error.response?.data?.errors[0]?.msg ||
        error.message || 
        'Snding failed, please check your connection',
        'error'
      );
      setVerificationCode(['', '', '', '']);
    } finally {
      setIsSending(false);
    }
  }

//   const handleBackPress = () => {
//     // Navigate to Login screen instead of going back
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

  return (
    <KeyboardAvoidingView style={styles.container}>
      
      <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={1000}>
        <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
        </Animatable.View>

        <Animatable.View animation={'fadeInDown'} style={styles.headerBox}>

        {/* <TouchableOpacity style={styles.backBtnBox} onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faLongArrowLeft} size={RFValue(14)} color={COLORS.authText}/>
        </TouchableOpacity> */}

        <Image source={require('../../../assets/images/splash-logo.png')} style={styles.logoImg}/>
        </Animatable.View>

      <Animatable.View animation={'fadeInUp'} style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
            Please enter the 4-digit code we sent to <Text style={styles.themeColor}>{userData?.email || 'user@email.com'}</Text> to verify your account. 
            If you didn’t receive the code, click the button below to resend it.
        </Text>

        <View style={styles.codeContainer}>
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs.current[index]}
              style={[
                styles.codeInput,
                digit && styles.filledInput,
                hasError && !digit && styles.errorInput
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              selectionColor={COLORS.redThemeColorTwo}
              blurOnSubmit={false}
            />
          ))}
        </View>


        <TouchableOpacity style={[styles.submitButton, verificationCode.every(digit => digit !== '') && styles.submitButtonActive]} 
          onPress={handleSubmit} disabled={isSubmitting}> 
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.whiteText} />
          ) : (
            <Text style={styles.submitButtonText}>Verify Email</Text>
          )}
        </TouchableOpacity>


        <TouchableOpacity style={styles.resendBtn} onPress={handleResendCode} disabled={isSending}>
            {isSending ? 
            <Text style={styles.resendText}><ActivityIndicator size={RFValue(10)} color={COLORS.redThemeColorOne}/> <Text style={styles.themeColor}>Sending...</Text></Text>
            : <Text style={styles.resendText}>Didn't receive any code? <Text style={styles.themeColor}>Resend Code</Text></Text>
            }
        </TouchableOpacity>

      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteText,
  },
  headerBox: {
    position: 'relative',
    width: width,
    paddingHorizontal: width * 0.06,
    paddingTop: RFValue(30),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
  },
  title: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(16),
    color: COLORS.redThemeColorOne,
    marginBottom: RFValue(10),
  },
  subtitle: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-Regular',
    fontSize: RFValue(12),
    color: COLORS.darkText,
    marginBottom: RFValue(30),
    lineHeight: RFValue(18)
  },
  resendBtn: {
    position: 'relative',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  resendText: {
    fontFamily: 'Nunito-Regular',
    fontSize: RFValue(12),
    color: COLORS.redThemeColorTwo,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: RFValue(20)
  },
  codeInput: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: RFValue(3),
    backgroundColor: COLORS.whiteText,
    fontSize: RFValue(17),
    borderWidth: 1,
    borderColor: COLORS.listBorderColor,
    color: COLORS.redThemeColorOne,
    marginRight: RFValue(15),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  filledInput: {
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.listBorderColor,
  },
  errorInput: {
    borderColor: COLORS.errText,
  },
  submitButton: {
    width: '100%',
    position: 'absolute',
    bottom: height * 0.1,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(14),
    backgroundColor: COLORS.redThemeColorOne,
    borderRadius: RFValue(3),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  submitButtonActive: {
    backgroundColor: COLORS.redThemeColorOne,
  },
  submitButtonText: {
    color: COLORS.whiteText,
    fontSize: RFValue(12),
    fontFamily: 'Nunito-SemiBold',
  },
  loader: {
    marginTop: RFValue(30),
  },
  iconImgBox: {
    position: 'absolute',
    right: RFValue(-70),
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
  themeColor: {
    color: COLORS.redThemeColorOne,
    fontFamily: 'Nunito-SemiBold',
  }
});

export default EmailConfirmationScreen;