//src/screens/HomeScreen.jsx

import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, Image, Platform, StatusBar, TouchableOpacity, ImageBackground} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faChartLine, faCircle, faGamepad, faHistory, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable'
import { BlurView } from 'expo-blur';
import BecomeMember from './BecomeMember';
import RecentMatchHistory from './RecentMatchHistory';
import { useAppNotificationStore } from '../../store/appNotificationStore';


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const HomeScreen = () => {
  const {user} = useAuth();
  const [show, setShow] = useState(true);
  const { userNotifications, error, fetchUsersNotification, loading} = useAppNotificationStore();
  
  // console.log(userNotifications);


  const data = {
    name: `${user?.firstName + ' ' + user?.lastName}` || 'John Doe',
    username: user?.userName || 'janedoe'
  }

  // console.log(user);

  return(
    <View style={styles.container}>
      
      <View style={styles.topBox}>
        <LinearGradient colors={[COLORS.redThemeColorOne, COLORS.redThemeColorTwo]} style={styles.gradBox}>
        <View style={styles.statusBar}></View>
        <TouchableOpacity style={styles.bellBtnBox}>
            {
            userNotifications && userNotifications.length > 0 && <FontAwesomeIcon icon={faCircle} 
            color={'red'} size={RFValue(7)} style={styles.noticeBall}/>}
            <FontAwesomeIcon icon={faBell} size={RFValue(16)} color={COLORS.whiteText}/>
        </TouchableOpacity>
        </LinearGradient>

        <Animatable.Image source={require('../../../assets/images/profile.webp')} style={styles.profileImg} animation={'fadeInUp'} delay={500}/>
      </View>

      <View style={styles.bottomBox}> 
          <Image source={require('../../../assets/images/splash-icon-white.png')} style={styles.logoIcon}/>

          <ScrollView showsVerticalScrollIndicator={false} horizontal={false} contentContainerStyle={{paddingBottom: height * 0.25, 
            paddingTop: height * 0.08, paddingHorizontal: width * 0.06}}>
              <Animatable.Text animation={'fadeInUp'} delay={1000} style={styles.name}>{data?.name}</Animatable.Text>
              <Animatable.Text animation={'fadeInUp'} delay={1000} style={styles.username}>@{data?.username}</Animatable.Text>

              <Animatable.View style={styles.matchBox} animation={'fadeInUp'} delay={1000}>
                <TouchableOpacity style={styles.matchBtnBox} onPress={() => setShow(!show)} activeOpacity={0.8}>
                  <View style={styles.matchColOne}>
                    <FontAwesomeIcon icon={faGamepad} size={RFValue(20)} color={COLORS.whiteText}/>
                  </View>
                  <View style={styles.matchColTwo}>
                      <Text style={styles.matchBtnText}>Learn how to play</Text>
                  </View>
                </TouchableOpacity>
              </Animatable.View>


              <Animatable.View animation={'fadeInUp'} delay={1000} style={styles.flexBox}>

                  <TouchableOpacity style={[styles.buttonBox]} activeOpacity={0.8}>
                    <View style={styles.iconBox}>
                      <FontAwesomeIcon icon={faChartLine} size={RFValue(14)} color={'#27375c'} />
                    </View>
                    <View style={styles.textBox}>
                      <Text style={styles.textTxt}>Matches Played</Text>
                      <Text style={styles.textNumber}>150</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.buttonBox, styles.buttonBoxTwo]} activeOpacity={0.8}>
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
                  </TouchableOpacity>

              </Animatable.View>



              <RecentMatchHistory />



          </ScrollView>


          {show && <BecomeMember setShow={setShow} show={show}/>}

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
    width: width * 0.3,
    height: width * 0.3,
    zIndex: RFValue(10),
    alignSelf: 'center',
    borderRadius: RFValue(100),
    top: height * 0.12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  name: {
    position: 'relative',
    width: '100%',
    fontSize: RFValue(20),
    fontFamily: 'Nunito-Bold',
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
    marginBottom: RFValue(20),
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
    shadowColor: COLORS.redThemeColorOne,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.5,
    shadowRadius: 0.1,
    elevation: 30,
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
    width: '48.5%',
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(20),
    borderRadius: RFValue(10),
    marginBottom: RFValue(10),
    backgroundColor: '#E1E6F2',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  buttonBoxTwo: {
    backgroundColor: '#E6F7E0',
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
  },
  textTxt: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(9)
  },
  textNumber: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(12)
  },
  noticeBall: {
    position: 'absolute',
    right: RFValue(0),
    top: RFValue(-1),
    zIndex: RFValue(5),
  }
  


});

export default HomeScreen;