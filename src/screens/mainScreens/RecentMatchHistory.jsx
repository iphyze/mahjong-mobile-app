//src/screens/RecentMatchHistory.jsx

import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faChartLine, faCheckCircle, faChevronCircleRight, faGamepad, faHistory, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
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
            <View style={styles.innerWrap}>
              <Image source={person} style={styles.mainImg}/>
              <View style={styles.innerTextWrap}>
                <Text style={styles.skillTitle}>Skill Level: <Text style={styles.skillText}>Intermediate</Text></Text>
              </View>
            </View>

            <Text style={styles.pairsText}>Pair Members</Text>

            <View style={styles.imgWrapper}>
                <Image source={person} style={[styles.img, styles.imgOne]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
            </View>

            <View style={styles.nameBox}>
              <Text style={styles.nameText}>@sam | @james | @kelly</Text>
            </View>
            
            <Text style={styles.scheduleTxt}>Scheduled Date: 8th Feb, 2025 | 12:00PM</Text>
            <Text style={styles.statusText}>Game Status: Unplayed</Text>

            <FontAwesomeIcon icon={faChevronCircleRight} size={RFValue(16)} 
            color={COLORS.redThemeColorOne} style={styles.viewIcon}/>
        </TouchableOpacity>


        <TouchableOpacity style={styles.containerWrapper} activeOpacity={0.8}>
            <View style={styles.innerWrap}>
              <Image source={person} style={styles.mainImg}/>
              <View style={styles.innerTextWrap}>
                <Text style={styles.skillTitle}>Skill Level: <Text style={styles.skillText}>Intermediate</Text></Text>
              </View>
            </View>

            <Text style={styles.pairsText}>Pair Members</Text>

            <View style={styles.imgWrapper}>
                <Image source={person} style={[styles.img, styles.imgOne]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
            </View>

            <View style={styles.nameBox}>
              <Text style={styles.nameText}>@sam | @james | @kelly</Text>
            </View>
            
            <Text style={styles.scheduleTxt}>Scheduled Date: 8th Feb, 2025 | 12:00PM</Text>
            <Text style={styles.statusText}>Game Status: Unplayed</Text>

            <FontAwesomeIcon icon={faChevronCircleRight} size={RFValue(16)} 
            color={COLORS.redThemeColorOne} style={styles.viewIcon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.containerWrapper} activeOpacity={0.8}>
            <View style={styles.innerWrap}>
              <Image source={person} style={styles.mainImg}/>
              <View style={styles.innerTextWrap}>
                <Text style={styles.skillTitle}>Skill Level: <Text style={styles.skillText}>Intermediate</Text></Text>
              </View>
            </View>

            <Text style={styles.pairsText}>Pair Members</Text>

            <View style={styles.imgWrapper}>
                <Image source={person} style={[styles.img, styles.imgOne]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
                <Image source={person} style={[styles.img, styles.imgTwo]}/>
            </View>

            <View style={styles.nameBox}>
              <Text style={styles.nameText}>@sam | @james | @kelly</Text>
            </View>
            
            <Text style={styles.scheduleTxt}>Scheduled Date: 8th Feb, 2025 | 12:00PM</Text>
            <Text style={styles.statusText}>Game Status: Unplayed</Text>

            <FontAwesomeIcon icon={faChevronCircleRight} size={RFValue(16)} 
            color={COLORS.redThemeColorOne} style={styles.viewIcon}/>
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
    marginTop: RFValue(15),
    borderRadius: RFValue(10)
  },
  imgWrapper: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: RFValue(5),
    width: '50%',
  },
  img: {
    position: 'relative',
    width: RFValue(25),
    height: RFValue(25),
    borderRadius: RFValue(50),
    borderWidth: RFValue(2),
    resizeMode: 'contain',
    borderColor: COLORS.whiteText
  },
  imgTwo: {
    margin: RFValue(-3),
    zIndex: RFValue(2)
  },
  innerWrap: {
    position: 'relative',
    width: '100%',
    marginBottom: RFValue(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mainImg: {
    position: 'relative',
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(50),
    borderWidth: RFValue(2),
    borderColor: COLORS.listBorderColor,
  },
  innerTextWrap: {
    position: 'relative',
    maxWidth: '100%',
    marginLeft: RFValue(10),
    padding: RFValue(5),
    borderRadius: RFValue(5),
    backgroundColor: COLORS.whiteText,
  },
  skillTitle: {
    position: 'relative',
    fontSize: RFValue(9.5),
    fontFamily: 'Nunito-SemiBold',
    color: COLORS.redThemeColorTwo
  },
  skillText: {
    position: 'relative',
    alignSelf: 'flex-start',
    fontSize: RFValue(9.5),
    fontFamily: 'Nunito-Light',
    color: COLORS.redThemeColorOne
  },
  nameBox: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: RFValue(5)
  },
  nameText: {
    position: 'relative',
    fontSize: RFValue(10),
    fontFamily: 'Nunito-Light',
    color: COLORS.redThemeColorOne
  },
  viewIcon: {
    position: 'absolute',
    top: RFValue(15),
    right: RFValue(10)
  },
  pairsText: {
    position: 'relative',
    width: '100%',
    fontFamily: 'Nunito-Bold',
    fontSize: RFValue(10),
    color: COLORS.redThemeColorOne,
    marginBottom: RFValue(3)
  },
  scheduleTxt: {
    position: 'relative',
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginTop: RFValue(5),
    padding: RFValue(5),
    borderRadius: RFValue(5),
    backgroundColor: COLORS.redThemeColorOne,
    color: COLORS.whiteText,
    fontSize: RFValue(10),
    fontFamily: 'Nunito-Light',
    marginBottom: RFValue(5)
  },
  statusText: {
    position: 'relative',
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginTop: RFValue(5),
    padding: RFValue(5),
    borderRadius: RFValue(5),
    backgroundColor: COLORS.whiteText,
    color: COLORS.redThemeColorTwo,
    fontSize: RFValue(10),
    fontFamily: 'Nunito-SemiBold',
    marginBottom: RFValue(5)
  }

});

export default RecentMatchHistory;