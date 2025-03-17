import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, FlatList, Platform, StatusBar, TextInput, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../components/common/ThemeProvider';
import { logout } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faChevronCircleRight, faChevronDown, faChevronRight, faHistory, faLongArrowLeft, faSignOut, faSignOutAlt, faUserGear, faUserLock, faSearch } from '@fortawesome/free-solid-svg-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../utils/colors';
import api from '../../services/api';
import { useHistoryStore } from '../../store/historyStore';
import _ from 'lodash'; // Import lodash

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const HistoryScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { showToast } = useToast();
  const {user} = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const historyImg = require('../../../assets/images/history.png');
  const person = require('../../../assets/images/profile.webp');
  const [refreshing, setRefreshing] = useState(false);
  const {userHistory, fetchUsersHistory} = useHistoryStore();


  // Debounce the search query
  const debouncedSearch = useCallback(
    _.debounce((query) => {
      const lowerCaseQuery = query.toLowerCase();
      const filteredData = userHistory.filter(item =>
        item.skillLevel.toLowerCase().includes(lowerCaseQuery) ||
        item.scheduledDate.toLowerCase().includes(lowerCaseQuery) ||
        item.gameStatus.toLowerCase().includes(lowerCaseQuery) ||
        item.pairMembersData.some(member =>
          member.userName.toLowerCase().includes(lowerCaseQuery)
        ) ||
        item.id.toString().includes(lowerCaseQuery)
      );

      setFilteredHistory(filteredData);
    }, 300), // Adjust debounce delay as needed
    [userHistory]
  );


  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);


  const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      try {
        await Promise.all([
          fetchUsersHistory()
        ]);
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setRefreshing(false);
      }
    }, [fetchUsersHistory]);
  

  const renderItem = ({ item }) => {
    const { id, userImage, skillLevel, pairMembersData, scheduledDate, gameStatus, groupName } = item;
    
    return (
      <Animatable.View animation={'fadeInUp'} style={styles.navBtnWrapper}>
        <TouchableOpacity style={styles.containerWrapper} activeOpacity={0.8}>
          <View style={styles.innerWrap}>
            <Image source={{uri: `https://mahjon-db.goldenrootscollectionsltd.com/imageUploads/mahjong-uploads/${userImage}`}} style={styles.mainImg}/>
            <View style={styles.innerTextWrap}>
              <Text style={styles.skillTitle}>
                Skill Level: <Text style={styles.skillText}>{skillLevel}</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.pairsText}>Pair Members</Text>

          <View style={styles.imgWrapper}>
            {pairMembersData.map((pair) => (
              <Image  key={pair.dataId} source={{uri: `https://mahjon-db.goldenrootscollectionsltd.com/imageUploads/mahjong-uploads/${pair.image}`}} style={styles.img}/>
            ))}
          </View>

          <View style={styles.nameBox}>
            {pairMembersData.map((pair) => (
              <Text key={pair.dataId} style={styles.nameText}>@{pair.userName} | </Text>
            ))}
          </View>
          
          <Text style={styles.scheduleTxt}>Scheduled Date: {scheduledDate || 'Not yet defined'}</Text>
          <Text style={styles.statusText}>Game Status: {gameStatus}</Text>

          <FontAwesomeIcon icon={faChevronCircleRight} size={RFValue(16)} color={COLORS.redThemeColorOne} style={styles.viewIcon}/>

          <Text style={styles.groupNameText}>{groupName}</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const renderEmptyState = () => (
    <Animatable.View animation={'fadeIn'} style={styles.emptyStateContainer}>
      <Image source={historyImg} style={styles.emptyStateImage}/>
      <Text style={styles.emptyStateText}>
        {searchQuery.trim() ? `No matches found for "${searchQuery}"`: "No match history available"}
      </Text>
    </Animatable.View>
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.statusBar}></View>

      <Text style={styles.pageTitle}>Match History</Text>

      <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={1000}>
        <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
      </Animatable.View>

      <Animatable.View animation={'fadeInDown'} style={styles.searchContainer}>
        <FontAwesomeIcon icon={faSearch} size={RFValue(16)} color={COLORS.redThemeColorOne} style={styles.searchIcon}/>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={COLORS.redThemeColorTwo05}
          selectionColor={COLORS.redThemeColorOne}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animatable.View>

      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Animatable.View animation="fadeIn" style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              {searchQuery.trim() ? `No matches found for "${searchQuery}"` : "No match history available"}
            </Text>
          </Animatable.View>
        )}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.redThemeColorOne]} />
        }
      />
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
    flatListContent: {
      paddingBottom: RFValue(50),
      paddingTop: RFValue(20),
      flexGrow: 1, // Important for empty state centering
    },
    innerContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: COLORS.whiteText
    },
    statusBar: {
      width: width,
      position: 'relative',
      backgroundColor: 'transparent',
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
      width: width * 0.34,
      height: width * 0.18,
      alignSelf: 'center',
      resizeMode: 'contain',  
    },
    pageTitle: {
      position: 'relative',
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: RFValue(14),
      fontFamily: 'Nunito-SemiBold',
      color: COLORS.redThemeColorOne
    },
    navBtnWrapper: {
      position: 'relative',
      width: width * 0.9,
      alignSelf: 'center',
      marginBottom: RFValue(10),
      borderRadius: RFValue(5)
    },
    navBtnBox: {
      position: 'relative',
      width: '100%',
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(17),
      backgroundColor: COLORS.inputBg,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: RFValue(5)
    },
    navBtnIconLeft: {
      position: 'relative',
      marginRight: RFValue(15),
    },
    navBtnText: {
      position: 'relative',
      width: '70%',
      fontSize: RFValue(12),
      fontFamily: 'Nunito-Regular',
      color: COLORS.redThemeColorTwo
    },
    navBtnIconRight: {
      position: 'absolute',
      right: RFValue(10)
    },
    logoutButton: {
      position: 'relative',
      width: '100%',
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(17),
      backgroundColor: COLORS.redThemeColorOne,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: RFValue(5)
    },
    logoutButtonText: {
      position: 'relative',
      width: '70%',
      fontSize: RFValue(12),
      fontFamily: 'Nunito-Regular',
      color: COLORS.whiteText
    },
    searchContainer: {
      position: 'relative',
      width: width * 0.9,
      alignSelf: 'center',
      marginTop: RFValue(15),
      marginBottom: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: COLORS.inputBg,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: RFValue(10),
    },
    searchIcon: {
      marginRight: RFValue(10),
    },
    searchInput: {
      flex: 1,
      height: RFValue(45),
      color: COLORS.redThemeColorTwo,
      fontFamily: 'Nunito-Regular',
      fontSize: RFValue(12),
    },
    containerWrapper: {
      position: 'relative',
      width: '100%',
      backgroundColor: COLORS.inputBg,
      padding: RFValue(10),
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
      paddingLeft: RFValue(1),
    },
    img: {
      position: 'relative',
      width: RFValue(25),
      height: RFValue(25),
      borderRadius: RFValue(50),
      borderWidth: RFValue(2),
      resizeMode: 'contain',
      borderColor: COLORS.whiteText,
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
      marginBottom: RFValue(20)
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
      marginBottom: RFValue(10)
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
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: height * 0.5,
    },
    emptyStateImage: {
      width: RFValue(100),
      height: RFValue(100),
      resizeMode: 'contain',
      opacity: 0.9,
      marginBottom: RFValue(10)
    },
    emptyStateText: {
      fontFamily: 'Nunito-Regular',
      fontSize: RFValue(14),
      color: COLORS.redThemeColorTwo,
      textAlign: 'center',
      opacity: 0.9
    },
    groupNameText: {
      position: 'relative',
      alignSelf: 'flex-end',
      fontFamily: 'Nunito-SemiBold',
      fontSize: RFValue(14),
      color: COLORS.redThemeColorTwo,
      opacity: 0.3
    }
    
});

export default HistoryScreen;