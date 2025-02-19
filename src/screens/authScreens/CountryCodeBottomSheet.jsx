import {Dimensions, StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, Image} from 'react-native';
import React, {forwardRef, useImperativeHandle, useCallback, useContext, useState, useEffect} from 'react';
import Animated, {useSharedValue, useAnimatedStyle, withSpring, withTiming, useAnimatedScrollHandler, runOnJS} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import BackDrop from './BackDrop';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '../../components/common/ThemeProvider';
import { COLORS, colors } from '../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Import axios

const CountryCodeBottomSheet = forwardRef(({ country_code, setCountryCode, snapTo, backDropColor, backgroundColor, ...rest}, ref) => {
  const inset = useSafeAreaInsets();
  const {height} = Dimensions.get('screen');
  const percentage = parseFloat(snapTo.replace('%', '')) / 100;
  const closeHeight = height;
  const openHeight = height - height * percentage;
  const topAnimation = useSharedValue(closeHeight);
  const context = useSharedValue(0);
  const scrollBegin = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const [enableScroll, setEnableScroll] = useState(true);
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [focusedField, setFocusedField] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json');
        const countryData = response.data.map(country => ({
          name: country.name,
          flag: `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`,
          phoneCode: country.dial_code,
          countryCode: country.code
        }));
        setCountries(countryData);
        setFilteredCountries(countryData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCountries();
  }, []);


  // console.log(countries);

  const handleCountryCodeSelect = (code) => {
    // setNewData((prev) => ({ ...prev, code: code.phoneCode }));
    setCountryCode(code.phoneCode);
    close();
    setSelectedOption(code.phoneCode);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase().trim())
    );
    setFilteredCountries(filtered);
  };

  const expand = useCallback(() => {
    'worklet';
    topAnimation.value = withTiming(openHeight);
    // Reset the filtered list and search query when expanding
    setFilteredCountries(countries);
    setSearchQuery('');
  }, [openHeight, topAnimation, countries]);
  
  const close = useCallback(() => {
    'worklet';
    topAnimation.value = withTiming(closeHeight);
    // Clear the search and reset filtered countries
    setFilteredCountries(countries);
    setSearchQuery('');
  }, [closeHeight, topAnimation, countries]);

  useImperativeHandle(ref, () => ({ expand, close }), [expand, close]);

  const animationStyle = useAnimatedStyle(() => {
    const top = topAnimation.value;
    return { top };
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = topAnimation.value;
    })
    .onUpdate(event => {
      if (event.translationY < 0) {
        topAnimation.value = withSpring(openHeight, { damping: 100, stiffness: 400 });
      } else {
        topAnimation.value = withSpring(context.value + event.translationY, { damping: 100, stiffness: 400 });
      }
    })
    .onEnd(() => {
      if (topAnimation.value > openHeight + 50) {
        topAnimation.value = withSpring(closeHeight, { damping: 100, stiffness: 400 });
      } else {
        topAnimation.value = withSpring(openHeight, { damping: 100, stiffness: 400 });
      }
    });

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: event => {
      scrollBegin.value = event.contentOffset.y;
    },
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const panScroll = Gesture.Pan()
    .onBegin(() => {
      context.value = topAnimation.value;
    })
    .onUpdate(event => {
      if (event.translationY < 0) {
        topAnimation.value = withSpring(openHeight, {
          damping: 100,
          stiffness: 400,
        });
      } else if (event.translationY > 0 && scrollY.value === 0) {
        runOnJS(setEnableScroll)(false);
        topAnimation.value = withSpring(
          Math.max(
            context.value + event.translationY - scrollBegin.value,
            openHeight,
          ),
          {
            damping: 100,
            stiffness: 400,
          },
        );
      }
    })
    .onEnd(() => {
      runOnJS(setEnableScroll)(true);
      if (topAnimation.value > openHeight + 50) {
        topAnimation.value = withSpring(closeHeight, {
          damping: 100,
          stiffness: 400,
        });
      } else {
        topAnimation.value = withSpring(openHeight, {
          damping: 100,
          stiffness: 400,
        });
      }
    });

  const scrollViewGesture = Gesture.Native();

  const renderItem = useCallback(({ item }) => {
    const { name, flag, phoneCode, countryCode } = item;

    return (
        <TouchableOpacity
          style={[styles.countryItem, selectedOption === name && styles.selectedCountry]} onPress={() => handleCountryCodeSelect(item)} activeOpacity={0.8}>
          <Image source={{ uri: flag }} style={styles.flagIcon}/>
          
          <View style={styles.countryInfo}>
            <Text style={[styles.countryText]}>
              {name} - {countryCode}
            </Text>
            <Text style={[styles.phoneCode]}>
                ({phoneCode})
            </Text>
          </View>

          <FontAwesomeIcon icon={faAngleRight} size={RFValue(11)} style={styles.rightAngle} color={theme === 'dark' ? 
              selectedOption === name ? COLORS.whiteText : COLORS.darkText 
              : selectedOption === name ? COLORS.whiteText : COLORS.darkText} />
        </TouchableOpacity>
      );
    }, [selectedOption, handleCountryCodeSelect, styles, theme]);

  return (
    <>
      <BackDrop
        topAnimation={topAnimation}
        backDropColor={backDropColor}
        closeHeight={closeHeight}
        openHeight={openHeight}
        close={close}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.container,
            animationStyle,
            {
              backgroundColor: backgroundColor,
              paddingBottom: inset.bottom,
            },
          ]}
        >
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
          <Text style={styles.countrySelectText}>Select a country</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={[styles.searchInput, focusedField === 'countrySearch' && styles.focused]}
              placeholder="Search country..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor={COLORS.darkText}
              selectionColor={COLORS.darkText}
              onFocus={() => setFocusedField('countrySearch')}
            />
            <FontAwesomeIcon icon={faSearch} size={RFValue(14)}
              color={theme === 'dark' ? focusedField === 'countrySearch'? COLORS.darkText : COLORS.whiteText
              : focusedField === 'countrySearch' ? COLORS.darkText : COLORS.darkText } style={styles.searchIcon}
            />

            {focusedField === 'countrySearch' && searchQuery !== '' && (
              <TouchableOpacity style={styles.closeIcon}
                onPress={() => {
                  setSearchQuery('');
                  close();
                }}
              >
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size={RFValue(14)}
                  color={theme === 'dark' ? COLORS.darkText : COLORS.darkText}
                />
              </TouchableOpacity>
            )}
          </View>

          <GestureDetector gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}>
            <Animated.FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.name}
              contentContainerStyle={{ 
                paddingBottom: 200,
                paddingTop: 10,
                flexGrow: 1
              }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={enableScroll}
              onScroll={onScroll}
              scrollEventThrottle={16}
              bounces={false}
              renderItem={renderItem}
              ListEmptyComponent={() => (
                loading ? (
                  <Text style={styles.noResultsText}>Loading...</Text>
                ) : (
                  <Text style={styles.noResultsText}>No results found.</Text>
                )
              )}
              style={{ flex: 1 }}
            />
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </>
  );
});

