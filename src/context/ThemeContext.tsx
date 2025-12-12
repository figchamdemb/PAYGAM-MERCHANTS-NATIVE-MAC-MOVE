/**
 * ThemeContext - Dark Mode Support
 * Provides theme state and colors throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Light theme colors
const lightTheme = {
  isDark: false,
  colors: {
    // Primary Brand Colors
    primary: '#1A3C5A',
    secondary: '#B45309',
    accent: '#10B981',

    // Background Colors
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    card: '#FFFFFF',
    modal: '#FFFFFF',

    // Text Colors
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Border Colors
    border: '#E5E7EB',
    borderMedium: '#D1D5DB',
    borderDark: '#9CA3AF',

    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Tab & Navigation
    tabActive: '#B45309',
    tabInactive: '#6B7280',
    tabBackground: '#FFFFFF',

    // Header
    headerBackground: '#1A3C5A',
    headerText: '#FFFFFF',

    // Input
    inputBackground: '#F9FAFB',
    inputBorder: '#E5E7EB',
    inputText: '#111827',
    placeholder: '#9CA3AF',

    // Shadow
    shadow: 'rgba(0, 0, 0, 0.1)',

    // Status Bar
    statusBar: '#1A3C5A',
    statusBarStyle: 'light-content' as const,
  },
};

// Dark theme colors
const darkTheme = {
  isDark: true,
  colors: {
    // Primary Brand Colors
    primary: '#2D5A7B',
    secondary: '#D97706',
    accent: '#34D399',

    // Background Colors
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',
    card: '#1F2937',
    modal: '#1F2937',

    // Text Colors
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    textInverse: '#111827',

    // Border Colors
    border: '#374151',
    borderMedium: '#4B5563',
    borderDark: '#6B7280',

    // Status Colors
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',

    // Tab & Navigation
    tabActive: '#D97706',
    tabInactive: '#9CA3AF',
    tabBackground: '#1F2937',

    // Header
    headerBackground: '#1F2937',
    headerText: '#F9FAFB',

    // Input
    inputBackground: '#374151',
    inputBorder: '#4B5563',
    inputText: '#F9FAFB',
    placeholder: '#6B7280',

    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',

    // Status Bar
    statusBar: '#1F2937',
    statusBarStyle: 'light-content' as const,
  },
};

type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_MODE_KEY = '@dark_mode_enabled';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    loadDarkModeSetting();
  }, []);

  const loadDarkModeSetting = async () => {
    try {
      const saved = await AsyncStorage.getItem(DARK_MODE_KEY);
      if (saved === 'true') {
        setIsDarkMode(true);
      }
    } catch (error) {
      console.log('Error loading dark mode setting:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem(DARK_MODE_KEY, newValue.toString());
    } catch (error) {
      console.log('Error saving dark mode setting:', error);
    }
  };

  const setDarkModeValue = async (value: boolean) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem(DARK_MODE_KEY, value.toString());
    } catch (error) {
      console.log('Error saving dark mode setting:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDarkMode, 
        toggleDarkMode, 
        setDarkMode: setDarkModeValue 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export themes for direct use if needed
export { lightTheme, darkTheme };
export type { Theme };
