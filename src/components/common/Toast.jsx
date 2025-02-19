// src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';
// import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Toast = ({ message, type = 'success', visible, onHide }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(-100); // Start above the screen

  useEffect(() => {
    if (visible) {
      // Animate in (fade in and slide down)
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT * 0.1, // Slide to 10% from the top
          speed: 15,
          bounciness: 5,
          useNativeDriver: true,
        })
      ]).start();

      // Animate out after delay
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100, // Slide back up
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, styles[type], {opacity, transform: [{ translateY }]}]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, // Changed from bottom to top
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    backgroundColor: '#4caf50',
  },
  error: {
    backgroundColor: '#f44336',
  },
  warning: {
    backgroundColor: '#ff9800',
  },
  info: {
    backgroundColor: '#2196f3',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Toast;




// import React, { useEffect } from 'react';
// import { Animated, Text, StyleSheet, Dimensions, View } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// const SCREEN_HEIGHT = Dimensions.get('window').height;

// const ICONS = {
//   success: { icon: faCheckCircle, color: '#4caf50' },
//   error: { icon: faTimesCircle, color: '#f44336' },
//   warning: { icon: faExclamationTriangle, color: '#ff9800' },
//   info: { icon: faInfoCircle, color: '#2196f3' },
// };

// const Toast = ({ message, type = 'success', visible, onHide }) => {
//   const opacity = new Animated.Value(0);
//   const translateY = new Animated.Value(-100); // Start above the screen

//   useEffect(() => {
//     if (visible) {
//       // Animate in (fade in and slide down)
//       Animated.parallel([
//         Animated.timing(opacity, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.spring(translateY, {
//           toValue: SCREEN_HEIGHT * 0.1, // Slide to 10% from the top
//           speed: 15,
//           bounciness: 5,
//           useNativeDriver: true,
//         }),
//       ]).start();

//       // Animate out after delay
//       const timer = setTimeout(() => {
//         Animated.parallel([
//           Animated.timing(opacity, {
//             toValue: 0,
//             duration: 300,
//             useNativeDriver: true,
//           }),
//           Animated.timing(translateY, {
//             toValue: -100, // Slide back up
//             duration: 300,
//             useNativeDriver: true,
//           }),
//         ]).start(() => onHide());
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         styles[type],
//         { opacity, transform: [{ translateY }] },
//       ]}
//     >
//       <FontAwesomeIcon
//         icon={ICONS[type]?.icon || faInfoCircle}
//         size={24}
//         color={ICONS[type]?.color || '#fff'}
//         style={styles.icon}
//       />
//       <Text style={styles.text}>{message}</Text>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0, // Changed from bottom to top
//     left: 20,
//     right: 20,
//     padding: 15,
//     borderRadius: 8,
//     flexDirection: 'row', // Allows the icon and text to sit side by side
//     alignItems: 'center',
//     zIndex: 999,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   success: {
//     backgroundColor: '#4caf50',
//   },
//   error: {
//     backgroundColor: '#f44336',
//   },
//   warning: {
//     backgroundColor: '#ff9800',
//   },
//   info: {
//     backgroundColor: '#2196f3',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//     marginLeft: 10, // Adds space between the icon and text
//     textAlign: 'center',
//   },
//   icon: {
//     marginRight: 10, // Adds space between the icon and text
//   },
// });

// export default Toast;
