import React, { useEffect, useState } from 'react';
import { View, Text, Image, Switch, ActivityIndicator, StyleSheet, 
    Platform, Dimensions, StatusBar, TouchableOpacity, ScrollView, TextInput 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useToast } from '../../context/ToastContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS } from '../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong, faCamera } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useHistoryStore } from '../../store/historyStore';

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


// Validation schema using Yup
const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().min(4, 'First name must be up to 4 characters').required('First name is required'),
    lastName: Yup.string().min(4, 'Last name must be up to 4 characters').required('Last name is required'),
});


const UpdateUser = () => {
    const { showToast } = useToast();
    const [focusedInput, setFocusedInput] = useState(null);
    const navigation = useNavigation();
    const {user, token, updateUserData, loading} = useAuth();
    const userId = user?.id || '';
    const userImage = `https://mahjon-db.goldenrootscollectionsltd.com/imageUploads/mahjong-uploads/${user?.image}`;
    const defaultImage = `https://mahjon-db.goldenrootscollectionsltd.com/imageUploads/mahjong-uploads/userIcon.png`;
    const [image, setImage] = useState(userImage || defaultImage);
    const [uploading, setUploading] = useState(false);
    const {fetchUsersHistory} = useHistoryStore();


    // Function to pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
        setFieldValue('image', result.assets[0].uri);
      }
    };


