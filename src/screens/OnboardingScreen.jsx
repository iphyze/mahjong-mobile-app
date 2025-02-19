import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, FlatList, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/common/ThemeProvider';
import OnBoardingScreenOne from './onBoardingScreens/OnBoardingScreenOne';
import OnBoardingScreenTwo from './onBoardingScreens/OnBoardingScreenTwo';
import OnBoardingScreenThree from './onBoardingScreens/OnBoardingScreenThree';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../utils/colors';

const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('screen').height;

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Define slides data structure
  const slidesData = [
    {
      id: '1',
      component: ({ nextSlide, skipSlides }) => (
        <OnBoardingScreenOne 
          nextSlide={() => nextSlide(1)} 
          skipSlides={() => skipSlides(2)} 
        />
      )
    },
    {
      id: '2',
      component: ({ nextSlide, prevSlide }) => (
        <OnBoardingScreenTwo 
          nextSlide={() => nextSlide(2)} 
          prevSlide={() => prevSlide(0)} 
          navigation={navigation} 
        />
      )
    },
    {
      id: '3',
      component: ({ prevSlide }) => (
        <OnBoardingScreenThree 
          prevSlide={() => prevSlide(1)} 
          navigation={navigation} 
        />
      )
    }
  ];

  const changeSlide = (index) => {
    if (flatListRef.current && index >= 0 && index < slidesData.length) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0
      });
      setCurrentIndex(index);
    }
  };

  // Handle auto-sliding
  useEffect(() => {
    let interval;
    
    if (isReady) {
      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slidesData.length;
        changeSlide(nextIndex);
      }, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentIndex, isReady]);

  // Mark component as ready after initial render
  useEffect(() => {
    setIsReady(true);
  }, []);

  const Pagination = () => (
    <Animatable.View 
      style={styles.paginationWrapper} 
      animation="fadeIn" 
      duration={1000} 
      delay={50}
    >
      {slidesData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationItem,
            currentIndex === index && styles.paginationItemActive
          ]}
        />
      ))}
    </Animatable.View>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.slideContainer}>
      {item.component({
        nextSlide: changeSlide,
        prevSlide: changeSlide,
        skipSlides: changeSlide
      })}
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  return (
    <Animatable.View 
      style={[styles.container, { backgroundColor: theme.background }]}
      animation="fadeIn"
      duration={500}
    >
      <View style={styles.innerContainer}>
        <FlatList
          ref={flatListRef}
          data={slidesData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        <Pagination />
      </View>
    </Animatable.View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  slideContainer: {
    width: width,
    height: height,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: windowHeight * 0.1,
    flexDirection: 'row',
    left: width * 0.05,
  },
  paginationItem: {
    marginHorizontal: 2,
    width: RFValue(20),
    height: RFValue(6),
    borderRadius: RFValue(1),
    backgroundColor: COLORS.whiteText,
  },
  paginationItemActive: {
    backgroundColor: COLORS.redThemeColorOne,
    width: RFValue(27),
    height: RFValue(6.65),
    borderRadius: RFValue(1),
  },
});

export default OnboardingScreen;