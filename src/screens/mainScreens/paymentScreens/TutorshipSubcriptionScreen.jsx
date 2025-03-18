import React, { useEffect, useState } from 'react';
import { View, Text, Image, Switch, ActivityIndicator, StyleSheet, Platform, Dimensions, StatusBar, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useNotificationStore } from '../../../store/notificationStore';
import { useToast } from '../../../context/ToastContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS } from '../../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


const TutorshipSubscriptionScreen = () => {
    const { isEnabled, toggleNotifications } = useNotificationStore();
    const [loading, setLoading] = useState(false);
    const [localEnabled, setLocalEnabled] = useState(isEnabled);
    const { showToast } = useToast();
    const navigation = useNavigation();

    useEffect(() => {
        setLocalEnabled(isEnabled);
    }, [isEnabled]);

    const handleToggle = async () => {
        const newState = !localEnabled;
        setLocalEnabled(newState); // Optimistic update
        setLoading(true);

        try {
            await toggleNotifications();
            showToast(
                `Notifications ${newState ? 'enabled' : 'disabled'} successfully`,
                'success'
            );
        } catch (error) {
            // Revert the optimistic update
            setLocalEnabled(!newState);
            showToast(
                'Failed to update notification settings',
                'error'
            );
            console.error('Toggle notification error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.statusBar}></View>

            <Animatable.View style={styles.iconImgBox} animation={'fadeInLeft'} delay={500}>
                <Image style={styles.iconImg} source={require('../../../../assets/images/splash-icon-white.png')}/>
            </Animatable.View>

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon 
                    icon={faArrowLeftLong} color={COLORS.authText} 
                    style={styles.backBtnIcon}/>
                </TouchableOpacity>
                <Text style={styles.title}>Tutorship Subscription</Text>
            </View>
            
            <ScrollView contentContainerStyle={{paddingBottom: RFValue(100)}} showsVerticalScrollIndicator={false} horizontal={false}>
                <ImageBackground source={require('../../../../assets/images/onb-2.jpg')} style={styles.topImage}>
                    <LinearGradient colors={['#9a00009f', '#561212f4']} style={styles.topGradient}>
                        <Animatable.Text style={styles.majText} animation={'fadeInLeft'} delay={500}>Mahjong Tutorship</Animatable.Text>
                        <Animatable.Text style={styles.majBrief} animation={'fadeInLeft'} delay={800}>
                            Improve your skills with expert-led courses and private coaching
                        </Animatable.Text>
                    </LinearGradient>
                </ImageBackground>


                <Animatable.View style={styles.playersBox} animation={'fadeInUp'} delay={1000}>
                    <Image source={require('../../../../assets/images/4-players.jpg')} style={styles.playersImage}/>
                    <Text style={styles.playersText}>
                        Subscribe now to connect with a skilled coach and elevate your Mahjong skills!
                    </Text>

                    <TouchableOpacity style={styles.playersBtn} activeOpacity={0.8} onPress={() => navigation.navigate('TutorshipPayment')}>
                        <Text style={styles.playersBtnText}>Proceed to Payment Page</Text>
                    </TouchableOpacity>
                </Animatable.View>

            </ScrollView>

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
        flexWrap: 'wrap',
        marginBottom: RFValue(10)
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
    topImage: {
        position: 'relative',
        width: '100%',
        height: height * 0.25,
        resizeMode: 'contain'
    },
    topGradient: {
        position: 'relative',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        padding: RFValue(20),
    },
    majText: {
        position: 'relative',
        width: '70%',
        color: COLORS.whiteText,
        fontSize: RFValue(22),
        fontFamily: 'Nunito-Bold',
        marginBottom: RFValue(5)
    },
    majBrief: {
        position: 'relative',
        width: '70%',
        color: COLORS.whiteText,
        fontSize: RFValue(10),
        lineHeight: RFValue(16),
        fontFamily: 'Nunito-Light',
        marginBottom: RFValue(10)
    },
    playersBox: {
        position: 'relative',
        width: width * 0.9,
        alignSelf: 'center',
        minHeight: height * 0.35,
        paddingVertical: RFValue(20),
    },
    playersImage: {
        position: 'relative',
        width: '100%',
        height: height * 0.3,
        resizeMode: 'contain',
        marginBottom: RFValue(0),
    },
    playersText: {
        position: 'relative',
        width: '100%',
        fontFamily: 'Nunito-Bold',
        textAlign: 'center',
        fontSize: RFValue(14),
        color: COLORS.redThemeColorOne,
        marginBottom: RFValue(20)
    },
    playersBtn: {
        position: 'relative',
        width: '100%',
        marginVertical: RFValue(10)
    },
    playersBtnText: {
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        backgroundColor: COLORS.redThemeColorOne,
        color: COLORS.whiteText,
        padding: RFValue(16),
        borderRadius: RFValue(3),
        fontFamily: 'Nunito-SemiBold',
        fontSize: RFValue(10)
    }
});

export default TutorshipSubscriptionScreen;