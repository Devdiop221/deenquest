import { View, Text } from 'react-native';
import {
  Trophy, Award, GraduationCap, Headphones, BookOpen,
  Star, Crown, Zap, Flame, Target, LucideIcon
} from 'lucide-react-native';

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  unlocked?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  Award,
  GraduationCap,
  Headphones,
  BookOpen,
  Star,
  Crown,
  Zap,
  Flame,
  Target,
};

export default function Badge({ name, description, icon, unlocked = false, size = 'medium' }: BadgeProps) {
  const IconComponent = iconMap[icon] || Trophy;

  const sizeClasses = {
    small: {
      container: 'w-16 h-20',
      iconContainer: 'w-12 h-12',
      iconSize: 20,
      textSize: 'text-xs',
    },
    medium: {
      container: 'w-20 h-24',
      iconContainer: 'w-16 h-16',
      iconSize: 24,
      textSize: 'text-sm',
    },
    large: {
      container: 'w-24 h-28',
      iconContainer: 'w-20 h-20',
      iconSize: 28,
      textSize: 'text-base',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <View className={`${currentSize.container} items-center`}>
      <View
        className={`${currentSize.iconContainer} rounded-full items-center justify-center mb-2 ${
          unlocked
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg'
            : 'bg-gray-200'
        }`}
        style={{
          shadowColor: unlocked ? '#fbbf24' : 'transparent',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: unlocked ? 8 : 0,
        }}
      >
        <IconComponent
          size={currentSize.iconSize}
          color={unlocked ? '#ffffff' : '#9ca3af'}
          strokeWidth={2.5}
        />
      </View>
      <Text
        className={`${currentSize.textSize} text-center ${
          unlocked ? 'text-deen-dark' : 'text-gray-400'
        }`}
        style={{
          fontFamily: 'Urbanist_600SemiBold',
          lineHeight: currentSize.textSize === 'text-xs' ? 12 : 16,
        }}
        numberOfLines={2}
      >
        {name}
      </Text>
    </View>
  );
}