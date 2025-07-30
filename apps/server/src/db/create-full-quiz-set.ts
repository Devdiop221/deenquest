import { db } from './index';
import { categories, quizzes } from './schema/deenquest';

async function createFullQuizSet() {
  console.log('🎯 Creating comprehensive quiz set...');

  // Get existing categories
  const existingCategories = await db.select().from(categories);
  const categoryMap = existingCategories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // Comprehensive quiz questions (50+ questions total)
  const comprehensiveQuestions = [
    // Additional Prophets questions (10 more)
    {
      title: 'Prophet Zakariya (AS)',
      question: 'What did Prophet Zakariya (AS) pray for?',
      options: ['Wealth', 'A righteous son', 'Long life', 'Victory in battle'],
      correctAnswerIndex: 1,
      explanation: 'Prophet Zakariya (AS) prayed to Allah for a righteous son, and Allah blessed him with Prophet Yahya (AS).',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Prophet Yahya (AS)',
      question: 'What was special about Prophet Yahya (AS)?',
      options: ['He never sinned', 'He lived in the desert', 'He was very tall', 'He could fly'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Yahya (AS) was blessed with purity and never committed any sin throughout his life.',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Prophet Shuaib (AS)',
      question: 'What was Prophet Shuaib (AS) known for?',
      options: ['His eloquence', 'His strength', 'His wealth', 'His height'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Shuaib (AS) was known as "Khatib al-Anbiya" (The Orator of the Prophets) for his eloquent speech.',
      categoryId: categoryMap['Prophets'],
      difficulty: 3,
      xpReward: 20,
    },
    {
      title: 'Prophet Lut (AS)',
      question: 'Where did Prophet Lut (AS) live?',
      options: ['Sodom and Gomorrah', 'Egypt', 'Babylon', 'Jerusalem'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Lut (AS) lived in Sodom and Gomorrah and warned his people against their immoral behavior.',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Prophet Hud (AS)',
      question: 'Which people did Prophet Hud (AS) preach to?',
      options: ['The people of Ad', 'The people of Thamud', 'The people of Midian', 'The people of Babylon'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Hud (AS) was sent to the people of Ad, who were known for their strength and tall buildings.',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },

    // Additional Companions questions (8 more)
    {
      title: 'Salman al-Farisi (RA)',
      question: 'What strategy did Salman al-Farisi (RA) suggest?',
      options: ['Building a wall', 'Digging a trench', 'Naval attack', 'Night raid'],
      correctAnswerIndex: 1,
      explanation: 'Salman al-Farisi (RA) suggested digging a trench around Medina during the Battle of Khandaq.',
      categoryId: categoryMap['Companions'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Ammar ibn Yasir (RA)',
      question: 'What happened to Ammar\'s parents?',
      options: ['They fled Mecca', 'They were martyred for Islam', 'They became wealthy', 'They moved to Medina'],
      correctAnswerIndex: 1,
      explanation: 'Ammar ibn Yasir\'s parents, Yasir and Sumayyah, were among the first martyrs in Islam.',
      categoryId: categoryMap['Companions'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Abdullah ibn Masud (RA)',
      question: 'What was Abdullah ibn Masud (RA) known for?',
      options: ['His knowledge of Quran', 'His wealth', 'His height', 'His speed'],
      correctAnswerIndex: 0,
      explanation: 'Abdullah ibn Masud (RA) was one of the most knowledgeable companions regarding the Quran.',
      categoryId: categoryMap['Companions'],
      difficulty: 2,
      xpReward: 15,
    },

    // Additional Morals questions (8 more)
    {
      title: 'Justice',
      question: 'What does the Quran say about justice?',
      options: ['It\'s optional', 'It\'s required even with enemies', 'It\'s only for Muslims', 'It depends on the situation'],
      correctAnswerIndex: 1,
      explanation: 'The Quran commands Muslims to be just even with their enemies, as justice is beloved to Allah.',
      categoryId: categoryMap['Morals'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Kindness to Animals',
      question: 'What did Prophet Muhammad (PBUH) teach about animals?',
      options: ['They have no rights', 'We should be kind to them', 'They are only for food', 'They are unimportant'],
      correctAnswerIndex: 1,
      explanation: 'Prophet Muhammad (PBUH) taught that we should be kind to animals and that there is reward in showing mercy to them.',
      categoryId: categoryMap['Morals'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Cleanliness',
      question: 'What did Prophet Muhammad (PBUH) say about cleanliness?',
      options: ['It\'s half of faith', 'It\'s not important', 'It\'s only for prayer', 'It\'s optional'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Muhammad (PBUH) said "Cleanliness is half of faith," emphasizing its importance in Islam.',
      categoryId: categoryMap['Morals'],
      difficulty: 1,
      xpReward: 10,
    },

    // Additional Battles questions (6 more)
    {
      title: 'Battle of Muta',
      question: 'Who led the Muslim army after the commanders were martyred?',
      options: ['Ali (RA)', 'Khalid ibn al-Walid (RA)', 'Umar (RA)', 'Abu Bakr (RA)'],
      correctAnswerIndex: 1,
      explanation: 'Khalid ibn al-Walid (RA) took command at the Battle of Muta and successfully withdrew the Muslim army.',
      categoryId: categoryMap['Battles'],
      difficulty: 3,
      xpReward: 20,
    },
    {
      title: 'Conquest of Khaybar',
      question: 'Who conquered the fortress of Khaybar?',
      options: ['Umar (RA)', 'Abu Bakr (RA)', 'Ali (RA)', 'Khalid (RA)'],
      correctAnswerIndex: 2,
      explanation: 'Ali ibn Abi Talib (RA) conquered the fortress of Khaybar with his famous strength and courage.',
      categoryId: categoryMap['Battles'],
      difficulty: 2,
      xpReward: 15,
    },

    // Additional Heroes questions (8 more)
    {
      title: 'Al-Razi',
      question: 'What was Al-Razi famous for?',
      options: ['Poetry', 'Medicine and chemistry', 'Architecture', 'Mathematics'],
      correctAnswerIndex: 1,
      explanation: 'Al-Razi was a renowned physician and chemist who made significant contributions to medicine.',
      categoryId: categoryMap['Heroes'],
      difficulty: 3,
      xpReward: 20,
    },
    {
      title: 'Ibn Battuta',
      question: 'What was Ibn Battuta known for?',
      options: ['His travels', 'His poetry', 'His wealth', 'His strength'],
      correctAnswerIndex: 0,
      explanation: 'Ibn Battuta was a famous Muslim explorer who traveled extensively throughout the Islamic world and beyond.',
      categoryId: categoryMap['Heroes'],
      difficulty: 2,
      xpReward: 15,
    },
    {
      title: 'Al-Biruni',
      question: 'What did Al-Biruni contribute to?',
      options: ['Astronomy and mathematics', 'Poetry', 'Architecture', 'Medicine'],
      correctAnswerIndex: 0,
      explanation: 'Al-Biruni was a brilliant scholar who made significant contributions to astronomy, mathematics, and geography.',
      categoryId: categoryMap['Heroes'],
      difficulty: 3,
      xpReward: 20,
    },
  ];

  const insertedQuestions = await db.insert(quizzes).values(comprehensiveQuestions).returning();
  console.log(`✅ Added ${insertedQuestions.length} comprehensive questions`);

  // Get total count
  const totalQuizzes = await db.select().from(quizzes);
  console.log(`📊 Total questions in database: ${totalQuizzes.length}`);

  console.log('🎉 Comprehensive quiz set created successfully!');
}

createFullQuizSet().catch(console.error);