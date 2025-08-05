import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from './use-color-scheme';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@deenquest_theme';
const FONT_SIZE_STORAGE_KEY = '@deenquest_font_size';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [fontSize, setFontSizeState] = useState(16);
  const { colorScheme } = useColorScheme();

  // Determine if dark mode should be active
  const isDark = theme === 'dark' || (theme === 'system' && colorScheme === 'dark');

  // Load saved preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const savedFontSize = await AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY);

      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
      if (savedFontSize) {
        setFontSizeState(parseInt(savedFontSize, 10));
      }
    } catch (error) {
      console.error('Failed to load theme preferences:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setFontSize = async (size: number) => {
    try {
      setFontSizeState(size);
      await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, size.toString());
    } catch (error) {
      console.error('Failed to save font size preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}