// src/screens/ThemeAppearanceScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'; // Added Button import
import { useTheme } from '../components/common/ThemeProvider';
import { useDispatch } from 'react-redux';
import { setThemeMode } from '../store/slices/themeSlice';
import { THEME_MODES } from '../constants/theme';
import { useToast } from '../context/ToastContext';

const ThemeAppearanceScreen = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { showToast } = useToast();

    // Added handleThemeChange function
    const handleThemeChange = (mode) => {
        dispatch(setThemeMode(mode));
        showToast('Theme Changed Successfully!', 'success');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>Theme Update</Text>

            {/* Theme toggle buttons */}
            <View style={styles.buttonContainer}>
                <Button 
                    onPress={() => handleThemeChange(THEME_MODES.LIGHT)} 
                    title="Light" 
                />
                <Button 
                    onPress={() => handleThemeChange(THEME_MODES.DARK)} 
                    title="Dark" 
                />
                <Button 
                    onPress={() => handleThemeChange(THEME_MODES.SYSTEM)} 
                    title="System" 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 20,
        gap: 10 // Space between buttons
    }
});

export default ThemeAppearanceScreen;