import { db } from './index';
import { categories, quizzes } from './schema/deenquest';

async function addMoreQuestions() {
  console.log('📚 Adding more questions...');

  // Get existing categories
  const existingCategories = await db.select().from(categories);
  const categoryMap = existingCategories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // Additional questions for each category
  const additionalQuestions = [
    // More Prophets questions
    {
      title: 'Prophet Adam (AS)',
      question: 'Who was the first human being created by Allah?',
      options: ['Prophet Nuh (AS)', 'Prophet Adam (AS)', 'Prophet Ibrahim (AS)', 'Prophet Musa (AS)'],
      correctAnswerIndex: 1,
      explanation: 'Prophet Adam (AS) was the first human being created by Allah and the father of all humanity.',
      categoryId: categoryMap['Prophets'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Prophet Dawud (AS)',
      question: 'What was Prophet Dawud (AS) famous for?',
      options: ['His beautiful voice', 'His strength', 'His wealth', 'His speed'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Dawud (AS) was blessed with a beautiful voice and the Zabur (Psalms) was revealed to him.',
      categoryId: categoryMap['Prophets'],
      difficulty: 2,
      xpReward: 15,
    },
  {
      title: 'Prophet Yunus (AS)',
      question: 'What happened to Prophet Yunus (AS)?',
      options: ['He was swallowed by a whale', 'He flew to heaven', 'He walked on water', 'He split the moon'],
      correctAnswerIndex: 0,
      explanation: 'Prophet Yunus (AS) was swallowed by a whale and later saved by Allah after he repented.',
      categoryId: categoryMap['Prophets'],
      difficulty: 1,
      xpReward: 10,
    },

    // More Companions questions
    {
      title: 'Bilal ibn Rabah (RA)',
      question: 'What was Bilal (RA) famous for?',
      options: ['Being the first muezzin', 'His poetry', 'His wealth', 'His strength'],
      correctAnswerIndex: 0,
      explanation: 'Bilal ibn Rabah (RA) was the first muezzin (caller to prayer) in Islam and had a beautiful voice.',
      categoryId: categoryMap['Companions'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Hamza ibn Abdul-Muttalib (RA)',
      question: 'What was Hamza (RA) known as?',
      options: ['The Lion of Allah', 'The Sword of Islam', 'The Shield of Faith', 'The Eagle of Mecca'],
      correctAnswerIndex: 0,
      explanation: 'Hamza ibn Abdul-Muttalib (RA) was known as "Asad Allah" (The Lion of Allah) for his bravery.',
      categoryId: categoryMap['Companions'],
      difficulty: 2,
      xpReward: 15,
    },

    // More Morals questions
    {
      title: 'Gratitude',
      question: 'What is the Arabic word for gratitude?',
      options: ['Sabr', 'Shukr', 'Tawakkul', 'Ihsan'],
      correctAnswerIndex: 1,
      explanation: 'Shukr is the Arabic word for gratitude, and Allah loves those who are grateful.',
      categoryId: categoryMap['Morals'],
      difficulty: 1,
      xpReward: 10,
    },
    {
      title: 'Humility',
      question: 'What does Islam teach about pride?',
      options: ['It is good', 'It is forbidden', 'It is sometimes okay', 'It depends on the situation'],
      correctAnswerIndex: 1,
      explanation: 'Islam forbids pride and arrogance, and teaches humility as a virtue.',
      categoryId: categoryMap['Morals'],
      difficulty: 2,
      xpReward: 15,
    },

    // More Battles questions
    {
      title: 'Treaty of Hudaybiyyah',
      question: 'What was the Treaty of Hudaybiyyah?',
      options: ['A peace treaty', 'A trade agreement', 'A marriage contract', 'A land deal'],
      correctAnswerIndex: 0,
      explanation: 'The Treaty of Hudaybiyyah was a peace treaty between Muslims and the Meccan tribes.',
      categoryId: categoryMap['Battles'],
      difficulty: 2,
      xpReward: 15,
    },

    // More Heroes questions
    {
      title: 'Ibn Rushd (Averroes)',
      question: 'What was Ibn Rushd known for?',
      options: ['Medicine', 'Philosophy and law', 'Poetry', 'Architecture'],
      correctAnswerIndex: 1,
      explanation: 'Ibn Rushd (Averroes) was a renowned philosopher and Islamic jurist whose works influenced both Islamic and European thought.',
      categoryId: categoryMap['Heroes'],
      difficulty: 3,
      xpReward: 20,
    },
  ];

  const insertedQuestions = await db.insert(quizzes).values(additionalQuestions).returning();
  console.log(`✅ Added ${insertedQuestions.length} more questions`);

  console.log('🎉 Additional questions added successfully!');
}

addMoreQuestions().catch(console.error);