import { db, categories, quizzes, lectures, badges } from "./index";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed categories
  const categoryData = [
    {
      name: "Prophets",
      description: "Stories and lessons from the Prophets of Islam",
      icon: "🕌",
    },
    {
      name: "Companions",
      description: "Stories of the noble Companions of Prophet Muhammad (PBUH)",
      icon: "👥",
    },
    {
      name: "Battles",
      description: "Historical Islamic battles and their lessons",
      icon: "⚔️",
    },
    {
      name: "Heroes",
      description: "Islamic heroes and their inspiring stories",
      icon: "🦸",
    },
    {
      name: "Morals",
      description: "Islamic values and moral teachings",
      icon: "💎",
    },
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).returning();
  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  // Get category IDs for reference
  const prophetsCategory = insertedCategories.find(c => c.name === "Prophets")!;
  const companionsCategory = insertedCategories.find(c => c.name === "Companions")!;
  const moralsCategory = insertedCategories.find(c => c.name === "Morals")!;

  // Seed quizzes
  const quizData = [
    {
      title: "Prophet Ibrahim (AS)",
      question: "What was Prophet Ibrahim (AS) known for?",
      options: ["His patience", "His hospitality", "His devotion to Allah", "All of the above"],
      correctAnswerIndex: 3,
      explanation: "Prophet Ibrahim (AS) was known for his unwavering faith, exceptional hospitality, and complete devotion to Allah. He is called 'Khalil Allah' (Friend of Allah).",
      categoryId: prophetsCategory.id,
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: "Prophet Musa (AS)",
      question: "Which miracle was given to Prophet Musa (AS)?",
      options: ["Splitting the sea", "Healing the sick", "Flying", "Controlling weather"],
      correctAnswerIndex: 0,
      explanation: "Prophet Musa (AS) was given the miracle of splitting the Red Sea to save the Israelites from Pharaoh's army.",
      categoryId: prophetsCategory.id,
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: "Abu Bakr (RA)",
      question: "What was Abu Bakr's (RA) title?",
      options: ["Al-Farooq", "As-Siddiq", "Dhul-Nurayn", "Al-Ghani"],
      correctAnswerIndex: 1,
      explanation: "Abu Bakr (RA) was called 'As-Siddiq' (The Truthful) because he immediately believed in the Prophet's night journey (Isra and Mi'raj).",
      categoryId: companionsCategory.id,
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: "Islamic Values",
      question: "Which is considered the most important virtue in Islam?",
      options: ["Courage", "Taqwa (God-consciousness)", "Wealth", "Knowledge"],
      correctAnswerIndex: 1,
      explanation: "Taqwa (God-consciousness) is the highest virtue in Islam. The Quran states: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you.'",
      categoryId: moralsCategory.id,
      difficulty: 1,
      xpReward: 10,
    },
  ];

  const insertedQuizzes = await db.insert(quizzes).values(quizData).returning();
  console.log(`✅ Inserted ${insertedQuizzes.length} quizzes`);

  // Seed lectures
  const lectureData = [
    {
      title: "The Story of Prophet Yusuf (AS)",
      description: "The beautiful story of Prophet Yusuf and his journey from hardship to triumph",
      audioUrl: "/audio/yusuf-story.mp3", // Placeholder URL
      textContent: "Prophet Yusuf (AS) was one of the twelve sons of Prophet Ya'qub (AS). His story is one of patience, forgiveness, and divine wisdom...",
      categoryId: prophetsCategory.id,
      duration: 1200, // 20 minutes
      xpReward: 20,
    },
    {
      title: "The Loyalty of Abu Bakr (RA)",
      description: "How Abu Bakr showed unwavering loyalty to Prophet Muhammad (PBUH)",
      audioUrl: "/audio/abu-bakr-loyalty.mp3", // Placeholder URL
      textContent: "Abu Bakr (RA) was the closest companion of Prophet Muhammad (PBUH). His loyalty was tested many times...",
      categoryId: companionsCategory.id,
      duration: 900, // 15 minutes
      xpReward: 15,
    },
  ];

  const insertedLectures = await db.insert(lectures).values(lectureData).returning();
  console.log(`✅ Inserted ${insertedLectures.length} lectures`);

  // Seed badges
  const badgeData = [
    {
      name: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      requirement: "Complete 1 quiz",
    },
    {
      name: "Knowledge Seeker",
      description: "Complete 10 quizzes",
      icon: "📚",
      requirement: "Complete 10 quizzes",
    },
    {
      name: "Story Listener",
      description: "Listen to your first lecture",
      icon: "👂",
      requirement: "Complete 1 lecture",
    },
    {
      name: "Prophet Scholar",
      description: "Complete all quizzes in the Prophets category",
      icon: "🕌",
      requirement: "Complete all Prophets quizzes",
    },
    {
      name: "Dedicated Student",
      description: "Reach level 5",
      icon: "⭐",
      requirement: "Reach level 5",
    },
  ];

  const insertedBadges = await db.insert(badges).values(badgeData).returning();
  console.log(`✅ Inserted ${insertedBadges.length} badges`);

  console.log("🎉 Database seeded successfully!");
}

// Run the seed function
seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});