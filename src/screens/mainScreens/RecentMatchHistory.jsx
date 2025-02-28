//src/screens/RecentMatchHistory.jsx

import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faChartLine, faGamepad, faHistory, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable'

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const RecentMatchHistory = () => {
  const {user} = useAuth();
  const [show, setShow] = useState(false);
  const historyImg = require('../../../assets/images/history.png');
  const person = require('../../../assets/images/profile.webp');

  const data = {
    name: `${user?.firstName + ' ' + user?.lastName}` || 'John Doe',
    username: user?.userName || 'janedoe'
  }


  return(
    <Animatable.View style={styles.container} animation={'fadeInUp'} delay={1000}>
        <Text style={styles.historyHeader}>Match History</Text>


        <TouchableOpacity style={styles.containerWrapper} activeOpacity={0.8}>

            <View style={styles.imgWrapper}>
                <Image source={person} style={[styles.img, styles.imgOne]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
            </View>
        </TouchableOpacity>


        {show &&
        <View style={styles.noHistoryBox}>
            <Image source={historyImg} style={styles.noHistoryImg}/>
            <Text style={styles.noHistoryText}>You currently have no match history!</Text>
            <Text style={styles.noHistoryTextTwo}>
              When you begin to play games, your match history will be populated and displayed below!
            </Text>
        </View>
        }

    </Animatable.View>
  )

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.whiteText,
  },
  historyHeader: {
    position: 'relative',
    width: '100%',
    marginVertical: RFValue(30),
    marginBottom: RFValue(0),
    color: COLORS.redThemeColorOne,
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(14)
  },
  noHistoryBox: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noHistoryImg: {
    position: 'relative',
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: RFValue(10),
    resizeMode: 'contain'
  },
  noHistoryText: {
    position: 'relative',
    width: '90%',
    color: COLORS.redThemeColorOne,
    textAlign: 'center',
    marginBottom: RFValue(5),
    fontFamily: 'Nunito-SemiBold',
    fontSize: RFValue(12)
  },
  noHistoryTextTwo: {
    position: 'relative',
    width: '90%',
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: RFValue(5),
    fontFamily: 'Nunito-Regular',
    fontSize: RFValue(11),
    lineHeight: RFValue(18)
  },
  containerWrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: COLORS.inputBg,
    padding: RFValue(10),
    marginVertical: RFValue(15),
    borderRadius: RFValue(10)
  },
  imgWrapper: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  img: {
    position: 'relative',
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(50),
    borderWidth: RFValue(2),
    resizeMode: 'contain',
    borderColor: COLORS.whiteText
  },
  imgTwo: {
    margin: RFValue(-3),
    zIndex: RFValue(2)
  }

});

export default RecentMatchHistory;