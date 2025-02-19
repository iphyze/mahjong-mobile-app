// src/store/slices/themeSlice.js

import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_MODES } from '../../constants/theme';

const initialState = {
  mode: THEME_MODES.SYSTEM,
  isLoading: true
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      // Save to AsyncStorage
      AsyncStorage.setItem('themeMode', action.payload);
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setThemeMode, setIsLoading } = themeSlice.actions;

// Thunk to initialize theme
export const initializeTheme = () => async (dispatch) => {
  try {
    const savedTheme = await AsyncStorage.getItem('themeMode');
    if (savedTheme) {
      dispatch(setThemeMode(savedTheme));
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

// Selector
export const selectThemeMode = (state) => state.theme.mode;

export default themeSlice.reducer;
