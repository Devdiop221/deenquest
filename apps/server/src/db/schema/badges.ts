import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const badges = pgTable('badges', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // Lucide icon name
  condition: text('condition').notNull(), // JSON string describing unlock condition
  xpReward: integer('xp_reward').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull(),
  badgeId: text('badge_id').notNull().references(() => badges.id),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
});

export const userStats = pgTable('user_stats', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().unique(),
  totalXp: integer('total_xp').default(0),
  level: integer('level').default(1),
  quizzesCompleted: integer('quizzes_completed').default(0),
  lecturesListened: integer('lectures_listened').default(0),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastActivityDate: timestamp('last_activity_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});