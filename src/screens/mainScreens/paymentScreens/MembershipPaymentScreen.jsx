import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform, StatusBar, Dimensions, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { COLORS } from '../../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../../context/ToastContext';
import { getFlutterwaveKey } from '../../../utils/config';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong, faCalendar, faCalendarAlt, faEnvelope, faPaperPlane, faPhone, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import api from '../../../services/api';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppNotificationStore } from '../../../store/appNotificationStore';




const { width, height } = Dimensions.get('window');
// const windowHeight = Dimensions.get('screen').height;

const MembershipPaymentScreen = () => {
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const {user, token, updateUserData} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchUsersNotification, loading} = useAppNotificationStore();

  // Sanitize and validate customer information
  const sanitizeCustomerInfo = () => {
    const email = user?.email || 'iphyze@gmail.com';
    const phoneNumber = user?.country_code && user?.number 
      ? `${user.country_code}${user.number}` 
      : '+2348105342439';
    const name = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : 'Test User';
      const amount = 2.00 * 1400.00;

    return { email, phoneNumber, name, amount };
  };

  // console.log(user);

  const renderLoading = () => {
    return (
      <ActivityIndicator
        style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        size={RFValue(30)}
        color={COLORS.redThemeColorOne}
      />
    );
  };


  // Initiate payment
  const initiatePayment = async () => {

    setIsInitiatingPayment(true);
    try {

      const { email, phoneNumber, name, amount } = sanitizeCustomerInfo();

      const flutterwaveConfig = {
        tx_ref: `tx-${Date.now()}`,
        amount: String(amount),
        currency: 'NGN',
        payment_options: 'card,ussd',
        redirect_url: 'https://your-callback-url.com/redirect', // Add a redirect URL
        customer: {
          email: email,
          phone_number: phoneNumber,
          name: name
        },
        customizations: {
          title: 'Mahjong Clinic Nigeria',
          description: 'Yearly Membership Subscription',
        },
        no_notification: true
      };

      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        flutterwaveConfig,
        {
          headers: {
            'Authorization': `Bearer ${getFlutterwaveKey()}`,
            'Content-Type': 'application/json'
          }
        }
      );


      if (response.data.status === 'success') {
        setPaymentUrl(response.data.data?.link);
      } else {
        showToast('Payment initiation failed', 'error');
      }
    } catch (error) {
      if (error.response) {
        showToast('Payment initiation failed', 'error');
      } else if (error.request) {
        showToast('No response received from the server', 'error');
      } else {
        showToast('Payment initiation failed', 'error');
      }

      setPaymentStatus('Payment initiation failed');
    } finally{
      setIsInitiatingPayment(false);
    }
  };



  const createPaymentRecord = async (transactionData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        amount: transactionData.amount,
        currency: transactionData.currency,
        paymentStatus: transactionData.status,
        transactionId: transactionData.id,
        paymentMethod: transactionData.payment_type,
        transactionReference: transactionData.tx_ref,
        dollar_amount: "50.00",
        rate: "1600.00",
        payment_type: "Membership Payment",
        paymentDuration: "1 year",
        phoneNumber: user?.country_code && user?.number ? `${user.country_code}${user.number}` : '+2348105342439',
        fullname: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Test User',
        email: user?.email || 'test@gmail.com',
        userId: user?.id || '1234567890',
      };
  
      const response = await api.post('/payment/createPayment', payload, 
          {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        showToast('Payment record created successfully', 'success');
      }
    } catch (error) {
      console.error('Error creating payment record:', error);
      showToast('Error creating payment record', 'error');
    } finally{
      setIsSubmitting(false);
    }
  };


  // Update the verifyPayment function
const verifyPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${getFlutterwaveKey()}`
        }
      }
    );

    if (response.data.status === 'success') {
      const transactionStatus = response.data.data.status;
      setPaymentStatus(transactionStatus);
      
      switch (transactionStatus) {
        case 'successful':
          // Create payment record after successful verification
          await createPaymentRecord(response.data.data);
          showToast('Payment successful', 'success');
          await Promise.all([
            fetchUsersNotification(),
            updateUserData()
          ]);

          // Finally navigate away
          navigation.navigate('Main');

          break;
        case 'failed':
          // Create payment record after successful verification
          await createPaymentRecord(response.data.data);
          await Promise.all([
            fetchUsersNotification(),
            updateUserData()
          ]);
          showToast('Payment failed', 'error');
          break;
        case 'pending':
          // Create payment record after successful verification
          await createPaymentRecord(response.data.data);
          await Promise.all([
            fetchUsersNotification(),
            updateUserData()
          ]);
          showToast('Payment pending', 'info');
          break;
        default:
          showToast('Unknown payment status', 'warning');
      }
    }
  } catch (error) {
    if (error.response) {
      showToast(`Verification failed: ${error.response.data.message}`, 'error');
    } else if (error.request) {
      showToast('No response from server', 'error');
    } else {
      showToast('Error verifying payment', 'error');
    }
    setPaymentStatus('Payment verification failed');
  }
};


  // Handle WebView navigation state
  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    
    if (url.includes('transaction_id')) {
      const transactionId = url.split('transaction_id=')[1];
      verifyPayment(transactionId);
      setPaymentUrl(null);
    }

    if (url.includes('tx_ref') && url.includes('status=cancelled')) {
      setPaymentUrl(null);
    }

    if (url.includes('flutterwave') && url.includes('cancelled')) {
      setPaymentUrl(null);
    }
    
  };

  return (
    <View style={styles.container}>
        <View style={styles.statusBar}></View>
        {/* <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={500}>
            <Image style={styles.iconImg} source={require('../../../../assets/images/splash-icon-white.png')}/>
        </Animatable.View> */}

        <View style={styles.navBar}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                <FontAwesomeIcon 
                icon={faArrowLeftLong} color={COLORS.authText} 
                style={styles.backBtnIcon}/>
            </TouchableOpacity>
            <Text style={styles.title}>Payment</Text>
        </View>

        {!paymentUrl ? (
          <ScrollView contentContainerStyle={{paddingBottom: RFValue(50)}} showsVerticalScrollIndicator={false}>
          <Animatable.View animation={'fadeInUp'} delay={500} style={styles.orderContainer}>

              <Text style={styles.amountHeading}>Membership Amount</Text>
              <View style={styles.amountFigureBox}>
                <Text style={styles.amountFigureSymbol}>$</Text>
                <Text style={styles.amountFigure}>2.00</Text>
              </View>

            <View style={styles.rateBox}>
              <Text style={styles.rateText}>Exchange Rate</Text>
              <Text style={styles.rateAmount}>₦ 1,400.00</Text>
            </View>


            <View style={styles.contextFlex}>
              <FontAwesomeIcon icon={faUserCircle} size={RFValue(16)} color={COLORS.redThemeColorTwo05}/>
              <View style={styles.contextwrapper}>
                <Text style={styles.contextText}>Name:</Text>
                <Text style={styles.contextTextMain}>{`${user.firstName} ${user.lastName}`}</Text>
              </View>
            </View>


            <View style={styles.contextFlex}>
              <FontAwesomeIcon icon={faEnvelope} size={RFValue(16)} color={COLORS.redThemeColorTwo05}/>
              <View style={styles.contextwrapper}>
                <Text style={styles.contextText}>Email:</Text>
                <Text style={styles.contextTextMain}>{user?.email || ''}</Text>
              </View>
            </View>


            <View style={styles.contextFlex}>
              <FontAwesomeIcon icon={faPhone} size={RFValue(16)} color={COLORS.redThemeColorTwo05}/>
              <View style={styles.contextwrapper}>
                <Text style={styles.contextText}>Tel:</Text>
                <Text style={styles.contextTextMain}>{`${user.country_code}${user.number}`}</Text>
              </View>
            </View>


            <View style={styles.contextFlex}>
              <FontAwesomeIcon icon={faCalendarAlt} size={RFValue(16)} color={COLORS.redThemeColorTwo05}/>
              <View style={styles.contextwrapper}>
                <Text style={styles.contextText}>Payment Duration:</Text>
                <Text style={styles.contextTextMain}>One year</Text>
              </View>
            </View>


            <View style={styles.contextFlex}>
              <FontAwesomeIcon icon={faUsers} size={RFValue(16)} color={COLORS.redThemeColorTwo05}/>
              <View style={styles.contextwrapper}>
                <Text style={styles.contextText}>Payment Type:</Text>
                <Text style={styles.contextTextMain}>Membership Payment</Text>
              </View>
            </View>


            <TouchableOpacity title="Pay Now" onPress={initiatePayment} 
            style={styles.payNowBtn} activeOpacity={0.8} disabled={isInitiatingPayment}>
                {isInitiatingPayment ? <ActivityIndicator size={RFValue(14)} color={COLORS.whiteText} /> :
                <> 
                  <Text style={styles.payNowText}>Pay Now</Text>
                  <FontAwesomeIcon icon={faPaperPlane} color={COLORS.whiteText} size={RFValue(12)} />
                </>
                }
            </TouchableOpacity>

            <Text style={styles.mahjongText}>
              Please be assured that your payment is secure and your information is safe with us.
            </Text>
            

          </Animatable.View>
          </ScrollView>
            ) : (
        <Animatable.View style={styles.webviewContainer} animation={'fadeInUp'} delay={500}>
            <WebView
            source={{ uri: paymentUrl }}
            style={styles.webview}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            // startInLoadingState={true}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
            allowsInlineMediaPlayback={true}
            key={paymentUrl}
            />
            {isLoading && renderLoading()}
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
    webviewContainer: {
        position: 'relative',
        flex: 1,
        width: width,
        height: height,
        paddingTop: RFValue(10)
    },
    webview: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    orderContainer: {
      width: width * 0.9,
      alignSelf: 'center',
      backgroundColor: COLORS.whiteText
    },
    payNowBtn: {
      position: 'relative',
      width: width * 0.9,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.redThemeColorOne,
      borderRadius: RFValue(4),
      padding: RFValue(16),
    },
    payNowText: {
      position: 'relative',
      fontSize: RFValue(10),
      fontFamily: 'Nunito-SemiBold',
      color: COLORS.whiteText,
      marginRight: RFValue(5)
    },
    mahjongText: {
      position: 'relative',
      width: width * 0.9,
      alignSelf: 'center',
      fontSize: RFValue(10),
      fontFamily: 'Nunito-Light',
      color: COLORS.authText,
      marginBottom: RFValue(5),
      textAlign: 'center',
      lineHeight: RFValue(16),
      marginTop: RFValue(10)
    },
    amountHeading: {
      position: 'relative',
      width: '100%',
      textAlign: 'center',
      fontSize: RFValue(12),
      fontFamily: 'Nunito-Regular',
      marginTop: RFValue(10),
      color: '#9a9a9a',
    },
    amountFigureBox: {
      position: 'relative',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      marginBottom: RFValue(20),
    },
    amountFigure: {
      position: 'relative',
      textAlign: 'center',
      fontSize: RFValue(30),
      fontFamily: 'Nunito-Bold',
      color: COLORS.redThemeColorOne
    },
    amountFigureSymbol: {
      position: 'relative',
      textAlign: 'center',
      fontSize: RFValue(15),
      fontFamily: 'Nunito-Bold',
      color: COLORS.redThemeColorOne,
      marginBottom: RFValue(5),
    },
    rateBox: {
      position: 'relative',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: RFValue(15),
      backgroundColor: COLORS.inputBg,
      borderRadius: RFValue(4),
      marginBottom: RFValue(15)
    },
    rateText: {
      position: 'relative',
      fontSize: RFValue(10),
      fontFamily: 'Nunito-SemiBold',
      color: COLORS.redThemeColorOne
    },
    rateAmount: { 
      position: 'relative',
      fontSize: RFValue(10),
      fontFamily: 'Nunito-Regular',
      backgroundColor: COLORS.redThemeColorTwo05,
      color: COLORS.whiteText,
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(6),
      borderRadius: RFValue(2)
    },
    contextFlex: {
      position: 'relative',
      width: '100%',
      backgroundColor: COLORS.whiteText,
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(18),
      alignSelf: 'center',
      marginBottom: RFValue(20),
      borderRadius: RFValue(5),
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      // Shadow for iOS
      shadowColor: 'rgba(33, 3, 3, 0.3)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: RFValue(15),
      // Shadow for Android
      elevation: RFValue(20),
    },    
    contextwrapper: {
      position: 'relative',
      width: '85%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginLeft: RFValue(10),
    },
    contextText: {
      position: 'relative',
      fontSize: RFValue(10),
      fontFamily: 'Nunito-Bold',
      color: COLORS.redThemeColorTwo85,
    },
    contextTextMain: {
      position: 'relative',
      fontSize: RFValue(10),
      fontFamily: 'Nunito-SemiBold',
      marginLeft: RFValue(5),
      color: COLORS.redThemeColorOne
    }
});

export default MembershipPaymentScreen;