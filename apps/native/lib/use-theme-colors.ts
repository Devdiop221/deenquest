import { useTheme } from './theme-context';
import { DEEN_COLORS } from './constants';

export function useThemeColors() {
  const { isDark } = useTheme();
  return isDark ? DEEN_COLORS.dark : DEEN_COLORS.light;
}