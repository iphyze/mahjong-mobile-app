import React, { useEffect, useState } from 'react';
import { View, Text, Image, Switch, ActivityIndicator, StyleSheet, 
    Platform, Dimensions, StatusBar, TouchableOpacity, ScrollView, TextInput 
} from 'react-native';
import { useToast } from '../../context/ToastContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS } from '../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


// Validation schema using Yup
const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().min(6, 'Current Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/,
      'Current Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*)'
    ).required('Current Password is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/,
      'New Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*)'
    ).required('New Password is required'),
  confirmNewPassword: Yup.string()
  .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  .required('Confirm new password is required'),
});


const ChangePasswordScreen = () => {
    const { showToast } = useToast();
    const [isVisible, setIsVisible] = useState(false);
    const [isCurrentVisible, setIsCurrentVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const navigation = useNavigation();
    const {user, token} = useAuth();
    const userId = user?.id || '';

    const handleChange = async (values, { setSubmitting, resetForm }) => {

        // console.log("Submitting values:", values);
        // console.log("User ID:", userId);
        // console.log("Authorization Token:", token);

        try {
          const response = await api.put(`/auth/updatePassword/${userId}`, 
            values,
            {headers: { Authorization: `Bearer ${token}` }}
          );
          
          if (response.status === 200) {
            showToast(response.data?.message || 
              'Your password update was successful!', 'success');
              resetForm();
          }
    
        } catch (error) {
          showToast(
            error.response?.data?.message || error.response?.data?.errors[0].msg ||
            error.message || 'Password update failed', 
            'error'
          );
        } finally {
          setSubmitting(false);
        }
      };

    return (
        <View style={styles.container}>
            <View style={styles.statusBar}></View>

            <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={500}>
                <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
            </Animatable.View>

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon 
                    icon={faArrowLeftLong} color={COLORS.authText} 
                    style={styles.backBtnIcon}/>
                </TouchableOpacity>
                <Text style={styles.title}>Change Pasword</Text>
            </View>

            {/* <Animatable.Text style={styles.description} animation={'fadeInUp'} delay={500}>
                Manage your notification preferences. Turn notifications on or off based on your preference.
            </Animatable.Text> */}

        <Formik initialValues={{currentPassword: '', newPassword: '', confirmNewPassword: '' }} validationSchema={PasswordSchema} onSubmit={handleChange}>
        {({ 
          handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting 
        }) => (
        <View style={[styles.innerContainer]}>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: RFValue(50), paddingTop: RFValue(20)}}>

            <Image source={require('../../../assets/images/locker.png')} style={styles.lockerImg}/>

          <Animatable.View style={styles.formContainer} animation={'fadeInUp'}>


          <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, (errors.currentPassword && touched.currentPassword) && styles.errorText]}>Current Password</Text>
              <View style={styles.formGroup}>
              <TextInput
                style={[styles.input, 
                  {borderColor: (errors.currentPassword && touched.currentPassword) ? COLORS.errText : 
                    focusedInput === 'currentPassword' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'currentPassword' ? COLORS.whiteText : COLORS.inputBg
                  }]}
                placeholder="***"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.currentPassword}
                onChangeText={handleChange('currentPassword')}
                onBlur={(e) => {
                  handleBlur('currentPassword')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('currentPassword')}
                secureTextEntry={!isCurrentVisible}
              />
              <TouchableOpacity style={styles.passwordTextBox} onPress={() => setIsCurrentVisible(!isCurrentVisible)} activeOpacity={0.8}>
                <Text style={styles.passwordText}>{isCurrentVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
              </View>
              {errors.currentPassword && touched.currentPassword && (<Text style={styles.errorText}>{errors.currentPassword}</Text>)}
            </View>


            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, (errors.newPassword && touched.newPassword) && styles.errorText]}>New Password</Text>
              <View style={styles.formGroup}>
              <TextInput
                style={[styles.input, 
                  {borderColor: (errors.newPassword && touched.newPassword) ? COLORS.errText : 
                    focusedInput === 'newPassword' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'newPassword' ? COLORS.whiteText : COLORS.inputBg
                  }]}
                placeholder="***"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                onBlur={(e) => {
                  handleBlur('newPassword')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('newPassword')}
                secureTextEntry={!isVisible}
              />
              <TouchableOpacity style={styles.passwordTextBox} onPress={() => setIsVisible(!isVisible)} activeOpacity={0.8}>
                <Text style={styles.passwordText}>{isVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
              </View>
              {errors.newPassword && touched.newPassword && (<Text style={styles.errorText}>{errors.newPassword}</Text>)}
            </View>


            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, (errors.confirmNewPassword && touched.confirmNewPassword) && styles.errorText]}>Confirm Password</Text>
              <View style={styles.formGroup}>
              <TextInput
                style={[styles.input, 
                  {borderColor: (errors.confirmNewPassword && touched.confirmNewPassword) ? COLORS.errText : 
                    focusedInput === 'confirmNewPassword' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'confirmNewPassword' ? COLORS.whiteText : COLORS.inputBg
                  }]}
                placeholder="***"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.confirmNewPassword}
                onChangeText={handleChange('confirmNewPassword')}
                onBlur={(e) => {
                  handleBlur('confirmNewPassword')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('confirmNewPassword')}
                secureTextEntry={!isConfirmVisible}
              />
              <TouchableOpacity style={styles.passwordTextBox} onPress={() => setIsConfirmVisible(!isConfirmVisible)} activeOpacity={0.8}>
                <Text style={styles.passwordText}>{isConfirmVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
              </View>
              {errors.confirmNewPassword && touched.confirmNewPassword && (<Text style={styles.errorText}>{errors.confirmNewPassword}</Text>)}
            </View>


            <Animatable.View animation={'fadeInUp'} delay={1000} style={styles.actionBox}>

            <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit} disabled={isSubmitting} activeOpacity={0.8}>
              {isSubmitting ? (<ActivityIndicator color={COLORS.whiteText} /> ) : (
                <Text style={[styles.buttonText, { color: COLORS.whiteText }]}>
                  Confirm Update
                </Text>
              )}
            </TouchableOpacity>

            </Animatable.View>
            
          </Animatable.View>
          </ScrollView>
          </View>
        )}
      </Formik>

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
    statusBar: {
          width: width,
          position: 'relative',
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
    navBar: {
        position: 'relative',
        width: width * 0.9,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    backBtn: {
        position: 'absolute',
        left: RFValue(0),
    },
    title: {
        position: 'relative',
        width: '80%',
        fontSize: RFValue(14),
        fontFamily: 'Nunito-SemiBold',
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.redThemeColorOne
    },
    description: {
        position: 'relative',
        width: width * 0.9,
        fontSize: RFValue(12),
        lineHeight: RFValue(18),
        fontFamily: 'Nunito-Regular',
        marginTop: RFValue(10),
        marginBottom: RFValue(5),
        alignSelf: 'center',
        color: COLORS.darkText
    },
    innerContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
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
      formContainer: {
        width: '100%',
        position: 'relative',
        // minHeight: height * 0.75,
        paddingHorizontal: width * 0.06,
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
        justifyContent: 'space-between',
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
      },
      lockerImg: {
        position: 'relative',
        width: width * 0.30,
        height: width * 0.30,
        alignSelf: 'center',
        marginVertical: RFValue(20)
      }
});

export default ChangePasswordScreen;