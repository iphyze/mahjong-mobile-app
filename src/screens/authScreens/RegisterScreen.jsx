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

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


// Validation schema using Yup
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().min(4, 'First name must be up to 4 characters').required('First name is required'),
  lastName: Yup.string().min(4, 'Last name must be up to 4 characters').required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/,
      'Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*)'
    ).required('Password is required'),
  confirmPassword: Yup.string()
  .oneOf([Yup.ref('password'), null], 'Passwords must match')
  .required('Confirm password is required'),
  number: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must only contain digits')
    .min(6, 'Phone number must be at least 6 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .required('Phone number is required'),
});


const RegisterScreen = () => {
  const theme = useTheme();
  const { showToast } = useToast();
  // const { login } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigation = useNavigation();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/auth/register', values);
      const data = response.data?.data;
      
      if (data) {
        showToast(response.data?.message || 
          'Your registration successful, kindly confirm your email!', 'success');
        navigation.navigate('EmailConfirmation', {data});
      }

    } catch (error) {
      // console.error('Login error:', {
      //   message: error.message,
      //   response: error.response?.data,
      // });
      showToast(
        error.response?.data?.message || error.response?.data?.errors[0].msg ||
        error.message || 'Registration failed', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <KeyboardAvoidingView style={[styles.container]}>
      {/* <View style={styles.statusBar}></View> */}

      <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={1000}>
      <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
      </Animatable.View>

      <Animatable.View animation={'fadeInDown'} style={styles.headerBox}>

        <TouchableOpacity style={styles.backBtnBox} onPress={() => navigation.goBack()}>
          <FontAwesome name={'long-arrow-left'} size={RFValue(16)} color={COLORS.authText}/>
        </TouchableOpacity>

        <Image source={require('../../../assets/images/splash-logo.png')} style={styles.logoImg}/>
      </Animatable.View>

      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: RFValue(50), paddingTop: RFValue(20)}}>
      {/* <View style={styles.statusBar}></View> */}


      
      <Formik initialValues={{firstName: '', lastName: '', email: '', password: '', confirmPassword: '', number: '' }} validationSchema={RegisterSchema} onSubmit={handleLogin}>
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
            <Text style={[styles.title]}>Create Account</Text>
            <Text style={[styles.subTitle]}>Sign up to join the fasted growing Mahjong community</Text>


            <View style={styles.inputContainer} animation={'fadeInUp'}>
              <Text style={[styles.inputLabel, (errors.firstName && touched.firstName) && styles.errorText]}>First Name</Text>
              <View style={styles.formGroup}>
              <TextInput style={[styles.input, 
              {borderColor: (errors.firstName && touched.firstName) ? COLORS.errText : 
                focusedInput === 'firstName' ? COLORS.redThemeColorTwo : 'transparent',
                backgroundColor: focusedInput === 'firstName' ? COLORS.whiteText : COLORS.inputBg
              }]}
                placeholder="FIrst name here"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={(e) => {
                  handleBlur('firstName')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('firstName')}
                autoCapitalize="none"
              />
              </View>
              {errors.firstName && touched.firstName && (<Text style={styles.errorText}>{errors.firstName}</Text>)}
            </View>



            <View style={styles.inputContainer} animation={'fadeInUp'}>
              <Text style={[styles.inputLabel, (errors.lastName && touched.lastName) && styles.errorText]}>Last Name</Text>
              <View style={styles.formGroup}>
              <TextInput style={[styles.input, 
              {borderColor: (errors.lastName && touched.lastName) ? COLORS.errText : 
                focusedInput === 'lastName' ? COLORS.redThemeColorTwo : 'transparent',
                backgroundColor: focusedInput === 'lastName' ? COLORS.whiteText : COLORS.inputBg
              }]}
                placeholder="Last name here"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={(e) => {
                  handleBlur('lastName')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('lastName')}
                autoCapitalize="none"
              />
              </View>
              {errors.lastName && touched.lastName && (<Text style={styles.errorText}>{errors.lastName}</Text>)}
            </View>



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



            <View style={styles.inputContainer} animation={'fadeInUp'}>
                <Text style={[styles.inputLabel, (errors.number && touched.number) && styles.errorText]}>Phone Number</Text>
                <View style={styles.formGroup}>
                <TextInput style={[styles.input, 
                {borderColor: (errors.number && touched.number) ? COLORS.errText : 
                  focusedInput === 'number' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'number' ? COLORS.whiteText : COLORS.inputBg
                }]}
                  placeholder="81**"
                  placeholderTextColor={COLORS.redThemeColorTwo05}
                  selectionColor={COLORS.redThemeColorTwo + '80'}
                  value={values.number}
                  onChangeText={handleChange('number')}
                  onBlur={(e) => {
                    handleBlur('number')(e);
                    setFocusedInput(null);
                  }}
                  onFocus={() => setFocusedInput('number')}
                  autoCapitalize="none"
                  keyboardType='numeric'
                  maxLength={15}
                />
                </View>
                {errors.number && touched.number && (<Text style={styles.errorText}>{errors.number}</Text>)}
            </View>


            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, (errors.password && touched.password) && styles.errorText]}>Password</Text>
              <View style={styles.formGroup}>
              <TextInput
                style={[styles.input, 
                  {borderColor: (errors.password && touched.password) ? COLORS.errText : 
                    focusedInput === 'password' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'password' ? COLORS.whiteText : COLORS.inputBg
                  }]}
                placeholder="***"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={(e) => {
                  handleBlur('password')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('password')}
                secureTextEntry={!isVisible}
              />
              <TouchableOpacity style={styles.passwordTextBox} onPress={() => setIsVisible(!isVisible)} activeOpacity={0.8}>
                <Text style={styles.passwordText}>{isVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
              </View>
              {errors.password && touched.password && (<Text style={styles.errorText}>{errors.password}</Text>)}
            </View>


            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, (errors.confirmPassword && touched.confirmPassword) && styles.errorText]}>Confirm Password</Text>
              <View style={styles.formGroup}>
              <TextInput
                style={[styles.input, 
                  {borderColor: (errors.confirmPassword && touched.confirmPassword) ? COLORS.errText : 
                    focusedInput === 'confirmPassword' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'confirmPassword' ? COLORS.whiteText : COLORS.inputBg
                  }]}
                placeholder="***"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={(e) => {
                  handleBlur('confirmPassword')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('confirmPassword')}
                secureTextEntry={!isConfirmVisible}
              />
              <TouchableOpacity style={styles.passwordTextBox} onPress={() => setIsConfirmVisible(!isConfirmVisible)} activeOpacity={0.8}>
                <Text style={styles.passwordText}>{isConfirmVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && (<Text style={styles.errorText}>{errors.confirmPassword}</Text>)}
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
              <Text style={styles.forgotText}>I already have an account</Text>
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
  },
  // statusBar: {
  //   width: width,
  //   position: 'absolute',
  //   backgroundColor: 'transparent',
  //   height: Platform.OS === 'ios' ? (Platform.isPad ? 24 : 44) : StatusBar.currentHeight || RFValue(60),
  // },
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
    position: 'relative',
    width: '100%',
    alignSelf: 'center',
    marginTop: RFValue(10)
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
    top: RFValue(50),
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
  },
  headerBox: {
    position: 'relative',
    width: width,
    paddingHorizontal: width * 0.06,
    paddingTop: RFValue(30),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default RegisterScreen;