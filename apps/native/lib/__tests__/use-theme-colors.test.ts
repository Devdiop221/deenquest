import { renderHook } from '@testing-library/react-native';
import { useThemeColors } from '../use-theme-colors';
import { DEEN_COLORS } from '../constants';

// Mock the theme context
jest.mock('../theme-context', () => ({
  useTheme: () => ({
    isDark: false,
    theme: 'light',
    setTheme: jest.fn(),
    fontSize: 16,
    setFontSize: jest.fn(),
  }),
}));

describe('useThemeColors Hook', () => {
  it('returns light colors when theme is light', () => {
    const { result } = renderHook(() => useThemeColors());

    expect(result.current).toEqual(DEEN_COLORS.light);
  });

  it('returns correct color properties', () => {
    const { result } = renderHook(() => useThemeColors());

    expect(result.current).toHaveProperty('primary');
    expect(result.current).toHaveProperty('secondary');
    expect(result.current).toHaveProperty('accent');
    expect(result.current).toHaveProperty('background');
    expect(result.current).toHaveProperty('text');
  });

  it('returns valid color values', () => {
    const { result } = renderHook(() => useThemeColors());

    // Check that colors are valid hex codes
    expect(result.current.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(result.current.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

// Test with dark theme
describe('useThemeColors Hook - Dark Theme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.doMock('../theme-context', () => ({
      useTheme: () => ({
        isDark: true,
        theme: 'dark',
        setTheme: jest.fn(),
        fontSize: 16,
        setFontSize: jest.fn(),
      }),
    }));
  });

  it('returns dark colors when theme is dark', () => {
    const { result } = renderHook(() => useThemeColors());

    // The colors should be different from light theme
    expect(result.current.background).not.toBe(DEEN_COLORS.light.background);
  });
});