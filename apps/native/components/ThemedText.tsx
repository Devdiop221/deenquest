import { Text, TextProps } from 'react-native';
import { useThemeColors } from '../lib/use-theme-colors';
import { useTheme } from '../lib/theme-context';

interface ThemedTextProps extends TextProps {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
}

export default function ThemedText({
  variant = 'primary',
  size = 'base',
  weight = 'regular',
  style,
  ...props
}: ThemedTextProps) {
  const colors = useThemeColors();
  const { fontSize: baseFontSize } = useTheme();

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.textSecondary;
      case 'accent':
        return colors.accent;
      default:
        return colors.text;
    }
  };

  const getFontSize = () => {
    const sizeMultipliers = {
      xs: 0.75,
      sm: 0.875,
      base: 1,
      lg: 1.125,
      xl: 1.25,
      '2xl': 1.5,
      '3xl': 1.875,
    };
    return baseFontSize * sizeMultipliers[size];
  };

  const getFontFamily = () => {
    const fontFamilies = {
      light: 'Urbanist_300Light',
      regular: 'Urbanist_400Regular',
      medium: 'Urbanist_500Medium',
      semibold: 'Urbanist_600SemiBold',
      bold: 'Urbanist_700Bold',
    };
    return fontFamilies[weight];
  };

  return (
    <Text
      style={[
        {
          color: getTextColor(),
          fontSize: getFontSize(),
          fontFamily: getFontFamily(),
        },
        style,
      ]}
      {...props}
    />
  );
}