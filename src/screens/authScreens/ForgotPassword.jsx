import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../components/common/ThemeProvider';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address').required('Email is required'),
});


const ForgotPassword = () => {
  const theme = useTheme();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigation = useNavigation();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/auth/forgotPassword', values);

      const data = response.status;
      
      if (data === 200) {
        showToast(response.data?.message || 'Password reset was successful, kindly check your email to get your new passwords', 'success');
        navigation.navigate('Login');
      }

    } catch (error) {
      // console.error('Login error:', {
      //   message: error.message,
      //   response: error.response?.data,
      // });
      showToast(
        error.response?.data?.message || error.response?.data?.errors[0].msg ||
        error.message || 'Password Reset Failed', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container]}>
      <View style={styles.statusBar}></View>

      <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={1000}>
      <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
      </Animatable.View>


      <ScrollView showsVerticalScrollIndicator={false}>


      <TouchableOpacity style={styles.signUpBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <FontAwesomeIcon icon={faArrowCircleRight} color={COLORS.redThemeColorOne} size={RFValue(12)}/>
      </TouchableOpacity>


      <Animatable.Image source={require('../../../assets/images/splash-logo.png')} 
      style={styles.logoImg}
      animation={'fadeInDown'}/>
      
      <Formik initialValues={{ email: ''}} validationSchema={LoginSchema} onSubmit={handleLogin}>
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched, 
          isSubmitting 
        }) => (
          <Animatable.View style={styles.formContainer} animation={'fadeInUp'}>
            <Text style={[styles.title]}>Forgot Your Password?</Text>
            <Text style={[styles.subTitle]}>
                Enter your registered email address, and we’ll send you a new password to log in with.
            </Text>

            <View style={styles.inputContainer} animation={'fadeInUp'}>
              <Text style={[styles.inputLabel, (errors.email && touched.email) && styles.errorText]}>Email</Text>
              <View style={styles.formGroup}>
              <TextInput style={[styles.input, 
              {borderColor: (errors.email && touched.email) ? COLORS.errText : 
                focusedInput === 'email' ? COLORS.redThemeColorTwo : 'transparent',
                backgroundColor: focusedInput === 'email' ? COLORS.whiteText : COLORS.inputBg
              }]}
                placeholder="@"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={(e) => {
                  handleBlur('email')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('email')}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              </View>
              {errors.email && touched.email && (<Text style={styles.errorText}>{errors.email}</Text>)}
            </View>

            <Animatable.View animation={'fadeInUp'} delay={1000} style={styles.actionBox}>

            <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit} disabled={isSubmitting} activeOpacity={0.8}>
              {isSubmitting ? (<ActivityIndicator color={COLORS.whiteText} /> ) : (
                <Text style={[styles.buttonText, { color: COLORS.whiteText }]}>
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.forgotText}>Back to Login</Text>
            </TouchableOpacity>

            </Animatable.View>
            
          </Animatable.View>
        )}
      </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
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
  statusBar: {
    position: 'relative',
    width: width,
    backgroundColor: COLORS.whiteText,
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
    width: width * 0.4,
    height: width * 0.18,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: RFValue(20), 
    marginTop: RFValue(60) 
  },
  formContainer: {
    width: '100%',
    position: 'relative',
    minHeight: height * 0.75,
    paddingHorizontal: width * 0.06,
  },
  title: {
    width: '100%',
    position: 'relative',
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(16),
    marginBottom: RFValue(10),
    textAlign: 'center',
    color: COLORS.redThemeColorOne
  },
  subTitle: {
    width: '85%',
    position: 'relative',
    fontFamily: 'Nunito-Regular',
    fontSize: RFValue(12),
    lineHeight: RFValue(18),
    marginBottom: RFValue(20),
    textAlign: 'center',
    color: COLORS.authText,
    alignSelf: 'center',
  },
  inputLabel: {
    position: 'relative',
    width: '100%',
    marginBottom: RFValue(5),
    fontFamily: 'Nunito-Medium',
    fontSize: RFValue(10),
    color: COLORS.redThemeColorTwo
  },
  inputContainer: {
    width: '100%',
    marginBottom: RFValue(15),
  },
  formGroup: {
    position: 'relative',
    width: '100%',
    marginBottom: RFValue(3),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: RFValue(14),
    paddingVertical: RFValue(14),
    backgroundColor: COLORS.inputBg,
    color: COLORS.redThemeColorTwo,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: RFValue(2),
    fontSize: RFValue(12),
  },
  errorText: {
    width: '100%',
    color: COLORS.errText,
    fontSize: RFValue(10),
    marginLeft: RFValue(3),
  },
  actionBox: {
    position: 'absolute',
    width: '100%',
    bottom: height * 0.01,
    alignSelf: 'center',
  },
  button: {
    position: 'relative',
    width: '100%',
    backgroundColor: COLORS.redThemeColorOne,
    borderRadius: RFValue(2),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(12),
    marginBottom: RFValue(10)
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-Medium',
    fontSize: RFValue(12),
    textAlign: 'center',
  },
  forgotBtn: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotText: {
    position: 'relative',
    width: '100%',
    textAlign: 'center',
    fontSize: RFValue(10),
    fontFamily: 'Nunito-Bold',
    color: COLORS.authText
  },
  passwordTextBox: {
    position: 'absolute',
    right: RFValue(10),
  },
  passwordText: {
    position: 'relative',
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(9),
    color: COLORS.redThemeColorTwo
  },
  signUpBtn: {
    position: 'absolute',
    right: RFValue(20),
    top: RFValue(30),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  signUpText: {
    position: 'relative',
    marginRight: RFValue(5),
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(10),
    color: COLORS.redThemeColorOne
  }
});

export default ForgotPassword;