// Handle form submission
const handleChange = async (values, { setSubmitting, resetForm }) => {
  setUploading(true);

  // Check if any changes were made
  const isFirstNameChanged = values.firstName !== user?.firstName;
  const isLastNameChanged = values.lastName !== user?.lastName;
  const isImageChanged = image !== userImage && image !== defaultImage;

  // If no changes, show toast and exit
  if (!isFirstNameChanged && !isLastNameChanged && !isImageChanged) {
      showToast("No changes made!", "info");
      setUploading(false);
      setSubmitting(false);
      return;
  }

  try {
      let requestData;
      let headers = { 
        'Authorization': `Bearer ${token}`
      };

      // Handle image upload case
      if (isImageChanged) {
          requestData = new FormData();
          
          // Only append fields that have values
          if (values.firstName?.trim()) {
              requestData.append("firstName", values.firstName.trim());
          }
          if (values.lastName?.trim()) {
              requestData.append("lastName", values.lastName.trim());
          }

          const uriParts = image.split(".");
          const fileType = uriParts[uriParts.length - 1];

          requestData.append("image", {
            uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
            name: `profile_${userId}.${fileType}`,
            type: `image/${fileType}`,
          });

          headers['Content-Type'] = 'multipart/form-data';
          headers['x-update-image'] = 'true';
      } 
      // Handle text-only updates
      else {
          requestData = {
              firstName: values.firstName?.trim() || undefined,
              lastName: values.lastName?.trim() || undefined
          };
          headers['Content-Type'] = 'application/json';
          headers['x-update-image'] = 'false';
      }

      const response = await api.put(
          `/users/updateUser/${userId}`, 
          requestData, 
          { headers }
      );

      if (response.status === 200) {
          showToast(response.data?.message || "Profile updated successfully!", "success");
          resetForm();
          await updateUserData();
          await fetchUsersHistory();
      }
  } catch (error) {
      showToast(error.response?.data?.message || "Update failed", "error");
  } finally {
      setUploading(false);
      setSubmitting(false);
  }
};
    



  if(loading){
      return(
        <Animatable.View style={styles.loadingContainer} animation={'fadeIn'}>
          <Animatable.View style={styles.loadBoxOne} animation={'pulse'} iterationCount="infinite">
          <Animatable.View style={styles.loadBoxTwo} animation={'pulse'} iterationCount="infinite">
            <Animatable.View style={styles.loadBoxThree} animation={'pulse'} iterationCount="infinite">
            </Animatable.View>
            </Animatable.View>  
          </Animatable.View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animatable.View>
      )
    }



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
                <Text style={styles.title}>Edit Profile</Text>
            </View>

        <Formik 
        initialValues={{firstName: user?.firstName || '', lastName: user?.lastName || '', image: user?.image || '' }}
        enableReinitialize={true} 
        validationSchema={ProfileSchema} onSubmit={handleChange}>
        {({ 
          handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue
        }) => (
        <View style={[styles.innerContainer]}>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: RFValue(50), paddingTop: RFValue(20)}}>

          <Animatable.View style={styles.formContainer} animation={'fadeInUp'}>


            <View style={styles.imageContainer}>
                
                <TouchableOpacity onPress={() => pickImage(setFieldValue)} activeOpacity={0.7} style={styles.imageBtn}>
                <Image source={{ uri: image }} style={styles.profileImage} />
                <View style={styles.cameraIcon}>
                    <FontAwesomeIcon icon={faCamera} color={COLORS.whiteText} size={RFValue(8)} />
                </View>
                </TouchableOpacity>

                <View style={styles.textBox}>
                    <Text style={styles.textBoxName}>John Doe</Text>
                    <Text style={styles.textBoxuserName}>@{user?.userName}</Text>
                </View>
            </View>


          <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, (errors.firstName && touched.firstName) && styles.errorText]}>First Name</Text>
              <View style={styles.formGroup}>
              <TextInput
                style={[styles.input, 
                  {borderColor: (errors.firstName && touched.firstName) ? COLORS.errText : 
                    focusedInput === 'firstName' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'firstName' ? COLORS.whiteText : COLORS.inputBg
                  }]}
                placeholder="First Name"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={(e) => {
                  handleBlur('firstName')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('firstName')}
              />
              </View>
              {errors.firstName && touched.firstName && (<Text style={styles.errorText}>{errors.firstName}</Text>)}
            </View>



            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, (errors.lastName && touched.lastName) && styles.errorText]}>Last Name</Text>
              <View style={styles.formGroup}>
              <TextInput
                style={[styles.input, 
                  {borderColor: (errors.lastName && touched.firstName) ? COLORS.errText : 
                    focusedInput === 'lastName' ? COLORS.redThemeColorTwo : 'transparent',
                  backgroundColor: focusedInput === 'lastName' ? COLORS.whiteText : COLORS.inputBg
                  }]}
                placeholder="Last Name"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={(e) => {
                  handleBlur('lastName')(e);
                  setFocusedInput(null);
                }}
                onFocus={() => setFocusedInput('lastName')}
              />
              </View>
              {errors.lastName && touched.lastName && (<Text style={styles.errorText}>{errors.lastName}</Text>)}
            </View>


            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel]}>Phone Number</Text>
              <View style={styles.formGroup}>
              <TextInput style={[styles.input, styles.inputDisabled]}
                editable={false}
                placeholder="Phone Number"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={user?.country_code + user?.number}
              />
              </View>
            </View>


            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel]}>Email</Text>
              <View style={styles.formGroup}>
              <TextInput style={[styles.input, styles.inputDisabled]}
                editable={false}
                placeholder="Email"
                placeholderTextColor={COLORS.redThemeColorTwo05}
                selectionColor={COLORS.redThemeColorTwo + '80'}
                value={user?.email}
              />
              </View>
            </View>


            <Animatable.View animation={'fadeInUp'} delay={1000} style={styles.actionBox}>

            <TouchableOpacity style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit} disabled={isSubmitting} activeOpacity={0.8}>
              {isSubmitting ? (<ActivityIndicator color={COLORS.whiteText} /> ) : (
                <Text style={[styles.buttonText, { color: COLORS.whiteText }]}>
                  Save Changes
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
      inputDisabled: {
        backgroundColor: '#fffcef',
        color: '#b6ad89',
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
      },
      imageContainer: {
        position: 'relative',
        width: '100%',   
        marginBottom: RFValue(30),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imageBtn: {
        position: 'relative',
        alignSelf: 'flex-start',
        width: width * 0.25, 
        height: width * 0.25,
    },
    profileImage: {
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        borderRadius: RFValue(10),
        resizeMode: 'contain', 
    },
    cameraIcon: { 
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        backgroundColor: COLORS.redThemeColorOne, 
        padding: RFValue(5), 
        borderRadius: 20 
    },
    textBox: {
        position: 'relative',
        width: width * 0.6,
        marginLeft: RFValue(10),
    },
    textBoxName: {
        position: 'relative',
        width: '100%',
        fontSize: RFValue(12),
        fontFamily: 'Nunito-SemiBold',
        color: COLORS.redThemeColorOne
    },
    textBoxuserName: {
        position: 'relative',
        width: '100%',
        fontSize: RFValue(10),
        fontFamily: 'Nunito-Light',
        color: COLORS.darkText
    },
    loadingContainer: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: COLORS.whiteText,
        justifyContent: 'center',
        alignItems: 'center',
      },
    loadBoxOne: {
        position: 'relative',
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width,
        backgroundColor: 'rgba(252, 172, 172, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadBoxTwo: {
        position: 'relative',
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(252, 172, 172, 0.5)'
      },
      loadBoxThree: {
        position: 'relative',
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width,
        backgroundColor: 'rgba(252, 172, 172, 0.8)'
      },
      loadingText: {
        position: 'relative',
        marginTop: RFValue(20),
        fontFamily: 'Nunito-SemiBold',
        fontSize: RFValue(16),
        color: COLORS.redThemeColorOne
      }
});

export default UpdateUser;