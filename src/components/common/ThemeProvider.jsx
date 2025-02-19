// src/components/common/ThemeProvider.jsx

import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectThemeMode, initializeTheme } from '../../store/slices/themeSlice';
import { THEME_MODES, lightTheme, darkTheme } from '../../constants/theme';

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  const getActiveTheme = () => {
    if (themeMode === THEME_MODES.SYSTEM) {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === THEME_MODES.DARK ? darkTheme : lightTheme;
  };

  return (
    <ThemeContext.Provider value={getActiveTheme()}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeContext = React.createContext(lightTheme);

export const useTheme = () => React.useContext(ThemeContext);