import { pgTable, text, timestamp, integer, jsonb, boolean, serial, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Categories for organizing content (Prophets, Companions, Battles, Heroes, Morals)
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(), // Icon name or emoji
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Quizzes with multiple choice questions
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of 4 options
  correctAnswerIndex: integer("correct_answer_index").notNull(), // 0-3
  explanation: text("explanation").notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  difficulty: integer("difficulty").default(1), // 1-3 (easy, medium, hard)
  xpReward: integer("xp_reward").default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audio lectures/stories with synchronized text
export const lectures = pgTable("lectures", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  audioUrl: text("audio_url").notNull(),
  textContent: text("text_content").notNull(),
  duration: integer("duration"), // in seconds
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  xpReward: integer("xp_reward").default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User progress tracking for quizzes
export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id).notNull(),
  quizId: uuid("quiz_id").references(() => quizzes.id).notNull(),
  score: integer("score").notNull(), // 0-100
  timeSpent: integer("time_spent"), // in seconds
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// User favorites for quizzes and lectures
export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id).notNull(),
  contentId: uuid("content_id").notNull(), // Can reference quiz or lecture
  contentType: text("content_type").notNull(), // "quiz" | "lecture"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User XP and level tracking
export const userStats = pgTable("user_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id).notNull().unique(),
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  quizzesCompleted: integer("quizzes_completed").default(0),
  lecturesListened: integer("lectures_listened").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Badges/achievements
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: text("requirement").notNull(), // Description of how to earn
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User earned badges
export const userBadges = pgTable("user_badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id).notNull(),
  badgeId: uuid("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});