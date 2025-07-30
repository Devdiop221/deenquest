import { db } from './index';
import { categories, quizzes, lectures, userProgress, favorites, userStats, userBadges, badges } from './schema/deenquest';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data in the correct order (child tables first)
  console.log('🗑️ Clearing existing data...');
  await db.delete(userBadges);
  await db.delete(badges);
  await db.delete(userStats);
  await db.delete(favorites);
  await db.delete(userProgress);
  await db.delete(lectures);
  await db.delete(quizzes);
  await db.delete(categories);
  console.log('✅ Existing data cleared');

  // Insert categories
  const categoriesData = [
    {
      name: 'Prophets',
      description: 'Learn about the Prophets and Messengers of Allah',
      icon: '🕌',
    },
    {
      name: 'Companions',
      description: 'Stories of the noble Companions of Prophet Muhammad (PBUH)',
      icon: '👥',
    },
    {
      name: 'Morals',
      description: 'Islamic values and moral teachings',
      icon: '💎',
    },
    {
      name: 'Battles',
      description: 'Historic Islamic battles and their lessons',
      icon: '⚔️',
    },
    {
      name: 'Heroes',
      description: 'Great Islamic heroes and their achievements',
      icon: '🏆',
    },
  ];

  const insertedCategories = await db.insert(categories).values(categoriesData).returning();
  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  // Create a map for easy category lookup
  const categoryMap = insertedCategories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // Insert quizzes for each category
  const quizzesData = [
    // Prophets Category
    {
      title: 'Prophet Ibrahim (AS)',
      question: 'What was Prophet Ibrahim (AS) known for?',
      options: ['His patience', 'His hospitality', 'His devotion to Allah', 'All of the above'],
      correctAnswerIndex: 3,
      explanation: 'Prophet Ibrahim (AS) was known for his unwavering faith, exceptional hospitality, and complete devotion to Allah. He is called "Khalil Allah" (Friend of Allah).',
      categoryId: categoryMap['Prophets'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Prophet Musa (AS)',
      question: 'Which miracle was given to Prophet Musa (AS)?',
      options: ['Splitting the sea', 'Healing the sick', 'Speaking to animals', 'Flying'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Musa (AS) was given the miracle of splitting the Red Sea to save the Israelites from Pharaoh\'s army.',
      categoryId: categoryMap['Prophets'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Prophet Yusuf (AS)',
      question: 'What was Prophet Yusuf (AS) famous for?',
      options: ['His strength', 'His beauty and wisdom', 'His wealth', 'His speed'],
      correctAnswerIndex: 1,
      explanation: 'Prophet Yusuf (AS) was renowned for his exceptional beauty and wisdom, which Allah blessed him with.',
      categoryId: categoryMap['Prophets'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Prophet Isa (AS)',
      question: 'What miracle was Prophet Isa (AS) given?',
      options: ['Walking on water', 'Healing the blind and sick', 'Controlling fire', 'Moving mountains'],
      correctAnswerIndex: 1,
      explanation: 'Prophet Isa (AS) was given the miracle of healing the blind, the lepers, and bringing the dead back to life by Allah\'s permission.',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Prophet Nuh (AS)',
      question: 'How long did Prophet Nuh (AS) preach to his people?',
      options: ['40 years', '500 years', '950 years', '1000 years'],
      correctAnswerIndex: 2,
      explanation: 'Prophet Nuh (AS) preached to his people for 950 years, showing incredible patience and perseverance.',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Prophet Sulaiman (AS)',
      question: 'What special ability did Prophet Sulaiman (AS) have?',
      options: ['Flying', 'Understanding animals', 'Invisibility', 'Time travel'],
      correctAnswerIndex: 1,
      explanation: 'Prophet Sulaiman (AS) was given the ability to understand and communicate with animals and jinn.',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },

    // Companions Category
    {
      title: 'Abu Bakr (RA)',
      question: 'What was Abu Bakr\'s (RA) title?',
      options: ['Al-Farooq', 'As-Siddiq', 'Dhul-Nurayn', 'Al-Amin'],
      correctAnswerIndex: 1,
      explanation: 'Abu Bakr (RA) was called "As-Siddiq" (The Truthful) because he immediately believed in the Prophet\'s night journey.',
      categoryId: categoryMap['Companions'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Umar ibn Al-Khattab (RA)',
      question: 'What was Umar (RA) known for?',
      options: ['His justice', 'His strength', 'His wealth', 'His poetry'],
      correctAnswerIndex: 0,
      explanation: 'Umar ibn Al-Khattab (RA) was famous for his justice and was called "Al-Farooq" (The one who distinguishes between right and wrong).',
      categoryId: categoryMap['Companions'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Uthman ibn Affan (RA)',
      question: 'Why was Uthman (RA) called "Dhul-Nurayn"?',
      options: ['He had two lights', 'He married two daughters of the Prophet', 'He owned two houses', 'He had two swords'],
      correctAnswerIndex: 1,
      explanation: 'Uthman (RA) was called "Dhul-Nurayn" (Possessor of Two Lights) because he married two daughters of Prophet Muhammad (PBUH).',
      categoryId: categoryMap['Companions'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Ali ibn Abi Talib (RA)',
      question: 'What was Ali (RA) famous for?',
      options: ['His bravery in battle', 'His knowledge', 'His eloquence', 'All of the above'],
      correctAnswerIndex: 3,
      explanation: 'Ali ibn Abi Talib (RA) was renowned for his courage in battle, vast knowledge, and eloquent speech.',
      categoryId: categoryMap['Companions'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Khadijah (RA)',
      question: 'What was special about Khadijah (RA)?',
      options: ['First Muslim woman', 'Prophet\'s first wife', 'Supported Islam financially', 'All of the above'],
      correctAnswerIndex: 3,
      explanation: 'Khadijah (RA) was the first Muslim woman, the Prophet\'s first wife, and she supported Islam with her wealth.',
      categoryId: categoryMap['Companions'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Aisha (RA)',
      question: 'What was Aisha (RA) known for?',
      options: ['Her knowledge of Hadith', 'Her teaching', 'Her wisdom', 'All of the above'],
      correctAnswerIndex: 3,
      explanation: 'Aisha (RA) was known for her vast knowledge of Hadith, her role as a teacher, and her wisdom in Islamic matters.',
      categoryId: categoryMap['Companions'],
      difficulty: 2,
      xpReward: 15,
    },

    // Morals Category
    {
      title: 'Islamic Values',
      question: 'Which is considered the most important virtue in Islam?',
      options: ['Courage', 'Taqwa (God-consciousness)', 'Wealth', 'Knowledge'],
      correctAnswerIndex: 1,
      explanation: 'Taqwa (God-consciousness) is considered the highest virtue in Islam, as it encompasses fear of Allah and righteous conduct.',
      categoryId: categoryMap['Morals'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Honesty',
      question: 'What was Prophet Muhammad (PBUH) called before his prophethood?',
      options: ['Al-Amin (The Trustworthy)', 'As-Sadiq (The Truthful)', 'Both A and B', 'Al-Hakeem (The Wise)'],
      correctAnswerIndex: 2,
      explanation: 'Prophet Muhammad (PBUH) was known as both "Al-Amin" (The Trustworthy) and "As-Sadiq" (The Truthful) even before his prophethood.',
      categoryId: categoryMap['Morals'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Patience',
      question: 'What is the Arabic word for patience?',
      options: ['Sabr', 'Shukr', 'Tawakkul', 'Ihsan'],
      correctAnswerIndex: 0,
      explanation: 'Sabr is the Arabic word for patience, which is highly valued in Islam and mentioned many times in the Quran.',
      categoryId: categoryMap['Morals'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Charity',
      question: 'What is the third pillar of Islam?',
      options: ['Hajj', 'Salah', 'Zakat', 'Sawm'],
      correctAnswerIndex: 2,
      explanation: 'Zakat (charity) is the third pillar of Islam, emphasizing the importance of helping the poor and needy.',
      categoryId: categoryMap['Morals'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Forgiveness',
      question: 'What does Islam teach about forgiveness?',
      options: ['It\'s optional', 'It\'s better than revenge', 'It\'s weakness', 'It\'s forbidden'],
      correctAnswerIndex: 1,
      explanation: 'Islam teaches that forgiveness is better than revenge, and Allah loves those who forgive others.',
      categoryId: categoryMap['Morals'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Respect for Parents',
      question: 'What comes after worship of Allah in importance?',
      options: ['Prayer', 'Charity', 'Respect for parents', 'Fasting'],
      correctAnswerIndex: 2,
      explanation: 'The Quran places respect and kindness to parents right after the worship of Allah in importance.',
      categoryId: categoryMap['Morals'],
      difficulty: 2,
      xpReward: 15,
    },

    // Battles Category
    {
      title: 'Battle of Badr',
      question: 'When did the Battle of Badr take place?',
      options: ['1st year of Hijra', '2nd year of Hijra', '3rd year of Hijra', '4th year of Hijra'],
      correctAnswerIndex: 1,
      explanation: 'The Battle of Badr took place in the 2nd year of Hijra (624 CE) and was the first major victory for Muslims.',
      categoryId: categoryMap['Battles'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Battle of Uhud',
      question: 'What lesson was learned from the Battle of Uhud?',
      options: ['Always follow orders', 'Unity is strength', 'Patience in adversity', 'All of the above'],
      correctAnswerIndex: 3,
      explanation: 'The Battle of Uhud taught Muslims the importance of following orders, unity, and patience in the face of adversity.',
      categoryId: categoryMap['Battles'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Battle of Khandaq',
      question: 'What strategy was used in the Battle of Khandaq?',
      options: ['Cavalry charge', 'Digging a trench', 'Naval attack', 'Siege warfare'],
      correctAnswerIndex: 1,
      explanation: 'The Battle of Khandaq (Trench) involved digging a trench around Medina, a strategy suggested by Salman al-Farisi (RA).',
      categoryId: categoryMap['Battles'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Conquest of Mecca',
      question: 'How did Muslims conquer Mecca?',
      options: ['Through battle', 'Peacefully', 'By siege', 'Through negotiation'],
      correctAnswerIndex: 1,
      explanation: 'The conquest of Mecca was achieved peacefully, with the Prophet (PBUH) showing mercy and forgiveness to his former enemies.',
      categoryId: categoryMap['Battles'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Battle of Hunayn',
      question: 'What happened at the beginning of the Battle of Hunayn?',
      options: ['Muslims won easily', 'Muslims were initially defeated', 'It was cancelled', 'It lasted for days'],
      correctAnswerIndex: 1,
      explanation: 'At the Battle of Hunayn, Muslims were initially caught off guard and faced difficulties, but eventually achieved victory.',
      categoryId: categoryMap['Battles'],
      difficulty: 3,
      xpReward: 20,
    },
    {
      title: 'Battle of Tabuk',
      question: 'What was unique about the Battle of Tabuk?',
      options: ['It was the largest battle', 'No actual fighting occurred', 'It was at sea', 'It lasted a year'],
      correctAnswerIndex: 1,
      explanation: 'The Battle of Tabuk was unique because no actual fighting took place - it was more of a military expedition that demonstrated Muslim strength.',
      categoryId: categoryMap['Battles'],
      difficulty: 3,
      xpReward: 20,
    },

    // Heroes Category
    {
      title: 'Khalid ibn al-Walid (RA)',
      question: 'What was Khalid ibn al-Walid (RA) known as?',
      options: ['The Lion of Allah', 'The Sword of Allah', 'The Shield of Islam', 'The Eagle of Arabia'],
      correctAnswerIndex: 1,
      explanation: 'Khalid ibn al-Walid (RA) was known as "Sayf Allah al-Maslul" (The Drawn Sword of Allah) for his military prowess.',
      categoryId: categoryMap['Heroes'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Saladin (Salah ad-Din)',
      question: 'What was Saladin famous for?',
      options: ['Conquering Spain', 'Liberating Jerusalem', 'Building mosques', 'Writing poetry'],
      correctAnswerIndex: 1,
      explanation: 'Saladin (Salah ad-Din) was famous for liberating Jerusalem from the Crusaders in 1187 CE.',
      categoryId: categoryMap['Heroes'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Harun al-Rashid',
      question: 'During which period did Harun al-Rashid rule?',
      options: ['Umayyad Caliphate', 'Abbasid Caliphate', 'Ottoman Empire', 'Fatimid Caliphate'],
      correctAnswerIndex: 1,
      explanation: 'Harun al-Rashid was the fifth Abbasid Caliph and ruled during the Islamic Golden Age.',
      categoryId: categoryMap['Heroes'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Ibn Sina (Avicenna)',
      question: 'What was Ibn Sina famous for?',
      options: ['Mathematics', 'Medicine and philosophy', 'Poetry', 'Architecture'],
      correctAnswerIndex: 1,
      explanation: 'Ibn Sina (Avicenna) was a renowned physician and philosopher whose medical texts were used in Europe for centuries.',
      categoryId: categoryMap['Heroes'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Al-Khwarizmi',
      question: 'What did Al-Khwarizmi contribute to?',
      options: ['Algebra and mathematics', 'Medicine', 'Astronomy', 'Literature'],
      correctAnswerIndex: 0,
      explanation: 'Al-Khwarizmi is known as the father of algebra and made significant contributions to mathematics and astronomy.',
      categoryId: categoryMap['Heroes'],
      difficulty: 3,
      xpReward: 20,
    },
    {
      title: 'Fatima al-Fihri',
      question: 'What did Fatima al-Fihri establish?',
      options: ['A hospital', 'The first university', 'A library', 'A mosque'],
      correctAnswerIndex: 1,
      explanation: 'Fatima al-Fihri established the University of al-Qarawiyyin in Morocco, considered the world\'s first university.',
      categoryId: categoryMap['Heroes'],
      difficulty: 3,
      xpReward: 20,
    },
  ];

  const insertedQuizzes = await db.insert(quizzes).values(quizzesData).returning();
  console.log(`✅ Inserted ${insertedQuizzes.length} quizzes`);

  // Insert some sample lectures
  const lecturesData = [
    {
      title: 'The Story of Prophet Yusuf (AS)',
      description: 'The beautiful story of Prophet Yusuf and his journey from hardship to triumph',
      audioUrl: '/audio/yusuf-story.mp3',
      textContent: 'The story of Prophet Yusuf (AS) is one of the most beautiful stories in the Quran...',
      duration: 1800, // 30 minutes
      categoryId: categoryMap['Prophets'],
      xpReward: 20,
    },
    {
      title: 'The Loyalty of Abu Bakr (RA)',
      description: 'How Abu Bakr showed unwavering loyalty to Prophet Muhammad (PBUH)',
      audioUrl: '/audio/abu-bakr-loyalty.mp3',
      textContent: 'Abu Bakr (RA) demonstrated incredible loyalty and faith...',
      duration: 900, // 15 minutes
      categoryId: categoryMap['Companions'],
      xpReward: 15,
    },
    {
      title: 'The Importance of Honesty',
      description: 'Learn about the virtue of honesty in Islam',
      audioUrl: '/audio/honesty-virtue.mp3',
      textContent: 'Honesty is one of the most important virtues in Islam...',
      duration: 600, // 10 minutes
      categoryId: categoryMap['Morals'],
      xpReward: 10,
    },
    {
      title: 'The Battle of Badr: Victory Against All Odds',
      description: 'The miraculous victory at the Battle of Badr',
      audioUrl: '/audio/battle-badr.mp3',
      textContent: 'The Battle of Badr was a turning point in Islamic history...',
      duration: 1200, // 20 minutes
      categoryId: categoryMap['Battles'],
      xpReward: 18,
    },
    {
      title: 'Saladin: The Noble Warrior',
      description: 'The story of Saladin and his noble character',
      audioUrl: '/audio/saladin-story.mp3',
      textContent: 'Saladin was known not only for his military prowess but also for his noble character...',
      duration: 1500, // 25 minutes
      categoryId: categoryMap['Heroes'],
      xpReward: 22,
    },
  ];

  const insertedLectures = await db.insert(lectures).values(lecturesData).returning();
  console.log(`✅ Inserted ${insertedLectures.length} lectures`);

  console.log('🎉 Database seeded successfully!');
  console.log(`📊 Summary:
  - Categories: ${insertedCategories.length}
  - Quizzes: ${insertedQuizzes.length}
  - Lectures: ${insertedLectures.length}

  📚 Questions by category:
  - Prophets: ${quizzesData.filter(q => q.categoryId === categoryMap['Prophets']).length} questions
  - Companions: ${quizzesData.filter(q => q.categoryId === categoryMap['Companions']).length} questions
  - Morals: ${quizzesData.filter(q => q.categoryId === categoryMap['Morals']).length} questions
  - Battles: ${quizzesData.filter(q => q.categoryId === categoryMap['Battles']).length} questions
  - Heroes: ${quizzesData.filter(q => q.categoryId === categoryMap['Heroes']).length} questions`);
}

seed().catch(console.error);

seed().catch(console.error);