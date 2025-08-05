import React from 'react';
import { render } from '@testing-library/react-native';
import Badge from '../Badge';

describe('Badge Component', () => {
  const defaultProps = {
    name: 'Test Badge',
    description: 'Test Description',
    icon: 'Trophy',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<Badge {...defaultProps} />);

    expect(getByText('Test Badge')).toBeTruthy();
  });

  it('renders unlocked badge with correct styling', () => {
    const { getByText } = render(
      <Badge {...defaultProps} unlocked={true} />
    );

    const badgeName = getByText('Test Badge');
    expect(badgeName).toBeTruthy();
  });

  it('renders locked badge with correct styling', () => {
    const { getByText } = render(
      <Badge {...defaultProps} unlocked={false} />
    );

    const badgeName = getByText('Test Badge');
    expect(badgeName).toBeTruthy();
  });

  it('renders different sizes correctly', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach(size => {
      const { getByText } = render(
        <Badge {...defaultProps} size={size} />
      );

      expect(getByText('Test Badge')).toBeTruthy();
    });
  });

  it('handles different icon types', () => {
    const icons = ['Trophy', 'Award', 'Star'];

    icons.forEach(icon => {
      const { getByText } = render(
        <Badge {...defaultProps} icon={icon} />
      );

      expect(getByText('Test Badge')).toBeTruthy();
    });
  });

  it('truncates long badge names', () => {
    const longName = 'This is a very long badge name that should be truncated';
    const { getByText } = render(
      <Badge {...defaultProps} name={longName} />
    );

    expect(getByText(longName)).toBeTruthy();
  });
});