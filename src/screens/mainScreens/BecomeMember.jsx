//src/screens/BecomeMember.jsx

import React, { useState } from 'react';
import {Text, StyleSheet, Dimensions, Platform, StatusBar, TouchableOpacity, ImageBackground, View} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faGamepad, faLock } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const BecomeMember = ({show, setShow}) => {
  const {user} = useAuth();
  const navigation = useNavigation();

  const data = {
    name: `${user?.firstName + ' ' + user?.lastName}` || 'John Doe',
    username: user?.userName || 'janedoe'
  }

  // console.log(user);

  return(

    <Animatable.View style={styles.unlockBlock} animation={show ? 'fadeInUp' : 'fadeInDown'}>
    <ImageBackground style={styles.blurContainer} blurRadius={10} source={require('../../../assets/images/blurbg.png')}>
        <Animatable.Text animation={'fadeInDown'} delay={1000} style={[styles.name, styles.nameTwo]}>{data?.name}</Animatable.Text>
        <Animatable.Text animation={'fadeInDown'} delay={1000} style={[styles.username, styles.username]}>@{data?.username}</Animatable.Text>
        <Animatable.View style={styles.becomeBtnBox} animation={'fadeInUp'} delay={1000}>
            <TouchableOpacity style={styles.becomeBtn} onPress={() => navigation.navigate('MembershipPayment')}>
                <Text style={styles.becomeTxt}>Become a member</Text>
            </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation={'fadeInUp'} delay={1000} style={styles.textWrapper}>
            <View style={styles.iconWrapper}>
              <FontAwesomeIcon icon={faLock} size={RFValue(24)} color={COLORS.redThemeColorOne} style={styles.icon}/>
            </View>
            <Text style={styles.textBox}>Become a member to unlock your profile</Text>
        </Animatable.View>
    </ImageBackground>
    </Animatable.View>
        
    )

}


const styles = StyleSheet.create({
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
  unlockBlock: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height * 0.80,
  },
  blurContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    position: 'absolute',
    zIndex: 10,
    resizeMode: 'cover',
  },
  becomeBtnBox: {
    position: 'relative',
    width: '80%',
    alignSelf: 'center',
    marginBottom: RFValue(20)
  },
  becomeBtn: {
    position: 'relative',
    width: '100%',
  },
  becomeTxt: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(14),
    textAlign: 'center',
    backgroundColor: '#A2790D',
    color: COLORS.whiteText,
    fontSize: RFValue(12),
    fontFamily: 'Nunito-SemiBold',
    borderRadius: RFValue(50)
  },
  nameTwo: {
    marginTop: RFValue(60),
  },
  textWrapper: {
    position: 'relative',
    width: width * 0.7,
    padding: RFValue(20),
    borderRadius: RFValue(10),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: RFValue(20)
  },
  iconWrapper: {
    position: 'relative',
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.whiteText,
    marginBottom: RFValue(10),

    // Shadow for iOS
    shadowColor: COLORS.redThemeColorOne,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  textBox: {
    position: 'relative',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(14),
    color: COLORS.redThemeColorOne
  },
  icon: {
    
  }


});

export default BecomeMember;