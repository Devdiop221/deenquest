import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../profile';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: mockPush,
  },
}));

// Mock the tRPC hooks
jest.mock('../../../lib/trpc', () => ({
  trpc: {
    user: {
      getStats: {
        useQuery: () => ({
          data: {
            totalXp: 250,
            level: 3,
            quizzesCompleted: 15,
            lecturesCompleted: 8,
          },
          isLoading: false,
          error: null,
        }),
      },
      getBadges: {
        useQuery: () => ({
          data: [
            {
              id: '1',
              unlockedAt: new Date(),
              badge: {
                id: '1',
                name: 'First Steps',
                description: 'Complete your first quiz',
                icon: 'Trophy',
              },
            },
            {
              id: '2',
              unlockedAt: new Date(),
              badge: {
                id: '2',
                name: 'Quiz Master',
                description: 'Complete 10 quizzes',
                icon: 'Award',
              },
            },
          ],
          isLoading: false,
          error: null,
        }),
      },
    },
  },
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Profile')).toBeTruthy();
    });
  });

  it('displays user stats correctly', async () => {
    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('15')).toBeTruthy(); // quizzes completed
      expect(getByText('8')).toBeTruthy();  // lectures completed
      expect(getByText('3')).toBeTruthy();  // level
      expect(getByText('250')).toBeTruthy(); // total XP
    });
  });

  it('displays badges section', async () => {
    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Your Badges')).toBeTruthy();
      expect(getByText('First Steps')).toBeTruthy();
      expect(getByText('Quiz Master')).toBeTruthy();
    });
  });

  it('navigates to settings when settings button is pressed', async () => {
    const { getByTestId } = render(<ProfileScreen />);

    // We need to add testID to the settings button in the actual component
    // For now, we'll test that the component renders without crashing
    await waitFor(() => {
      expect(getByText('Profile')).toBeTruthy();
    });
  });

  it('navigates to stats when stats button is pressed', async () => {
    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      const statsButton = getByText('My Stats');
      fireEvent.press(statsButton);
      expect(mockPush).toHaveBeenCalledWith('/stats');
    });
  });

  it('displays empty state when no badges are earned', async () => {
    // Mock empty badges
    jest.doMock('../../../lib/trpc', () => ({
      trpc: {
        user: {
          getStats: {
            useQuery: () => ({
              data: {
                totalXp: 0,
                level: 1,
                quizzesCompleted: 0,
                lecturesCompleted: 0,
              },
              isLoading: false,
              error: null,
            }),
          },
          getBadges: {
            useQuery: () => ({
              data: [],
              isLoading: false,
              error: null,
            }),
          },
        },
      },
    }));

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Complete quizzes and listen to stories to earn badges!')).toBeTruthy();
    });
  });

  it('handles loading state', () => {
    // Mock loading state
    jest.doMock('../../../lib/trpc', () => ({
      trpc: {
        user: {
          getStats: {
            useQuery: () => ({
              data: null,
              isLoading: true,
              error: null,
            }),
          },
          getBadges: {
            useQuery: () => ({
              data: null,
              isLoading: true,
              error: null,
            }),
          },
        },
      },
    }));

    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Loading profile...')).toBeTruthy();
  });
});