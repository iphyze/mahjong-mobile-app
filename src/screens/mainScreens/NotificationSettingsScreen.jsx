import React, { useEffect, useState } from 'react';
import { View, Text, Image, Switch, ActivityIndicator, StyleSheet, Platform, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { useNotificationStore } from '../../store/notificationStore';
import { useToast } from '../../context/ToastContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS } from '../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;


const NotificationSettingsScreen = () => {
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
                <Image style={styles.iconImg} source={require('../../../assets/images/splash-icon-white.png')}/>
            </Animatable.View>

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon 
                    icon={faArrowLeftLong} color={COLORS.authText} 
                    style={styles.backBtnIcon}/>
                </TouchableOpacity>
                <Text style={styles.title}>Notification Settings</Text>
            </View>

            <Animatable.Text style={styles.description} animation={'fadeInUp'} delay={500}>
                Manage your notification preferences. Turn notifications on or off based on your preference.
            </Animatable.Text>

            <Animatable.View style={styles.switchContainer} animation={'fadeInUp'} delay={500}>
                <Text style={styles.label}>{localEnabled ? 'Disable' : 'Enable'} Notifications</Text>
                    {loading ? 
                        <ActivityIndicator style={styles.loader} size={RFValue(14)} 
                        color={COLORS.redThemeColorOne} />
                    :
                    <Switch 
                        value={localEnabled} 
                        onValueChange={handleToggle}
                        disabled={loading}
                        thumbColor={Platform.OS === 'android' ? (localEnabled ? "#ff0000" : "#808080") : undefined}
                        trackColor={{ false: "#d3d3d3", true: "#ff9999" }}
                        ios_backgroundColor="#d3d3d3"
                    />
                    }
            </Animatable.View>
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
    description: {
        position: 'relative',
        width: width * 0.9,
        fontSize: RFValue(12),
        lineHeight: RFValue(18),
        fontFamily: 'Nunito-Regular',
        marginTop: RFValue(10),
        marginBottom: RFValue(5),
        alignSelf: 'center',
        color: COLORS.darkText
    },
    switchContainer: {
        position: 'relative',
        width: width * 0.9,
        height: RFValue(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        backgroundColor: COLORS.inputBg,
        marginTop: RFValue(10),
        paddingHorizontal: RFValue(10),
        borderRadius: RFValue(5)
    },
    label: {
        position: 'relative',
        width: '70%',
        fontSize: RFValue(12),
        fontFamily: 'Nunito-SemiBold',
        color: COLORS.redThemeColorOne
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loader: {
        marginTop: RFValue(5),
    }
});

export default NotificationSettingsScreen;