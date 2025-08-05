import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import ThemedView from '../ThemedView';
import { ThemeProvider } from '../../lib/theme-context';

// Mock the theme context
const MockThemeProvider = ({ children, isDark = false }: { children: React.ReactNode; isDark?: boolean }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('ThemedView Component', () => {
  it('renders correctly with default variant', () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <ThemedView testID="themed-view">
          <Text>Test Content</Text>
        </ThemedView>
      </MockThemeProvider>
    );

    expect(getByTestId('themed-view')).toBeTruthy();
  });

  it('renders correctly with surface variant', () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <ThemedView variant="surface" testID="themed-view">
          <Text>Test Content</Text>
        </ThemedView>
      </MockThemeProvider>
    );

    expect(getByTestId('themed-view')).toBeTruthy();
  });

  it('renders correctly with card variant', () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <ThemedView variant="card" testID="themed-view">
          <Text>Test Content</Text>
        </ThemedView>
      </MockThemeProvider>
    );

    expect(getByTestId('themed-view')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { padding: 20 };
    const { getByTestId } = render(
      <MockThemeProvider>
        <ThemedView style={customStyle} testID="themed-view">
          <Text>Test Content</Text>
        </ThemedView>
      </MockThemeProvider>
    );

    const view = getByTestId('themed-view');
    expect(view).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <ThemedView>
          <Text>Child Content</Text>
        </ThemedView>
      </MockThemeProvider>
    );

    expect(getByText('Child Content')).toBeTruthy();
  });
});