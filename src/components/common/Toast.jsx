import React, { useEffect } from 'react';
import { Animated, Text, StyleSheet, Dimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS } from '../../utils/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ICONS = {
  success: { name: 'check-circle', color: COLORS.successText },
  error: { name: 'error', color: COLORS.errText },  
  warning: { name: 'warning', color: COLORS.warningText },
  info: { name: 'info', color: COLORS.infoText },
};

const Toast = ({ message, type = 'success', visible, onHide }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT * 0.1,
          speed: 15,
          bounciness: 5,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, styles[type], { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.lines, styles[`${type}Line`]]}></View>
      <MaterialIcons name={ICONS[type]?.name || 'info'} size={RFValue(16)} color={ICONS[type]?.color || COLORS.infoText} style={styles.icon}/>
      <Text style={[styles.text, styles[`${type}Text`]]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width * 0.9,
    top: 0,
    alignSelf: 'center',
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(12),
    borderRadius: RFValue(5),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    overflow: 'hidden',
    // shadowColor: 'rgba(0, 0, 0, 0, 0.05)',
    // shadowOffset: {
    //   width: 1,
    //   height: 2,
    // },
    // shadowOpacity: 0.8,
    // shadowRadius: 20,
    // elevation: 5,
  },
  success: {
    backgroundColor: COLORS.successBg,
  },
  error: {
    backgroundColor: COLORS.errBg,
  },
  warning: {
    backgroundColor: COLORS.warningBg,
  },
  info: {
    backgroundColor: COLORS.infoBg,
  },
  successText: {
    color: COLORS.successText,
  },
  errorText: {
    color: COLORS.errText,
  },
  warningText: {
    color: COLORS.warningText,
  },
  infoText: {
    color: COLORS.infoText,
  },
  text: {
    width: '85%',
    fontSize: RFValue(11),
    fontFamily: 'Nunito-Medium',
    marginLeft: RFValue(5),
    lineHeight: RFValue(18)
  },
  icon: {
    top: RFValue(1)
  },
  lines: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: RFValue(50),
    width: RFValue(5)
  },
  successLine: {
    backgroundColor: COLORS.successText,
  },
  errorLine: {
    backgroundColor: COLORS.errText,
  },
  warningLine: {
    backgroundColor: COLORS.warningText,
  },
  infoLine: {
    backgroundColor: COLORS.infoText,
  },
});

export default Toast;