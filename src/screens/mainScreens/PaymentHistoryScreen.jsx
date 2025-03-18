import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, FlatList, Platform, StatusBar, TextInput, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../components/common/ThemeProvider';
import { logout } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faChevronCircleRight, faChevronDown, faChevronRight, faHistory, faLongArrowLeft, faSignOut, faSignOutAlt, faUserGear, faUserLock, faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../utils/colors';
import api from '../../services/api';
import { usePaymentStore } from '../../store/paymentStore';
import _ from 'lodash'; // Import lodash

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const PaymentHistoryScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { showToast } = useToast();
  const {user} = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const historyImg = require('../../../assets/images/history.png');
  const person = require('../../../assets/images/profile.webp');
  const [refreshing, setRefreshing] = useState(false);
  const {userPayment, fetchUsersPayment} = usePaymentStore();


  // Debounce the search query
  const debouncedSearch = useCallback(
    _.debounce((query) => {
      const lowerCaseQuery = query.toLowerCase();
      const filteredData = userPayment.filter(item =>
        item.payment_type.toLowerCase().includes(lowerCaseQuery) ||
        item.paymentDate.toLowerCase().includes(lowerCaseQuery) ||
        item.paymentStatus.toLowerCase().includes(lowerCaseQuery) ||
        item.transactionReference.toLowerCase().includes(lowerCaseQuery) ||
        item.paymentDuration.toLowerCase().includes(lowerCaseQuery) ||
        item.transactionId.toLowerCase().includes(lowerCaseQuery) ||
        item.id.toString().includes(lowerCaseQuery) ||
        item.amount.toString().includes(lowerCaseQuery)
      );

      setFilteredHistory(filteredData);
    }, 300), // Adjust debounce delay as needed
    [userPayment]
  );


  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);


  const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      try {
        await Promise.all([
          fetchUsersPayment()
        ]);
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setRefreshing(false);
      }
    }, [fetchUsersPayment]);
  

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount).replace('NGN', '₦');
      };
    
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${month} ${year}`;
      };

  const renderItem = ({ item }) => {
    const { id, payment_type, transactionReference, amount, paymentDate, paymentDuration, paymentStatus } = item;
    
    return (
        <Animatable.View animation={'fadeInUp'} style={styles.paymentWrapper}>

        <TouchableOpacity style={styles.paymentBtn} activeOpacity={0.8}>
            <View style={styles.paymentHeader}>
                <Text style={styles.pymtTypeText}>{payment_type === 'Membership Payment' ? 'MP' : payment_type === 'Tutorship Payment' ? 'TP' : 'Undefined'}</Text>
                <View style={styles.pymtTextBox}>
                    <Text style={styles.pymtText}>{payment_type || 'Undefined'}</Text>
                    <Text style={styles.pymtRef}>{transactionReference || 'Undefined'}</Text>
                    <Text style={styles.pymtAmount}>{formatAmount(amount || 0.00)}</Text>
                </View>
            </View>
            <View style={styles.pymtDateBox}>
                <Text style={styles.pymtDate}>{formatDate(paymentDate || '')}</Text>
                <FontAwesomeIcon icon={faCalendar} style={styles.pymtIcon} color={COLORS.redThemeColorTwo} size={RFValue(11)}/>
            </View>
            <View style={styles.pymtFooter}>
                <Text style={styles.pymtPeriod}>Period: {paymentDuration || 'Undefined'}</Text>
                <Text style={styles.pymtStatus}>{paymentStatus || 'Undefined'}</Text>
            </View>
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

      <Text style={styles.pageTitle}>Payment History</Text>

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
              {searchQuery.trim() ? `No payments found for "${searchQuery}"` : "No payment history available"}
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
    paymentWrapper: {
        position: 'relative',
        width: width * 0.9,
        alignSelf: 'center',
        marginVertical: RFValue(10)
    },
    paymentBtn: {
        position: 'relative',
        width: '100%',
        borderLeftWidth: RFValue(3),
        borderLeftColor: COLORS.redThemeColorOne,
        borderRadius: RFValue(3),
        backgroundColor: '#fffafa',
        paddingVertical: RFValue(20),
        paddingHorizontal: RFValue(10),
    },
    paymentHeader: {
        position: 'relative',
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: RFValue(5)
    },
    pymtTypeText: {
        position: 'relative',
        width: RFValue(30),
        height: RFValue(30),
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: RFValue(30),
        backgroundColor: COLORS.redThemeColorOne,
        color: COLORS.whiteText,
        borderRadius: RFValue(50),
        fontSize: RFValue(11),
        fontFamily: 'Nunito-SemiBold',
        marginRight: RFValue(5)
    },
    pymtTextBox: {
        position: 'relative',
        width: '70%',
        marginLeft: RFValue(5)
    },
    pymtText: {
        position: 'relative',
        width: '100%',
        // lineHeight: RFValue(30),
        color: COLORS.redThemeColorTwo,
        fontSize: RFValue(12),
        fontFamily: 'Nunito-Bold',
        marginBottom: RFValue(5)
    },
    pymtRef: {
        position: 'relative',
        width: '100%',
        color: COLORS.redThemeColorOne,
        fontSize: RFValue(10),
        fontFamily: 'Nunito-Light',
        marginBottom: RFValue(10)
    },
    pymtAmount: {
        position: 'relative',
        fontSize: RFValue(10),
        fontFamily: 'Nunito-SemiBold',
        marginBottom: RFValue(20),
        backgroundColor: COLORS.redThemeColorOne,
        color: COLORS.whiteText,
        alignSelf: 'flex-start',
        borderRadius: RFValue(3),
        padding: RFValue(5)
    },
    pymtDateBox: {
        position: 'absolute',
        top: RFValue(10),
        right: RFValue(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    pymtDate: {
        position: 'relative',
        fontSize: RFValue(10),
        marginRight: RFValue(5),
        fontFamily: 'Nunito-Regular',
        color: COLORS.redThemeColorTwo
    },
    pymtFooter: {
        position: 'absolute',
        right: RFValue(10),
        bottom: RFValue(10),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    pymtStatus: {
        position: 'relative',
        fontSize: RFValue(10),
        fontFamily: 'Nunito-SemiBold',
        backgroundColor: COLORS.inputBg,
        color: COLORS.redThemeColorOne,
        paddingHorizontal: RFValue(5),
        paddingVertical: RFValue(5),
        marginLeft: RFValue(5)
    },
    pymtPeriod: {
        position: 'relative',
        color: COLORS.redThemeColorOne,
        fontSize: RFValue(10),
        fontFamily: 'Nunito-SemiBold',
        backgroundColor: COLORS.inputBg,
        color: COLORS.redThemeColorOne,
        paddingHorizontal: RFValue(5),
        paddingVertical: RFValue(5),
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

export default PaymentHistoryScreen;