export default CountryCodeBottomSheet;

const createStyles = (theme) => StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      borderTopLeftRadius: RFValue(40),
      borderTopRightRadius: RFValue(40),
      paddingHorizontal: RFValue(15),
      paddingVertical: RFValue(40),
    },
    lineContainer: {
      marginVertical: 10,
      alignItems: 'center',
      position: 'absolute',
      top: 5,
      alignSelf: 'center',
    },
    line: {
      width: 50,
      height: 4,
      backgroundColor: COLORS.darkText,
      borderRadius: 20,
    },
    searchBox: {
      position: 'relative',
      width: '100%',
      height: RFValue(35),
      marginBottom: RFValue(20),
      borderRadius: 5,
    },
    searchInput: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.darkText,
      borderRadius: 50,
      paddingHorizontal: RFValue(30),
      fontSize: RFValue(10),
      fontFamily: 'Montserrat-Regular',
      color: COLORS.darkText,
      borderWidth: 1,
      borderColor: COLORS.darkText,
    },
    searchIcon: {
      position: 'absolute',
      left: RFValue(10),
      top: RFValue(12),
    },
    closeIcon: {
      position: 'absolute',
      right: RFValue(10),
      top: RFValue(12),
    },
    countrySelectText: {
      width: '100%',
      position: 'relative',
      fontSize: RFValue(12),
      fontFamily: 'Montserrat-Medium',
      marginBottom: RFValue(10),
      color: COLORS.darkText,
      marginLeft: 10,
    },
    listContainer: {
      position: 'relative',
      width: '100%',
      borderColor: 'red',
      borderWidth: 1,
      height: 100,
    },
    noResultsText: {
      position: 'relative',
      marginTop: RFValue(20),
      fontSize: RFValue(12),
      color: COLORS.darkText,
      fontFamily: 'Montserrat-Bold',
    },
    focused: {
      borderColor: COLORS.darkText,
    },
    countryItem: {
      position: 'relative',
      width: '100%',
      marginBottom: RFValue(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: COLORS.darkText,
      borderWidth: 1,
      borderColor: COLORS.darkText,
      padding: RFValue(12),
      borderRadius: 5,
    },
    countryInfo: {
        position: 'relative',
        width: '90%',
        marginLeft: '3%',
    },
    countryText: {
      position: 'relative',
      width: '100%',
      color: COLORS.darkText,
      fontSize: RFValue(10),
      fontFamily: 'Montserrat-Medium',
    },
    rightAngle: {
      position: 'absolute',
    //   top: RFValue(13),
      right: RFValue(10),
    },
    selectedCountry: {
      backgroundColor: COLORS.darkText,
      color: COLORS.whiteText
    },
    flagIcon: {
      position: 'relative',
      width: RFValue(18),
      height: RFValue(18),
      borderRadius: RFValue(30),
    },
    phoneCode: {
        fontSize: RFValue(10),
        color: COLORS.darkText,
        marginRight: RFValue(10),
        fontFamily: 'Montserrat-Regular',
        marginTop: RFValue(5)
    },
  });
