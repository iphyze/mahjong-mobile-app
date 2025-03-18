//src/screens/HomeScreen.jsx

import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, Image, Platform, StatusBar, TouchableOpacity, ImageBackground, RefreshControl} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faChartLine, faChevronCircleRight, faCircle, faGamepad, faHistory, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable'
import { BlurView } from 'expo-blur';
import BecomeMember from './BecomeMember';
import RecentMatchHistory from './RecentMatchHistory';
import { useAppNotificationStore } from '../../store/appNotificationStore';
import { useNavigation } from '@react-navigation/native';
import { useHistoryStore } from '../../store/historyStore';
import { usePaymentStore } from '../../store/paymentStore';


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const HomeScreen = () => {
  const {user, updateUserData, loading} = useAuth();
  const [show, setShow] = useState(true);
  const { userNotifications, error, fetchUsersNotification} = useAppNotificationStore();
  const navigation = useNavigation();
  const membershipPaymentStatus = user?.payments?.membership?.membershipPayment || false;
  const [refreshing, setRefreshing] = useState(false);
  const userImage = `https://mahjon-db.goldenrootscollectionsltd.com/imageUploads/mahjong-uploads/${user?.image}`;
  const defualtImage = `https://mahjon-db.goldenrootscollectionsltd.com/imageUploads/mahjong-uploads/userIcon.png`;
  const {userHistory, fetchUsersHistory} = useHistoryStore();
  const {userPayment, fetchUserPayment} = usePaymentStore();
  const subscriptions = userPayment.length || 0;
  const matches = userHistory.length || 0;
  
  // console.log(subscriptions);


  const data = {
    name: `${user?.firstName + ' ' + user?.lastName}` || 'John Doe',
    username: user?.userName || 'janedoe'
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Run all refresh functions in parallel
      await Promise.all([
        updateUserData(),
        fetchUsersNotification(),
        fetchUsersHistory()
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [updateUserData, fetchUsersNotification]);

  // console.log(user);

  if(loading){
    return(
      <Animatable.View style={styles.loadingContainer} animation={'fadeInUp'}>
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

  

  const getMembershipCount = () => {
    return userPayment.filter(payment => 
      payment.payment_type === 'Membership Payment' 
      // && payment.paymentStatus === 'successful'
    ).length;
  };

  const getTutorshipCount = () => {
    return userPayment.filter(payment => 
      payment.payment_type === 'Tutorship Payment' 
      // && payment.paymentStatus === 'successful'
    ).length;
  };


  const getPlayedMatches = () => {
    return userHistory.filter(game => game.gameStatus === 'Played').length;
  }

  const getUnplayedMatches = () => {
    return userHistory.filter(game => game.gameStatus === 'Unplayed').length;
  }

  return(
    <View style={styles.container}>
      
      <View style={styles.topBox}>
        <LinearGradient colors={[COLORS.redThemeColorOne, COLORS.redThemeColorTwo]} style={styles.gradBox}>
        <View style={styles.statusBar}></View>
        <TouchableOpacity style={styles.bellBtnBox} onPress={() => navigation.navigate('Notifications')}>
            {
            userNotifications && 
            userNotifications.some(notification => notification.isRead === 0) && <FontAwesomeIcon icon={faCircle} 
            color={'red'} size={RFValue(7)} style={styles.noticeBall}/>}
            <FontAwesomeIcon icon={faBell} size={RFValue(16)} color={COLORS.whiteText}/>
        </TouchableOpacity>
        </LinearGradient>

        {user?.image 
        ? <Animatable.Image source={{uri: userImage}} style={styles.profileImg} animation={'fadeInUp'} delay={500}/>
        : <Animatable.Image source={require('../../../assets/images/userIcon.png')} style={styles.profileImg} animation={'fadeInUp'} delay={500}/> }
      </View>

      <View style={styles.bottomBox}> 
          <Image source={require('../../../assets/images/splash-icon-white.png')} style={styles.logoIcon}/>

          <ScrollView 
          showsVerticalScrollIndicator={false} 
          horizontal={false} 
          contentContainerStyle={{paddingBottom: height * 0.25, 
            paddingTop: height * 0.08, paddingHorizontal: width * 0.06}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.redThemeColorOne]} // Android
                tintColor={COLORS.redThemeColorOne} // iOS
                title="Pull to refresh" // iOS
                titleColor={COLORS.redThemeColorOne} // iOS
              />
            }
            >
              <Animatable.Text animation={'fadeInUp'} delay={1000} style={styles.name}>{data?.name}</Animatable.Text>
              <Animatable.Text animation={'fadeInUp'} delay={1000} style={styles.username}>@{data?.username}</Animatable.Text>

              {/* <Animatable.View style={styles.matchBox} animation={'fadeInUp'} delay={1000}>
                <TouchableOpacity style={styles.matchBtnBox} onPress={() => setShow(!show)} activeOpacity={0.8}>
                  <View style={styles.matchColOne}>
                    <FontAwesomeIcon icon={faGamepad} size={RFValue(20)} color={COLORS.whiteText}/>
                  </View>
                  <View style={styles.matchColTwo}>
                      <Text style={styles.matchBtnText}>Learn how to play</Text>
                  </View>
                </TouchableOpacity>
              </Animatable.View> */}

              <Animatable.View style={styles.matchBox} animation={'fadeInUp'} delay={1000}>
                    <LinearGradient colors={['#fff3f3', '#ffe6e6']} style={styles.learnBoxGradient}>
                      <Text style={styles.learnHeader}>LEARN HOW TO PLAY</Text>
                      <Text style={styles.learnBrief}>Subscribe for expert tutorship and master the game effortlessly!</Text>
                      <TouchableOpacity style={styles.learnBtn} onPress={() => navigation.navigate('TutorshipSubscription')} activeOpacity={0.8}>
                        <Text style={styles.learnBtnText}>Subscribe Now</Text>
                      </TouchableOpacity>
                      {/* <Text>LEARN HOW TO PLAY</Text> */}
                    <Image source={require('../../../assets/images/game-two.png')} style={styles.learnImg}/>
                    </LinearGradient>
              </Animatable.View>


              <Animatable.View animation={'fadeInUp'} delay={1000} style={styles.flexBox}>

                  <TouchableOpacity style={[styles.buttonBox]} activeOpacity={0.8}>
                    {/* <View style={styles.iconBox}>
                      <FontAwesomeIcon icon={faChartLine} size={RFValue(14)} color={'#27375c'} />
                    </View> */}
                    <View style={styles.textBox}>
                      <Text style={styles.textTxt}>Total Matches</Text>
                      <Text style={styles.textNumber}>{matches}</Text>
                    </View>
                    <View style={styles.textBoxTwo}>
                      <Text style={styles.textTxtTwo}>Played: {getPlayedMatches()}  |  Unplayed: {getUnplayedMatches()}</Text>
                    </View>
                    <Image source={require('../../../assets/images/match-played.png')} style={styles.mpImg}/>
                    <FontAwesomeIcon icon={faChevronCircleRight} color={'#de7c1b'} style={styles.learnIcon}/>
                  </TouchableOpacity>


                  <TouchableOpacity style={[styles.buttonBox, styles.buttonBoxTwo]} activeOpacity={0.8}>
                    {/* <View style={styles.iconBox}>
                      <FontAwesomeIcon icon={faChartLine} size={RFValue(14)} color={'#27375c'} />
                    </View> */}
                    <View style={styles.textBox}>
                      <Text style={styles.textTxt}>Subscriptions</Text>
                      <Text style={[styles.textNumber, styles.textNumberTwo]}>{subscriptions}</Text>
                    </View>
                    <View style={styles.textBoxTwo}>
                      <Text style={styles.textTxtTwo}>Membership: {getMembershipCount()}  |  Tutorship: {getTutorshipCount()}</Text>
                    </View>
                    <Image source={require('../../../assets/images/subscriptions.png')} style={styles.mpImg}/>
                    <FontAwesomeIcon icon={faChevronCircleRight} color={'#3b3b80'} style={styles.learnIcon}/>
                  </TouchableOpacity>


                  {/* <TouchableOpacity style={[styles.buttonBox, styles.buttonBoxTwo]} activeOpacity={0.8}>
                    <View style={styles.iconBox}>
                      <FontAwesomeIcon icon={faHistory} size={RFValue(14)} color={'#5d824f'} />
                    </View>
                    <View style={styles.textBox}>
                      <Text style={styles.textTxt}>Payment History</Text>
                      <Text style={styles.textNumber}>100</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.buttonBox, styles.buttonBoxThree]} activeOpacity={0.8}>
                    <View style={styles.iconBox}>
                      <FontAwesomeIcon icon={faUsers} size={RFValue(14)} color={'#86517f'} />
                    </View>
                    <View style={styles.textBox}>
                      <Text style={styles.textTxt}>Pairing</Text>
                      <Text style={styles.textNumber}>10</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.buttonBox, styles.buttonBoxFour]} activeOpacity={0.8}>
                    <View style={styles.iconBox}>
                      <FontAwesomeIcon icon={faGamepad} size={RFValue(16)} color={'#897233'} />
                    </View>
                    <View style={styles.textBox}>
                      <Text style={styles.textTxt}>Match History</Text>
                      <Text style={styles.textNumber}>50</Text>
                    </View>
                  </TouchableOpacity> */}

              </Animatable.View>



              <RecentMatchHistory />



          </ScrollView>


          {membershipPaymentStatus !== 'successful' && <BecomeMember/>}

      </View>
    </View>
  )

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: COLORS.whiteText
  },
  topBox: {
    position: 'relative',
    width: width,
    height: height * 0.20,
  },
  statusBar: {
    position: 'relative',
    width: width,
    backgroundColor: 'transparent',
    height: Platform.OS === 'ios' ? (Platform.isPad ? 24 : 44) : StatusBar.currentHeight || RFValue(60),
  },
  gradBox: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  bottomBox: {
    position: 'relative',
    width: width,
    height: height * 0.80,
    backgroundColor: '#fffbfb',
    overflow: 'hidden',
  },
  logoIcon: {
    position: 'absolute',
    alignSelf: 'center',
    width: width * 0.5,
    height: width * 0.5,
    opacity: 0.04,
    top: RFValue(-80)
  },
  bellBtnBox: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (Platform.isPad ? 34 : 54) + RFValue(20) : StatusBar.currentHeight + RFValue(20) || RFValue(70),
    right: width * 0.05,
  },
  profileImg: {
    position: 'absolute',
    width: width * 0.25,
    height: width * 0.25,
    zIndex: RFValue(10),
    alignSelf: 'center',
    borderRadius: RFValue(100),
    top: height * 0.13,
    // shadowColor: 'rgba(0, 0, 0, 0.5)',
    // shadowOffset: {
    //   width: 0,
    //   height: 10
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    // elevation: 15,
    borderWidth: RFValue(3),
    borderColor: COLORS.whiteText
  },
  name: {
    position: 'relative',
    width: '100%',
    fontSize: RFValue(16),
    fontFamily: 'Nunito-SemiBold',
    color: COLORS.redThemeColorOne,
    textAlign: 'center'
  },
  username: {
    position: 'relative',
    width: '100%',
    fontSize: RFValue(12),
    fontFamily: 'Nunito-Light',
    textAlign: 'center',
    marginBottom: RFValue(20)
  },
  matchBox: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    borderRadius: RFValue(15),
    marginBottom: RFValue(10),
    marginTop: RFValue(10),
  },
  matchBtnBox: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    borderWidth: RFValue(1),
    borderColor: COLORS.redThemeColorOne,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: RFValue(20),
    backgroundColor: COLORS.whiteText
  },
  matchColOne: {
    position: 'relative',
    width: '30%',
    backgroundColor: COLORS.redThemeColorOne,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(9),
    borderRadius: RFValue(20),
    // shadowColor: COLORS.redThemeColorOne,
    // shadowOffset: {
    //   width: 0,
    //   height: 5
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 0.1,
    // elevation: 30,
  },
  matchColTwo: {
    position: 'relative',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchBtnText: {
    position: 'relative',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(12),
    color: COLORS.redThemeColorOne,
  },
  nameTwo: {
    marginTop: RFValue(60),
  },
  flexBox: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonBox: {
    position: 'relative',
    width: '100%',
    minHeight: height * 0.2,
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(20),
    borderRadius: RFValue(5),
    marginBottom: RFValue(10),
    backgroundColor: '#fff1e1',
    justifyContent: 'center',
    // flexWrap: 'wrap',
    overflow: 'hidden'
  },
  buttonBoxTwo: {
    backgroundColor: '#f5f1ff',
  },
  buttonBoxThree: {
    backgroundColor: '#EFE1ED',
  },
  buttonBoxFour: {
    backgroundColor: '#F9F3E2',
  },
  iconBox: {
    position: 'relative',
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(100),
    backgroundColor: COLORS.whiteText,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBox: {
    position: 'relative',
    width: '60%',
    marginLeft: RFValue(8),
    marginBottom: RFValue(10),
  },
  textTxt: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(12),
    color: COLORS.darkText
  },
  textNumber: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(20),
    color: '#de7c1b'
  },
  textNumberTwo: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(20),
    color: '#3b3b80'
  },
  mpImg: {
    position: 'absolute',
    right: RFValue(10),
    width: width * 0.35,
    height: width * 0.35,
    resizeMode: 'contain'
  },
  textBoxTwo: {
    position: 'relative',
    width: '60%',
    marginLeft: RFValue(8),
    marginBottom: RFValue(0),
  },
  textTxtTwo: {
    position: 'relative',
    width: '100%',
    fontSize: RFValue(10),
    fontFamily: 'Nunito-Regular',
    marginBottom: RFValue(5)
  },
  learnIcon: {
    position: 'absolute',
    right: RFValue(10),
    top: RFValue(10)
  },
  noticeBall: {
    position: 'absolute',
    right: RFValue(0),
    top: RFValue(-1),
    zIndex: RFValue(5),
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
  },
  learnBox: {
    position: 'relative',
    width: '100%',
  },
  learnBoxGradient: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    padding: RFValue(20),
    borderRadius: RFValue(5),
    height: RFValue(180)
  },
  learnImg: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    bottom: RFValue(-20),
    right: RFValue(-50)
  },
  learnHeader: {
    position: 'relative',
    width: '50%',
    marginBottom: RFValue(5),
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(18),
    color: COLORS.redThemeColorOne
  },
  learnBrief: {
    position: 'relative',
    width: '60%',
    marginBottom: RFValue(15),
    fontFamily: 'Nunito-Light',
    fontSize: RFValue(10),
    lineHeight: RFValue(16),
    color: COLORS.redThemeColorTwo
  },
  learnBtn: {
    position: 'relative',
    width: RFValue(100),
  },
  learnBtnText: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: RFValue(5),
    paddingVertical: RFValue(8),
    backgroundColor: COLORS.redThemeColorTwo,
    color: COLORS.whiteText,
    borderRadius: RFValue(2),
    textAlign: 'center',
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(10)
  }

});

export default HomeScreen;