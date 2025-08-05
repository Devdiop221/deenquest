import { View, ViewProps } from 'react-native';
import { useThemeColors } from '../lib/use-theme-colors';

interface ThemedViewProps extends ViewProps {
  variant?: 'background' | 'surface' | 'card';
}

export default function ThemedView({
  variant = 'background',
  style,
  ...props
}: ThemedViewProps) {
  const colors = useThemeColors();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return colors.surface;
      case 'card':
        return colors.cardBackground;
      default:
        return colors.background;
    }
  };

  return (
    <View
      style={[
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      {...props}
    />
  );
}