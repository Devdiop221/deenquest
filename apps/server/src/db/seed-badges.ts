import { db } from './index';
import { badges } from './schema/badges';

const badgeData = [
  {
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'Trophy',
    condition: JSON.stringify({ type: 'quizzes_completed', value: 1 }),
    xpReward: 10,
  },
  {
    name: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: 'Award',
    condition: JSON.stringify({ type: 'quizzes_completed', value: 10 }),
    xpReward: 50,
  },
  {
    name: 'Scholar',
    description: 'Complete 25 quizzes',
    icon: 'GraduationCap',
    condition: JSON.stringify({ type: 'quizzes_completed', value: 25 }),
    xpReward: 100,
  },
  {
    name: 'Story Listener',
    description: 'Listen to your first story',
    icon: 'Headphones',
    condition: JSON.stringify({ type: 'lectures_listened', value: 1 }),
    xpReward: 10,
  },
  {
    name: 'Story Enthusiast',
    description: 'Listen to 5 stories',
    icon: 'BookOpen',
    condition: JSON.stringify({ type: 'lectures_listened', value: 5 }),
    xpReward: 30,
  },
  {
    name: 'Level Up',
    description: 'Reach level 5',
    icon: 'Star',
    condition: JSON.stringify({ type: 'level_reached', value: 5 }),
    xpReward: 25,
  },
  {
    name: 'Dedicated Learner',
    description: 'Reach level 10',
    icon: 'Crown',
    condition: JSON.stringify({ type: 'level_reached', value: 10 }),
    xpReward: 75,
  },
  {
    name: 'XP Collector',
    description: 'Earn 500 XP',
    icon: 'Zap',
    condition: JSON.stringify({ type: 'xp_earned', value: 500 }),
    xpReward: 50,
  },
  {
    name: 'Consistent',
    description: 'Maintain a 3-day streak',
    icon: 'Flame',
    condition: JSON.stringify({ type: 'streak', value: 3 }),
    xpReward: 30,
  },
  {
    name: 'Dedicated',
    description: 'Maintain a 7-day streak',
    icon: 'Target',
    condition: JSON.stringify({ type: 'streak', value: 7 }),
    xpReward: 75,
  },
];

async function seedBadges() {
  console.log('🏆 Seeding badges...');

  try {
    // Clear existing badges
    await db.delete(badges);

    // Insert new badges
    await db.insert(badges).values(badgeData);

    console.log(`✅ Successfully seeded ${badgeData.length} badges`);
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
  }
}

if (import.meta.main) {
  await seedBadges();
  process.exit(0);
}

export { seedBadges };