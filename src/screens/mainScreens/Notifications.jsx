import React, { useEffect, useState } from 'react';
import { View, Text, Image, Switch, ActivityIndicator, StyleSheet, Platform, Dimensions, RefreshControl, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { useNotificationStore } from '../../store/notificationStore';
import { useToast } from '../../context/ToastContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS } from '../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useAppNotificationStore } from '../../store/appNotificationStore';


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


const Notifications = () => {
    const { showToast } = useToast();
    const navigation = useNavigation();
    const { userNotifications, error, fetchUsersNotification, loading, markAsRead} = useAppNotificationStore();
    const notifications = userNotifications?.filter(notification => notification.isRead === 0) || [];
    const [refreshing, setRefreshing] = useState(false);

    const [expandedMessages, setExpandedMessages] = useState({});

    const toggleMessage = (notificationId) => {
        setExpandedMessages(prev => ({
            ...prev,
            [notificationId]: !prev[notificationId] // Toggle state
        }));
    };


    // Add refresh handler
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Run all refresh functions in parallel
      await Promise.all([
        fetchUsersNotification()
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUsersNotification]);

    // console.log(notifications);


    const refreshNotifications = async () => {
        await fetchUsersNotification();
    }


    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        
        // Handle invalid dates
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
      
        // Array for month names
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
      
        // Get date components
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        // Add ordinal suffix to day
        const ordinalSuffix = (day) => {
          if (day > 3 && day < 21) return 'th';
          switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
          }
        };
      
        // Format time
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)
        
        // Format the final string
        return `${day}${ordinalSuffix(day)} ${month}, ${year} | ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      };


      const handleRead = async (notificationId) => {
        try {
            const success = await markAsRead(notificationId);
            if (success) {
                await fetchUsersNotification();
                showToast('Notification marked as read');
            } else {
                showToast('Failed to mark notification as read', 'error');
            }
        } catch (error) {
            console.error('Error handling notification:', error);
            showToast('An error occurred', 'error');
        }
    };

    // console.log(notifications)



    if(loading){
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={RFValue(20)} color={COLORS.redThemeColorOne}/>
                <Text style={styles.loadingText}>Loading Notification...</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackBtn}>
                    <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }


    if(error){
        return(
            <View style={styles.errorContainer}>
                <FontAwesomeIcon icon={faExclamationTriangle} size={RFValue(70)} 
                style={styles.errorIcon} color={COLORS.redThemeColorOne}/>
                <Text style={styles.loadingText}>{error || "Error Fetching Notifications"}</Text>
                <View style={styles.errorActionBox}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
                        <Text style={styles.goBackText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={refreshNotifications} style={styles.retryBtn}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
                <Text style={styles.title}>Notifications</Text>
            </View>

            {notifications && notifications.length > 0 ?
            
            <Animatable.View style={styles.notificationBox} animation={'fadeInUp'} delay={500}>
                <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{paddingBottom: RFValue(100), paddingTop: RFValue(20)}}
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
                    {
                        notifications.map((notice, key) => {
                            const {notificationId, message, isRead, createdAt, title} = notice;
                            const isExpanded = expandedMessages[notificationId];
                            const shouldShowButton = message.length > 50;
                            const displayedMessage = isExpanded ? message : message.slice(0, 50) + (shouldShowButton ? '...' : '');

                            return(
                                <View key={notificationId} style={styles.noticeWrapper}>
                                    <Text style={styles.noticeTitle}>{title}</Text>
                                    <Text style={styles.noticeMessage}>{displayedMessage}</Text>
                                    {shouldShowButton && (
                                        <TouchableOpacity onPress={() => toggleMessage(notificationId)} style={styles.showMoreBtn}>
                                            <Text style={styles.showMoreText}>{isExpanded ? 'Show Less' : 'Show More'}</Text>
                                        </TouchableOpacity>
                                    )}
                                    <Text style={styles.noticeDate}>{formatDateTime(createdAt)}</Text>
                                    <TouchableOpacity style={styles.noticeIconBox} onPress={() => handleRead(notificationId)}>
                                        {loading ? <ActivityIndicator color={COLORS.redThemeColorOne} size={RFValue(12)}/> 
                                        : <FontAwesomeIcon icon={faTimesCircle} color={COLORS.redThemeColorOne} size={RFValue(12)}/>
                                        }
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </Animatable.View>

            : 
            
            <Animatable.View animation={'fadeInUp'} delay={500} style={styles.noNotificationBox}>
                
                    <Animatable.Image source={require('../../../assets/images/notification.png')} 
                    style={styles.notificationImg} animation={'tada'} iterationCount="infinite"
                    />
                        <Text style={styles.noteText}>You currently have no new notifications, please stay tuned for future updates and important announcements.
                    </Text>

            </Animatable.View>

            }


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
    notificationBox: {
        position: 'relative',
        width: width * 0.9,
        alignSelf: 'center',
        height: height,
    },
    noticeWrapper: {
        position: 'relative',
        width: '100%',
        padding: RFValue(15),
        marginBottom: RFValue(10),
        backgroundColor: COLORS.inputBg,
        borderRadius: RFValue(10),
        borderWidth: RFValue(1),
        borderColor: COLORS.listBorderColor
    },
    noticeTitle: {
        position: 'relative',
        width: '90%',
        fontFamily: 'Nunito-SemiBold',
        fontSize: RFValue(12),
        color: COLORS.redThemeColorOne,
        marginBottom: RFValue(5),
    },
    noticeMessage: {
        position: 'relative',
        width: '95%',
        fontFamily: 'Nunito-Light',
        fontSize: RFValue(11),
        lineHeight: RFValue(18),
        color: COLORS.darkText,
    },
    noticeIconBox: {
        position: 'absolute',
        right: RFValue(10),
        top: RFValue(15)
    },
    showMoreBtn: {
        position: 'relative',
        alignSelf: 'flex-start',
    },
    showMoreText: {
        position: 'relative',
        fontSize: RFValue(10),
        color: COLORS.redThemeColorTwo
    },
    noticeDate: {
        position: 'relative',
        alignSelf: 'flex-start',
        marginTop: RFValue(15),
        fontFamily: 'Nunito-Light',
        fontSize: RFValue(9.5),
        color: COLORS.redThemeColorTwo
    },
    noNotificationBox: {
        position: 'relative',
        width: width * 0.9,
        alignSelf: 'center',
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationImg: {
        position: 'relative',
        width: width * 0.35,
        height: width * 0.35,
        resizeMode: 'contain'
    },
    noteText: {
        position: 'relative',
        width: '80%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: RFValue(12),
        lineHeight: RFValue(20),
        fontFamily: 'Nunito-Light',
        color: COLORS.authText
    },
    loadingContainer: {
        position: 'relative',
        width: width,
        height: height,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      errorContainer: {
        position: 'relative',
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
      },
      loadingText: {
        position: 'relative',
        fontSize: RFValue(14),
        fontFamily: 'Nunito-SemiBold',
        marginLeft: RFValue(5),
        color: COLORS.redThemeColorOne
      },
      goBackBtn: {
        position: 'absolute',
        top: height * 0.54,
      },
      goBackText: {
        position: 'relative',
        backgroundColor: COLORS.redThemeColorOne,
        color: COLORS.whiteText,
        paddingHorizontal: RFValue(30),
        paddingVertical: RFValue(10),
        borderRadius: RFValue(3),
        fontSize: RFValue(10),
        fontFamily: 'Nunito-SemiBold'
      },
      errorIcon: {
        position: 'relative',
        marginBottom: RFValue(15)
      },
      errorActionBox: {
        position: 'relative',
        width: width * 0.9,
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: RFValue(15),
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
      },
      cancelBtn: {
        position: 'relative',
        marginHorizontal: RFValue(3)
      },
      retryBtn: {
        position: 'relative',
        marginHorizontal: RFValue(3)
      },
      retryBtnText: {
        position: 'relative',
        backgroundColor: COLORS.redThemeColorTwo,
        color: COLORS.whiteText,
        paddingHorizontal: RFValue(30),
        paddingVertical: RFValue(10),
        borderRadius: RFValue(3),
        fontSize: RFValue(10),
        fontFamily: 'Nunito-SemiBold'
      },
});

export default Notifications;