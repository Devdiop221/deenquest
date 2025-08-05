import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../index';

// Mock the tRPC hook
jest.mock('../../../lib/trpc', () => ({
  trpc: {
    categories: {
      getAll: {
        useQuery: () => ({
          data: [
            {
              id: '1',
              name: 'Prophets',
              description: 'Stories of the Prophets',
              icon: 'User',
            },
            {
              id: '2',
              name: 'Companions',
              description: 'Stories of the Companions',
              icon: 'Users',
            },
          ],
          isLoading: false,
          error: null,
        }),
      },
    },
    quizzes: {
      getAll: {
        useQuery: () => ({
          data: [
            {
              id: '1',
              title: 'Prophet Quiz',
              question: 'Who was the first Prophet?',
              categoryId: '1',
            },
          ],
          isLoading: false,
          error: null,
        }),
      },
    },
    lectures: {
      getAll: {
        useQuery: () => ({
          data: [
            {
              id: '1',
              title: 'Story of Adam',
              content: 'The story of Prophet Adam...',
              categoryId: '1',
            },
          ],
          isLoading: false,
          error: null,
        }),
      },
    },
  },
}));

// Mock the theme context
jest.mock('../../../lib/theme-context', () => ({
  useTheme: () => ({
    isDark: false,
    theme: 'light',
    setTheme: jest.fn(),
    fontSize: 16,
    setFontSize: jest.fn(),
  }),
}));

describe('HomeScreen', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('DeenQuest')).toBeTruthy();
    });
  });

  it('displays categories when loaded', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Prophets')).toBeTruthy();
      expect(getByText('Companions')).toBeTruthy();
    });
  });

  it('displays quick actions section', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Quick Actions')).toBeTruthy();
      expect(getByText('Random Quiz')).toBeTruthy();
      expect(getByText('Search')).toBeTruthy();
    });
  });

  it('displays recent activity section', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Recent Activity')).toBeTruthy();
    });
  });

  it('handles loading state', () => {
    // Mock loading state
    jest.doMock('../../../lib/trpc', () => ({
      trpc: {
        categories: {
          getAll: {
            useQuery: () => ({
              data: null,
              isLoading: true,
              error: null,
            }),
          },
        },
        quizzes: {
          getAll: {
            useQuery: () => ({
              data: null,
              isLoading: true,
              error: null,
            }),
          },
        },
        lectures: {
          getAll: {
            useQuery: () => ({
              data: null,
              isLoading: true,
              error: null,
            }),
          },
        },
      },
    }));

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Loading...')).toBeTruthy();
  });
});